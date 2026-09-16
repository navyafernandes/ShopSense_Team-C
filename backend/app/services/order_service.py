from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.order import Order
from app.models.order_item import OrderItem


def create_order(
    db: Session,
    order_data,
    user
):
    customer = (
        db.query(Customer)
        .filter(Customer.user_id == user.user_id)
        .first()
    )

    if customer is None:
        return "CUSTOMER_NOT_FOUND"

    cart = (
        db.query(Cart)
        .filter(Cart.customer_id == customer.customer_id)
        .first()
    )

    if cart is None:
        return "CART_NOT_FOUND"

    cart_items = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.cart_id)
        .all()
    )

    if not cart_items:
        return "EMPTY_CART"

    total_amount = Decimal("0")

    order_items_data = []

    for item in cart_items:

        product = (
            db.query(Product)
            .filter(Product.product_id == item.product_id)
            .first()
        )

        inventory = (
            db.query(Inventory)
            .filter(
                Inventory.product_id == item.product_id
            )
            .first()
        )

        if product is None:
            return "PRODUCT_NOT_FOUND"

        if inventory is None:
            return "INVENTORY_NOT_FOUND"

        if inventory.stock_quantity < item.quantity:
            return "INSUFFICIENT_STOCK"

        subtotal = product.price * item.quantity

        total_amount += subtotal

        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "price": product.price
        })

    order = Order(
        customer_id=customer.customer_id,
        total_amount=total_amount,
        order_status="PENDING",
        shipping_address=order_data.shipping_address,
        tracking_number=None
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in order_items_data:

        order_item = OrderItem(
            order_id=order.order_id,
            product_id=item["product"].product_id,
            vendor_id=item["product"].vendor_id,
            quantity=item["quantity"],
            price=item["price"]
        )

        db.add(order_item)

    db.commit()

    for item in order_items_data:

        inventory = (
            db.query(Inventory)
            .filter(
                Inventory.product_id ==
                item["product"].product_id
            )
            .first()
        )

        inventory.stock_quantity -= item["quantity"]

    db.query(CartItem).filter(
        CartItem.cart_id == cart.cart_id
    ).delete()

    db.commit()

    return {
        "order": order,
        "items": (
            db.query(OrderItem)
            .filter(
                OrderItem.order_id == order.order_id
            )
            .all()
        )
    }

from app.models.customer import Customer
from app.models.order import Order


def get_customer_orders(
    db: Session,
    user
):
    customer = (
        db.query(Customer)
        .filter(Customer.user_id == user.user_id)
        .first()
    )

    if customer is None:
        return "CUSTOMER_NOT_FOUND"

    orders = (
        db.query(Order)
        .filter(Order.customer_id == customer.customer_id)
        .order_by(Order.order_date.desc())
        .all()
    )

    results = []
    for order in orders:
        items_data = []
        for item in order.order_items:
            items_data.append({
                "product_id": item.product_id,
                "product_name": item.product.product_name if item.product else f"Product #{item.product_id}",
                "brand": item.product.brand if item.product else None,
                "thumbnail_url": item.product.thumbnail_url if item.product else None,
                "vendor_name": item.vendor.business_name if item.vendor else None,
                "quantity": item.quantity,
                "price": item.price,
            })

        results.append({
            "order_id": order.order_id,
            "order_date": order.order_date,
            "total_amount": order.total_amount,
            "order_status": order.order_status,
            "shipping_address": order.shipping_address,
            "tracking_number": order.tracking_number,
            "payment_status": order.payment.payment_status if order.payment else "PENDING",
            "payment_method": order.payment.payment_method if order.payment else None,
            "items": items_data,
        })

    return results