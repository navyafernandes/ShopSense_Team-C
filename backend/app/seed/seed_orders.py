import random
from decimal import Decimal
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product

from app.seed.config import (
    NUM_ORDERS,
    MAX_ITEMS_PER_ORDER,
    START_YEAR,
    END_YEAR,
)

from app.seed.constants import ORDER_STATUS


def random_order_date():
    start = datetime(START_YEAR, 1, 1)
    end = datetime(END_YEAR, 12, 31, 23, 59, 59)

    total_seconds = int((end - start).total_seconds())

    return start + timedelta(
        seconds=random.randint(0, total_seconds)
    )


def generate_order_status():
    return random.choices(
        population=ORDER_STATUS,
        weights=[
            60,   # DELIVERED
            15,   # SHIPPED
            10,   # CONFIRMED
            10,   # PENDING
            5     # CANCELLED
        ],
        k=1
    )[0]


def build_shipping_address(customer):
    address_parts = []

    if customer.address:
        address_parts.append(customer.address)

    if customer.city:
        address_parts.append(customer.city)

    if customer.state:
        address_parts.append(customer.state)

    if customer.country:
        address_parts.append(customer.country)

    shipping_address = ", ".join(address_parts)

    if customer.postal_code:
        shipping_address += f" - {customer.postal_code}"

    return shipping_address


def generate_tracking_number():
    return f"TRK{random.randint(100000000, 999999999)}"


def seed_orders(db: Session):

    existing_orders = db.query(Order).count()

    if existing_orders > 0:
        print(f"Orders already exist ({existing_orders}). Skipping...")
        return

    customers = db.query(Customer).all()
    products = db.query(Product).all()

    if not customers:
        raise Exception("No customers found.")

    if not products:
        raise Exception("No products found.")

    print("Creating Orders...")

    orders_created = 0

    try:

        for _ in range(NUM_ORDERS):

            customer = random.choice(customers)

            order_date = random_order_date()

            status = generate_order_status()

            tracking_number = (
                generate_tracking_number()
                if status in ["SHIPPED", "DELIVERED"]
                else None
            )

            order = Order(
                customer_id=customer.customer_id,
                order_date=order_date,
                total_amount=Decimal("0.00"),
                order_status=status,
                shipping_address=build_shipping_address(customer),
                tracking_number=tracking_number,
            )

            db.add(order)

            db.flush()

            number_of_items = random.randint(
                1,
                min(MAX_ITEMS_PER_ORDER, len(products))
            )

            selected_products = random.sample(
                products,
                number_of_items,
            )

            total = Decimal("0.00")

            for product in selected_products:

                quantity = random.randint(1, 5)

                item_price = (
                    product.discount_price
                    if product.discount_price is not None
                    else product.price
                )

                order_item = OrderItem(
                    order_id=order.order_id,
                    product_id=product.product_id,
                    vendor_id=product.vendor_id,
                    quantity=quantity,
                    price=item_price,
                )

                db.add(order_item)

                total += Decimal(item_price) * quantity

            order.total_amount = total.quantize(
                Decimal("0.01")
            )

            orders_created += 1

            if orders_created % 100 == 0:
                db.commit()
                print(f"✓ Seeded {orders_created} orders...")

        db.commit()

        print(f"\n✓ Successfully seeded {orders_created} orders.")

    except Exception as e:

        db.rollback()

        print(f"Error seeding orders: {e}")

        raise