import random
from datetime import timedelta

from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.payment import Payment

from app.seed.constants import (
    PAYMENT_METHODS,
)


def generate_payment_status(order_status):
    mapping = {
        "DELIVERED": "SUCCESS",
        "SHIPPED": "SUCCESS",
        "CONFIRMED": "SUCCESS",
        "PENDING": "PENDING",
        "CANCELLED": "FAILED",
    }

    return mapping.get(order_status, "SUCCESS")

def random_payment_method():
    """
    Return a random payment method.
    """

    return random.choice(PAYMENT_METHODS)


def seed_payments(db: Session):
    """
    Seed one payment for every order.
    """

    existing_payments = db.query(Payment).count()

    if existing_payments > 0:
        print(f"Payments already exist ({existing_payments}). Skipping...")
        return

    orders = db.query(Order).all()

    if not orders:
        raise Exception("No orders found.")

    print("Creating Payments...")

    payments_created = 0

    try:

        for order in orders:

            payment = Payment(

                order_id=order.order_id,

                payment_method=random_payment_method(),

                payment_status=generate_payment_status(
                    order.order_status
                ),

                payment_date=order.order_date + timedelta(
                    minutes=random.randint(1, 30)
                ),
            )

            db.add(payment)

            payments_created += 1

            if payments_created % 100 == 0:
                db.commit()
                print(
                    f"✓ Seeded {payments_created} payments..."
                )

        db.commit()

        print(
            f"\n✓ Successfully seeded {payments_created} payments."
        )

    except Exception as e:

        db.rollback()

        print(f"Error seeding payments: {e}")

        raise