from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.vendor import Vendor
from app.models.product import Product
from app.models.order_item import OrderItem
from app.models.category import Category

from app.services.benchmark_service import (
    get_vendor_benchmark,
)

from app.services.ai_service import (
    generate_ai_analysis,
)


def get_vendor_ai_analysis(
    db: Session,
    user,
):

    # ============================================
    # Vendor
    # ============================================

    vendor = (
        db.query(Vendor)
        .filter(
            Vendor.user_id == user.user_id
        )
        .first()
    )

    if vendor is None:
        return None

    # ============================================
    # Benchmark
    # ============================================

    benchmark = get_vendor_benchmark(
        db,
        vendor.vendor_id,
    )

    # ============================================
    # Top Category
    # ============================================

    category = (
        db.query(
            Category.category_name,
            func.sum(
                OrderItem.quantity *
                OrderItem.price
            ).label("revenue"),
        )
        .join(
            Product,
            Product.category_id == Category.category_id,
        )
        .join(
            OrderItem,
            OrderItem.product_id == Product.product_id,
        )
        .filter(
            Product.vendor_id == vendor.vendor_id,
        )
        .group_by(
            Category.category_name,
        )
        .order_by(
            func.sum(
                OrderItem.quantity *
                OrderItem.price
            ).desc()
        )
        .first()
    )

    # ============================================
    # Top Product
    # ============================================

    product = (
        db.query(
            Product.product_name,
            func.sum(
                OrderItem.quantity
            ).label("units_sold"),
        )
        .join(
            OrderItem,
            Product.product_id == OrderItem.product_id,
        )
        .filter(
            Product.vendor_id == vendor.vendor_id,
        )
        .group_by(
            Product.product_name,
        )
        .order_by(
            func.sum(
                OrderItem.quantity
            ).desc()
        )
        .first()
    )

    # ============================================
    # Marketplace Health Score
    # ============================================

    total_products = (
        db.query(Product)
        .filter(
            Product.vendor_id == vendor.vendor_id
        )
        .count()
    )

    total_orders = (
        db.query(
            func.count(
                func.distinct(
                    OrderItem.order_id
                )
            )
        )
        .filter(
            OrderItem.vendor_id == vendor.vendor_id
        )
        .scalar()
    )

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(
                    OrderItem.quantity *
                    OrderItem.price
                ),
                0,
            )
        )
        .filter(
            OrderItem.vendor_id == vendor.vendor_id
        )
        .scalar()
    )

    score = 50

    if total_products > 5:
        score += 10

    if total_orders > 10:
        score += 15

    if float(total_revenue) > 10000:
        score += 15

    category_count = (
        db.query(
            func.count(
                func.distinct(
                    Product.category_id
                )
            )
        )
        .filter(
            Product.vendor_id == vendor.vendor_id
        )
        .scalar()
    )

    if category_count >= 3:
        score += 10

    score = min(score, 100)

    if score >= 90:
        health_status = "Excellent"
    elif score >= 75:
        health_status = "Good"
    elif score >= 60:
        health_status = "Average"
    else:
        health_status = "Needs Improvement"

    # ============================================
    # AI Payload
    # ============================================

    analytics = {
        "vendor_rank": benchmark["vendor_rank"],
        "total_vendors": benchmark["total_vendors"],
        "percentile": benchmark["percentile"],
        "vendor_revenue": benchmark["vendor_revenue"],
        "market_average_revenue": benchmark["market_average_revenue"],
        "health_score": score,
        "health_status": health_status,
        "top_category": (
            category.category_name
            if category
            else None
        ),
        "top_product": (
            product.product_name
            if product
            else None
        ),
    }

    # ============================================
    # Generate AI Analysis
    # ============================================

    return generate_ai_analysis(
        analytics
    )