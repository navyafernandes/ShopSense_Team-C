from decimal import Decimal
from app.models.customer import Customer
from app.models.user import User
from app.models.order import Order
from sqlalchemy.orm import Session

def get_customer_profile(db: Session, user):
    customer = (
        db.query(Customer)
        .filter(Customer.user_id == user.user_id)
        .first()
    )

    if customer is None:
        return "CUSTOMER_NOT_FOUND"

    user_data = customer.user

    orders = (
        db.query(Order)
        .filter(Order.customer_id == customer.customer_id)
        .all()
    )
    total_orders = len(orders)
    total_spent = sum((o.total_amount for o in orders), Decimal("0.00")) if orders else Decimal("0.00")

    return {
        "customer_id": customer.customer_id,
        "name": user_data.full_name,
        "email": user_data.email,
        "phone": user_data.phone,
        "address": customer.address,
        "city": customer.city,
        "state": customer.state,
        "country": customer.country,
        "postal_code": customer.postal_code,
        "created_at": user_data.created_at,
        "total_orders": total_orders,
        "total_spent": total_spent,
    }

def update_customer_profile(db: Session, user, profile):
    customer = (
        db.query(Customer)
        .filter(Customer.user_id == user.user_id)
        .first()
    )

    if customer is None:
        return "CUSTOMER_NOT_FOUND"

    user_data = customer.user

    user_data.full_name = profile.name
    if profile.phone is not None:
        user_data.phone = profile.phone

    if profile.address is not None:
        customer.address = profile.address
    if profile.city is not None:
        customer.city = profile.city
    if profile.state is not None:
        customer.state = profile.state
    if profile.country is not None:
        customer.country = profile.country
    if profile.postal_code is not None:
        customer.postal_code = profile.postal_code
   
    db.commit()

    return {"message": "Profile updated successfully"}