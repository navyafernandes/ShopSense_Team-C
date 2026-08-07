from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.customer import Customer
from app.models.vendor import Vendor
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.category import Category

from app.services.analytics_service import (
    get_dashboard_summary,
    get_vendor_analytics,
)


def get_marketplace_intelligence(db: Session):

    dashboard = get_dashboard_summary(db)

    vendor_ranking = get_vendor_analytics(db)

    # ---------------------------------------
    # Marketplace Health
    # ---------------------------------------

    inventory = db.query(Inventory).all()

    healthy_stock = sum(
        1
        for item in inventory
        if item.stock_quantity > item.reorder_level
    )

    health_score = 100

    if inventory:

        health_score = round(
            healthy_stock / len(inventory) * 100
        )

    if health_score >= 85:
        status = "Excellent"

    elif health_score >= 70:
        status = "Good"

    elif health_score >= 50:
        status = "Average"

    else:
        status = "Critical"

    health = {
        "score": health_score,
        "status": status,
    }

    # ---------------------------------------
    # Customer Intelligence
    # ---------------------------------------

    total_customers = dashboard["total_customers"]

    returning_customers = (
        db.query(Order.customer_id)
        .group_by(Order.customer_id)
        .having(func.count(Order.order_id) > 1)
        .count()
    )

    premium_customers = (
        db.query(Order.customer_id)
        .group_by(Order.customer_id)
        .having(func.sum(Order.total_amount) > 100000)
        .count()
    )

    average_order_value = (
        db.query(
            func.avg(Order.total_amount)
        ).scalar()
        or 0
    )

    customer = {
        "total_customers": total_customers,
        "returning_customers": returning_customers,
        "premium_customers": premium_customers,
        "average_order_value": round(
            float(average_order_value),
            2,
        ),
    }

    # ---------------------------------------
    # Revenue Forecast
    # ---------------------------------------

    revenue = float(
        dashboard["total_revenue"]
    )

    predicted = revenue * 1.08

    forecast = {
        "current_revenue": revenue,
        "predicted_revenue": round(
            predicted,
            2,
        ),
        "growth_percentage": 8.0,
    }

    # ---------------------------------------
    # Category Revenue
    # ---------------------------------------

    categories = (
        db.query(
            Category.category_name,
            func.sum(
                OrderItem.quantity *
                OrderItem.price
            ).label("revenue")
        )
        .join(
            Product,
            Category.category_id ==
            Product.category_id
        )
        .join(
            OrderItem,
            Product.product_id ==
            OrderItem.product_id
        )
        .group_by(
            Category.category_name
        )
        .order_by(
            func.sum(
                OrderItem.quantity *
                OrderItem.price
            ).desc()
        )
        .all()
    )

    category_revenue = [
        {
            "category": row.category_name,
            "revenue": float(row.revenue),
        }
        for row in categories
    ]

    # ---------------------------------------
    # AI Insights
    # ---------------------------------------

    ai = []

    if vendor_ranking:

        ai.append(
            {
                "title": "Top Vendor",
                "description":
                f"{vendor_ranking[0]['vendor_name']} currently leads marketplace revenue.",
                "level": "SUCCESS",
            }
        )

    if category_revenue:

        ai.append(
            {
                "title": "Top Category",
                "description":
                f"{category_revenue[0]['category']} contributes the highest revenue.",
                "level": "INFO",
            }
        )

    if health_score < 70:

        ai.append(
            {
                "title": "Inventory Warning",
                "description":
                "Marketplace inventory health requires attention.",
                "level": "WARNING",
            }
        )

    else:

        ai.append(
            {
                "title": "Healthy Marketplace",
                "description":
                "Overall inventory health is stable.",
                "level": "SUCCESS",
            }
        )

    if returning_customers > total_customers * 0.5:

        ai.append(
            {
                "title": "Customer Loyalty",
                "description":
                "More than half of customers are repeat buyers.",
                "level": "SUCCESS",
            }
        )

    return {
        "health": health,
        "forecast": forecast,
        "customer": customer,
        "vendor_ranking": vendor_ranking,
        "category_revenue": category_revenue,
        "ai_insights": ai,
    }