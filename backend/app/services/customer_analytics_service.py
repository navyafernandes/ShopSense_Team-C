from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.category import Category


MONTHS = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
}


def get_customer_analytics(db: Session, user):

    customer = (
        db.query(Customer)
        .filter(Customer.user_id == user.user_id)
        .first()
    )

    if customer is None:
        return None

    # ==========================================
    # SUMMARY
    # ==========================================

    total_spent = (
        db.query(
            func.coalesce(
                func.sum(Order.total_amount),
                0
            )
        )
        .filter(
            Order.customer_id == customer.customer_id
        )
        .scalar()
    )

    total_orders = (
        db.query(Order)
        .filter(
            Order.customer_id == customer.customer_id
        )
        .count()
    )

    average_order = (
        db.query(
            func.coalesce(
                func.avg(Order.total_amount),
                0
            )
        )
        .filter(
            Order.customer_id == customer.customer_id
        )
        .scalar()
    )

    categories_purchased = (
        db.query(
            func.count(
                func.distinct(Product.category_id)
            )
        )
        .join(
            OrderItem,
            Product.product_id == OrderItem.product_id
        )
        .join(
            Order,
            Order.order_id == OrderItem.order_id
        )
        .filter(
            Order.customer_id == customer.customer_id
        )
        .scalar()
    )

    summary = {
        "total_spent": float(total_spent),
        "total_orders": total_orders,
        "average_order": round(float(average_order), 2),
        "categories_purchased": categories_purchased,
    }

    # ==========================================
    # MONTHLY SPENDING
    # ==========================================

    monthly = (
        db.query(
            extract("month", Order.order_date).label("month"),
            func.sum(Order.total_amount).label("amount")
        )
        .filter(
            Order.customer_id == customer.customer_id
        )
        .group_by(
            extract("month", Order.order_date)
        )
        .order_by(
            extract("month", Order.order_date)
        )
        .all()
    )

    monthly_spending = [
        {
            "month": MONTHS[int(row.month)],
            "amount": float(row.amount),
        }
        for row in monthly
    ]

    # ==========================================
    # CATEGORY BREAKDOWN
    # ==========================================

    categories = (
        db.query(
            Category.category_name,
            func.sum(
                OrderItem.quantity *
                OrderItem.price
            ).label("amount")
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
        .join(
            Order,
            Order.order_id ==
            OrderItem.order_id
        )
        .filter(
            Order.customer_id == customer.customer_id
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

    category_breakdown = [
        {
            "category": row.category_name,
            "amount": float(row.amount),
        }
        for row in categories
    ]

    # ==========================================
    # BRAND BREAKDOWN
    # ==========================================

    brands = (
        db.query(
            Product.brand,
            func.sum(
                OrderItem.quantity *
                OrderItem.price
            ).label("amount")
        )
        .join(
            OrderItem,
            Product.product_id ==
            OrderItem.product_id
        )
        .join(
            Order,
            Order.order_id ==
            OrderItem.order_id
        )
        .filter(
            Order.customer_id == customer.customer_id
        )
        .group_by(
            Product.brand
        )
        .order_by(
            func.sum(
                OrderItem.quantity *
                OrderItem.price
            ).desc()
        )
        .limit(8)
        .all()
    )

    brand_breakdown = [
        {
            "brand": row.brand or "Unknown",
            "amount": float(row.amount),
        }
        for row in brands
    ]

    # ==========================================
    # ORDER STATUS
    # ==========================================

    delivered = (
        db.query(Order)
        .filter(
            Order.customer_id == customer.customer_id,
            Order.order_status == "DELIVERED"
        )
        .count()
    )

    pending = (
        db.query(Order)
        .filter(
            Order.customer_id == customer.customer_id,
            Order.order_status == "PENDING"
        )
        .count()
    )

    shipped = (
        db.query(Order)
        .filter(
            Order.customer_id == customer.customer_id,
            Order.order_status == "SHIPPED"
        )
        .count()
    )

    cancelled = (
        db.query(Order)
        .filter(
            Order.customer_id == customer.customer_id,
            Order.order_status == "CANCELLED"
        )
        .count()
    )

    order_status = {
        "delivered": delivered,
        "pending": pending,
        "shipped": shipped,
        "cancelled": cancelled,
    }

    # ==========================================
    # AI INSIGHTS
    # ==========================================

    insights = []

    if category_breakdown:

        insights.append({
            "title": "Favourite Category",
            "description": f"You spend the most on {category_breakdown[0]['category']}.",
            "level": "SUCCESS",
        })

    if brand_breakdown:

        insights.append({
            "title": "Favourite Brand",
            "description": f"Your most purchased brand is {brand_breakdown[0]['brand']}.",
            "level": "INFO",
        })

    if delivered > cancelled:

        insights.append({
            "title": "Reliable Shopping",
            "description": "Most of your orders are delivered successfully.",
            "level": "SUCCESS",
        })

    if total_spent > 50000:
        insights.append({
            "title": "Premium Shopper",
            "description": "You are among the platform's high-value customers.",
            "level": "SUCCESS",
        })
    fav_cat = category_breakdown[0]["category"] if category_breakdown else "N/A"
    fav_brand = brand_breakdown[0]["brand"] if brand_breakdown else "N/A"

    if total_spent >= 100000:
        segment = "Premium Champion"
    elif total_orders >= 5:
        segment = "Loyal Customer"
    elif total_orders >= 1:
        segment = "Active Shopper"
    else:
        segment = "New Customer"

    # Repeat purchase calculation
    repeat_rate = 0.0
    if total_orders > 1:
        repeat_rate = round(min(100.0, ((total_orders - 1) / total_orders) * 100), 1)

    summary["favorite_category"] = fav_cat
    summary["favorite_brand"] = fav_brand
    summary["customer_segment"] = segment
    summary["repeat_purchase_rate"] = repeat_rate

    # ==========================================
    # REAL PRODUCT RECOMMENDATIONS
    # ==========================================
    from app.services.recommendation_service import get_recommendations
    try:
        rec_data = get_recommendations(db, customer.customer_id)
        recommended_products = rec_data.recommended_products
    except Exception as e:
        recommended_products = []

    recommendations = []

    # ==========================================
    # RESPONSE
    # ==========================================

    return {
        "summary": summary,
        "monthly_spending": monthly_spending,
        "category_breakdown": category_breakdown,
        "brand_breakdown": brand_breakdown,
        "order_status": order_status,
        "ai_insights": insights,
        "recommendations": recommendations,
        "recommended_products": recommended_products,
    }