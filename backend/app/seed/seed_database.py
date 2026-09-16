from app.database import engine, Base, SessionLocal
import app.models  # Ensure all SQLAlchemy models are registered
from app.models.user import User
from app.auth.hashing import hash_password

from app.seed.seed_users import seed_users
from app.seed.seed_products import seed_products
from app.seed.seed_inventory import seed_inventory
from app.seed.seed_orders import seed_orders
from app.seed.seed_payments import seed_payments


def seed_admin(db):
    existing = db.query(User).filter(User.email == "admin@shopsense.com").first()
    if not existing:
        admin = User(
            full_name="ShopSense Administrator",
            email="admin@shopsense.com",
            password_hash=hash_password("admin@123"),
            phone="9999999999",
            role="ADMIN",
            status="ACTIVE",
        )
        db.add(admin)
        db.commit()
        print("Admin account created (admin@shopsense.com / admin@123).")
    else:
        print("Admin account already exists.")


def run_seed():
    # Automatically create missing tables if deploying to a clean database
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed_admin(db)
        seed_users(db)
        seed_products(db)
        seed_inventory(db)
        seed_orders(db)
        seed_payments(db)
        print("Database seeding completed successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
    