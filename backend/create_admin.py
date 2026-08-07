from app.database import SessionLocal
from app.models.user import User
from app.auth.hashing import hash_password

db = SessionLocal()

existing = db.query(User).filter(
    User.email == "admin@shopsense.com"
).first()

if existing:
    print("Admin already exists.")
else:
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

    print("Admin created successfully.")

db.close()