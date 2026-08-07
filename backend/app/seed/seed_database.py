from app.database import SessionLocal

from app.seed.seed_users import seed_users
from app.seed.seed_products import seed_products
from app.seed.seed_inventory import seed_inventory
from app.seed.seed_orders import seed_orders
from app.seed.seed_payments import seed_payments

db = SessionLocal()

try:
    seed_users(db)
    seed_products(db)
    seed_inventory(db)
    seed_orders(db)
    seed_payments(db)

finally:
    db.close()
    