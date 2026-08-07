from decimal import Decimal

from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.models.vendor import Vendor
from app.models.product import Product
from app.models.order_item import OrderItem
from app.models.order import Order
from app.models.category import Category
from app.services.benchmark_service import get_vendor_benchmark


def get_vendor_dashboard_analytics(db: Session, user):

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == user.user_id)
        .first()
    )

    if vendor is None:
        return None

    # ====================================================
    # Monthly Revenue
    # ====================================================

    revenue_rows = (
        db.query(
            extract("month", Order.order_date).label("month"),
            func.coalesce(
                func.sum(OrderItem.quantity * OrderItem.price),
                0
            ).label("revenue"),
        )
        .join(
            Order,
            Order.order_id == OrderItem.order_id
        )
        .filter(
            OrderItem.vendor_id == vendor.vendor_id
        )
        .group_by(
            extract("month", Order.order_date)
        )
        .order_by(
            extract("month", Order.order_date)
        )
        .all()
    )

    month_names = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    monthly_revenue = []

    for row in revenue_rows:
        monthly_revenue.append(
            {
                "month": month_names[int(row.month)],
                "revenue": float(row.revenue),
            }
        )

    # ====================================================
    # Revenue by Category
    # ====================================================

    category_rows = (
        db.query(
            Category.category_name,
            func.coalesce(
                func.sum(OrderItem.quantity * OrderItem.price),
                0
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
            Product.vendor_id == vendor.vendor_id
        )
        .group_by(
            Category.category_name
        )
        .all()
    )

    revenue_by_category = []

    for row in category_rows:
        revenue_by_category.append(
            {
                "category": row.category_name,
                "revenue": float(row.revenue),
            }
        )

    # ====================================================
    # Top Products
    # ====================================================

    product_rows = (
        db.query(
            Product.product_name,
            func.sum(OrderItem.quantity).label(
                "units_sold"
            ),
        )
        .join(
            OrderItem,
            Product.product_id == OrderItem.product_id,
        )
        .filter(
            Product.vendor_id == vendor.vendor_id
        )
        .group_by(
            Product.product_name
        )
        .order_by(
            func.sum(OrderItem.quantity).desc()
        )
        .limit(5)
        .all()
    )

    top_products = []

    for row in product_rows:
        top_products.append(
            {
                "product_name": row.product_name,
                "units_sold": row.units_sold,
            }
        )

    # ====================================================
    # Summary Numbers
    # ====================================================

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

    # ====================================================
    # Marketplace Health
    # ====================================================

    score = 50

    if total_products > 5:
        score += 10

    if total_orders > 10:
        score += 15

    if float(total_revenue) > 10000:
        score += 15

    if len(category_rows) >= 3:
        score += 10

    score = min(score, 100)

    if score >= 90:
        status = "Excellent"
    elif score >= 75:
        status = "Good"
    elif score >= 60:
        status = "Average"
    else:
        status = "Needs Improvement"

    # ====================================================
    # AI Insights
    # ====================================================

    ai_insights = []

    if revenue_by_category:

        best = max(
            revenue_by_category,
            key=lambda x: x["revenue"]
        )

        ai_insights.append(
            {
                "title": "Top Category",
                "description": f"{best['category']} generated the highest revenue.",
                "level": "SUCCESS",
            }
        )

    if top_products:

        ai_insights.append(
            {
                "title": "Best Seller",
                "description": f"{top_products[0]['product_name']} is your best-selling product.",
                "level": "INFO",
            }
        )

    if total_orders < 5:

        ai_insights.append(
            {
                "title": "Sales Opportunity",
                "description": "Increase marketing efforts to improve order volume.",
                "level": "WARNING",
            }
        )

    if total_products < 5:

        ai_insights.append(
            {
                "title": "Inventory",
                "description": "Adding more products could improve customer engagement.",
                "level": "INFO",
            }
        )


    benchmark = get_vendor_benchmark(
    db,
    vendor.vendor_id,
    )


    # ====================================================
    # Final Response
    # ====================================================

    return {
        "monthly_revenue": monthly_revenue,
        "revenue_by_category": revenue_by_category,
        "top_products": top_products,
        "health": {
            "score": score,
            "status": status,
        },
        "benchmark": benchmark,
        "ai_insights": ai_insights,
    }