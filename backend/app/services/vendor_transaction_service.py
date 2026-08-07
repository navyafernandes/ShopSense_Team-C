from sqlalchemy.orm import Session

from app.models.vendor import Vendor
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment
from app.models.customer import Customer
from app.models.user import User


def get_vendor_transactions(db: Session, user):

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == user.user_id)
        .first()
    )

    if vendor is None:
        return None

    results = (
        db.query(
            Payment,
            Order,
            OrderItem,
            Product,
            Customer,
            User
        )
        .join(
            Order,
            Payment.order_id == Order.order_id
        )
        .join(
            OrderItem,
            Order.order_id == OrderItem.order_id
        )
        .join(
            Product,
            OrderItem.product_id == Product.product_id
        )
        .join(
            Customer,
            Order.customer_id == Customer.customer_id
        )
        .join(
            User,
            Customer.user_id == User.user_id
        )
        .filter(
            Product.vendor_id == vendor.vendor_id
        )
        .order_by(
            Payment.payment_date.desc()
        )
        .all()
    )

    return [
        {   
            "order_item_id": order_item.order_item_id,
            "payment_id": payment.payment_id,
            "order_id": order.order_id,
            "customer_name": customer_user.full_name,
            "product_name": product.product_name,
            "amount": order_item.price * order_item.quantity,
            "payment_method": payment.payment_method,
            "payment_status": payment.payment_status,
            "payment_date": payment.payment_date,
        }
        for payment, order, order_item, product, customer, customer_user in results
    ]