from sqlalchemy.orm import Session

from app.models.user import User
from app.models.customer import Customer
from app.models.vendor import Vendor

from app.auth.hashing import hash_password
from app.auth.hashing import verify_password
from app.auth.jwt_handler import create_access_token

from app.enums.user_role import UserRole


def register_user(db: Session, user_data):

    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        return None

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        phone=user_data.phone,
        role=user_data.role,
        status="ACTIVE",
    )

    db.add(new_user)
    db.flush()

    if user_data.role == UserRole.CUSTOMER:

        customer = Customer(
            user_id=new_user.user_id
        )

        db.add(customer)

    elif user_data.role == UserRole.VENDOR:

        vendor = Vendor(
            user_id=new_user.user_id,
            business_name=user_data.business_name,
            business_type=user_data.business_type,
            gst_number=user_data.gst_number,
        )

        db.add(vendor)

    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role,
            "user_id": user.user_id,
        }
    )

    display_name = user.full_name

    if user.role == UserRole.VENDOR:

        vendor = (
            db.query(Vendor)
            .filter(
                Vendor.user_id == user.user_id
            )
            .first()
        )

        if vendor:
            display_name = vendor.business_name

    return {
        "access_token": token,
        "role": user.role,
        "name": display_name,
    }