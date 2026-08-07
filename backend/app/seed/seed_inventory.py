import random

from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.product import Product
from app.seed.constants import WAREHOUSE_LOCATIONS


def seed_inventory(db: Session):

    existing_inventory = db.query(Inventory).count()

    if existing_inventory > 0:
       print(f"Inventory already exists ({existing_inventory}). Skipping...")
       return

    print("Creating Inventory...")

    products = db.query(Product).all()

    if not products:
        raise Exception("No products found. Seed products first.")

    count = 0

    try:

        for product in products:

            # Skip if inventory already exists
            existing = (
                db.query(Inventory)
                .filter(
                    Inventory.product_id == product.product_id
                )
                .first()
            )

            if existing:
                continue

            # Realistic stock distribution
            stock_quantity = random.choices(
                population=[
                    0,
                    random.randint(1, 20),
                    random.randint(21, 100),
                    random.randint(101, 500),
                ],
                weights=[5, 15, 35, 45],
                k=1,
            )[0]

            reorder_level = random.randint(10, 50)

            inventory = Inventory(
                product_id=product.product_id,
                stock_quantity=stock_quantity,
                reorder_level=reorder_level,
                warehouse_location=random.choice(
                    WAREHOUSE_LOCATIONS
                ),
            )

            db.add(inventory)

            # Keep product status synchronized
            if stock_quantity == 0:
                product.product_status = "OUT_OF_STOCK"
            else:
                product.product_status = "ACTIVE"

            count += 1

            if count % 50 == 0:
                db.commit()
                print(f"✓ Seeded inventory for {count} products...")

        db.commit()

        print(f"\n✓ Successfully seeded inventory for {count} products.")

    except Exception as e:
        db.rollback()
        print(f"❌ Error while seeding inventory: {e}")
        raise