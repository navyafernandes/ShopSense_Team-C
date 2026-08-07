import random
import csv
from datetime import date

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.customer import Customer
from app.models.vendor import Vendor

from app.seed.config import (
    NUM_CUSTOMERS,
    NUM_VENDORS
)

from app.seed.constants import (
    VENDOR_NAMES
)

from app.seed.faker_utils import (
    full_name,
    email,
    phone,
    address,
    city,
    state,
    postal_code,
    country,
    gst_number,
)

from app.auth.hashing import hash_password


CUSTOMER_PASSWORD = "Password@123"
VENDOR_PASSWORD = "Vendor@123"


def seed_users(db: Session):

    # -----------------------------
    # Skip if data already exists
    # -----------------------------
    existing_users = db.query(User).count()
    existing_customers = db.query(Customer).count()
    existing_vendors = db.query(Vendor).count()

    if (
        existing_users > 0
        or existing_customers > 0
        or existing_vendors > 0
    ):
        print(
            f"Users already exist "
            f"(Users={existing_users}, "
            f"Customers={existing_customers}, "
            f"Vendors={existing_vendors}). Skipping..."
        )
        return

    credentials = []

    try:

        print("Creating Customers...")

        # ------------------------------------
        # CUSTOMERS
        # ------------------------------------

        for _ in range(NUM_CUSTOMERS):

            name = full_name()

            user = User(
                full_name=name,
                email=email(name),
                password_hash=hash_password(CUSTOMER_PASSWORD),
                phone=phone(),
                role="CUSTOMER",
                status="ACTIVE"
            )

            db.add(user)
            db.flush()

            customer = Customer(
                user_id=user.user_id,
                address=address(),
                city=city(),
                state=state(),
                country=country(),
                postal_code=postal_code()
            )

            db.add(customer)

            credentials.append({
                "Role": "CUSTOMER",
                "Email": user.email,
                "Password": CUSTOMER_PASSWORD
            })

        print("Creating Vendors...")

        # ------------------------------------
        # VENDORS
        # ------------------------------------

        business_types = [
            "Retail",
            "Wholesale",
            "Manufacturer",
            "Distributor"
        ]

        for business_name in VENDOR_NAMES[:NUM_VENDORS]:

            owner = full_name()

            user = User(
                full_name=owner,
                email=email(owner),
                password_hash=hash_password(VENDOR_PASSWORD),
                phone=phone(),
                role="VENDOR",
                status="ACTIVE"
            )

            db.add(user)
            db.flush()

            vendor = Vendor(
                user_id=user.user_id,
                business_name=business_name,
                business_type=random.choice(business_types),
                gst_number=gst_number(),
                commission_rate=10.00,
                verification_status="APPROVED",
                joined_date=date.today()
            )

            db.add(vendor)

            credentials.append({
                "Role": "VENDOR",
                "Email": user.email,
                "Password": VENDOR_PASSWORD
            })

        db.commit()

        # ------------------------------------
        # Save credentials
        # ------------------------------------

        with open("seed_credentials.csv", "w", newline="") as file:

            writer = csv.DictWriter(
                file,
                fieldnames=["Role", "Email", "Password"]
            )

            writer.writeheader()
            writer.writerows(credentials)

        print("Users seeded successfully.")
        print("Credentials saved to seed_credentials.csv")

    except Exception as e:

        db.rollback()

        print(f"Error seeding users: {e}")

        raise