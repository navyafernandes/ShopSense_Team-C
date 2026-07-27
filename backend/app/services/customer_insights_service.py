from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.vendor import Vendor
from app.models.customer import Customer
from app.models.user import User
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment
from app.models.product import Product
from app.models.category import Category


def get_customer_insights(db: Session, current_user: User):

    # -------------------------------------------------
    # Logged-in Vendor
    # -------------------------------------------------

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == current_user.user_id)
        .first()
    )

    if not vendor:
        return None

    last_30_days = datetime.utcnow() - timedelta(days=30)

    # -------------------------------------------------
    # Total Customers
    # -------------------------------------------------

    total_customers = (
        db.query(func.count(func.distinct(Order.customer_id)))
        .join(OrderItem, Order.order_id == OrderItem.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .filter(
            OrderItem.vendor_id == vendor.vendor_id,
            Payment.payment_status == "SUCCESS"
        )
        .scalar()
    ) or 0

    # -------------------------------------------------
    # Repeat Customers
    # -------------------------------------------------

    repeat_customers = (
        db.query(Order.customer_id)
        .join(OrderItem, Order.order_id == OrderItem.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .filter(
            OrderItem.vendor_id == vendor.vendor_id,
            Payment.payment_status == "SUCCESS"
        )
        .group_by(Order.customer_id)
        .having(func.count(func.distinct(Order.order_id)) > 1)
        .count()
    )

    # -------------------------------------------------
    # New Customers (Basic Version)
    # -------------------------------------------------

    new_customers = (
        db.query(func.count(func.distinct(Order.customer_id)))
        .join(OrderItem, Order.order_id == OrderItem.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .filter(
            OrderItem.vendor_id == vendor.vendor_id,
            Payment.payment_status == "SUCCESS",
            Payment.payment_date >= last_30_days
        )
        .scalar()
    ) or 0

    # -------------------------------------------------
    # Vendor Revenue
    # -------------------------------------------------

    vendor_revenue = (
        db.query(
            func.sum(OrderItem.price * OrderItem.quantity)
        )
        .join(Order, Order.order_id == OrderItem.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .filter(
            OrderItem.vendor_id == vendor.vendor_id,
            Payment.payment_status == "SUCCESS"
        )
        .scalar()
    ) or 0

    # -------------------------------------------------
    # Vendor Orders
    # -------------------------------------------------

    vendor_orders = (
        db.query(func.count(func.distinct(Order.order_id)))
        .join(OrderItem, Order.order_id == OrderItem.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .filter(
            OrderItem.vendor_id == vendor.vendor_id,
            Payment.payment_status == "SUCCESS"
        )
        .scalar()
    ) or 0

    # -------------------------------------------------
    # Average Order Value
    # -------------------------------------------------

    average_order_value = (
        round(float(vendor_revenue) / vendor_orders, 2)
        if vendor_orders > 0
        else 0
    )

    # -------------------------------------------------
    # Top Customer
    # -------------------------------------------------

    top_customer = (
        db.query(
            Customer.customer_id,
            User.full_name,
            func.sum(
                OrderItem.price * OrderItem.quantity
            ).label("total_spent")
        )
        .join(Order, Customer.customer_id == Order.customer_id)
        .join(OrderItem, Order.order_id == OrderItem.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .join(User, Customer.user_id == User.user_id)
        .filter(
            OrderItem.vendor_id == vendor.vendor_id,
            Payment.payment_status == "SUCCESS"
        )
        .group_by(
            Customer.customer_id,
            User.full_name
        )
        .order_by(
            func.sum(
                OrderItem.price * OrderItem.quantity
            ).desc()
        )
        .first()
    )

    customer_data = None

    if top_customer:
        customer_data = {
            "customer_id": top_customer.customer_id,
            "customer_name": top_customer.full_name,
            "total_spent": float(top_customer.total_spent)
        }

    # -------------------------------------------------
    # Top Product
    # -------------------------------------------------

    top_product = (
        db.query(
            Product.product_id,
            Product.product_name,
            func.sum(OrderItem.quantity).label("units_sold")
        )
        .join(OrderItem, Product.product_id == OrderItem.product_id)
        .join(Order, OrderItem.order_id == Order.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .filter(
            Product.vendor_id == vendor.vendor_id,
            Payment.payment_status == "SUCCESS"
        )
        .group_by(
            Product.product_id,
            Product.product_name
        )
        .order_by(
            func.sum(OrderItem.quantity).desc()
        )
        .first()
    )

    product_data = None

    if top_product:
        product_data = {
            "product_id": top_product.product_id,
            "product_name": top_product.product_name,
            "units_sold": int(top_product.units_sold)
        }

    # -------------------------------------------------
    # Top Category
    # -------------------------------------------------

    top_category = (
        db.query(
            Category.category_id,
            Category.category_name,
            func.sum(OrderItem.quantity).label("units_sold")
        )
        .join(Product, Product.category_id == Category.category_id)
        .join(OrderItem, Product.product_id == OrderItem.product_id)
        .join(Order, OrderItem.order_id == Order.order_id)
        .join(Payment, Order.order_id == Payment.order_id)
        .filter(
            Product.vendor_id == vendor.vendor_id,
            Payment.payment_status == "SUCCESS"
        )
        .group_by(
            Category.category_id,
            Category.category_name
        )
        .order_by(
            func.sum(OrderItem.quantity).desc()
        )
        .first()
    )

    category_data = None

    if top_category:
        category_data = {
            "category_id": top_category.category_id,
            "category_name": top_category.category_name,
            "units_sold": int(top_category.units_sold)
        }

    # -------------------------------------------------
    # Response
    # -------------------------------------------------

    return {
        "total_customers": total_customers,
        "repeat_customers": repeat_customers,
        "new_customers": new_customers,
        "average_order_value": average_order_value,
        "top_customer": customer_data,
        "top_product": product_data,
        "top_category": category_data
    }