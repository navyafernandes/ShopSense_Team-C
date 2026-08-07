import random
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product
from app.models.vendor import Vendor

from app.seed.config import NUM_PRODUCTS
from app.seed.constants import (
    CATEGORIES,
    PRODUCT_CATALOG,
)
from app.seed.product_images import (
    PRODUCT_IMAGES,
    DEFAULT_PRODUCT_IMAGE,
)
from app.seed.faker_utils import sku, rating


def seed_categories(db: Session):
    """
    Creates categories if they don't already exist.
    Returns:
        dict -> {category_name: Category}
    """

    category_map = {}

    for category_name in CATEGORIES:

        existing = (
            db.query(Category)
            .filter(Category.category_name == category_name)
            .first()
        )

        if existing:
            category_map[category_name] = existing
            continue

        category = Category(
            category_name=category_name,
            description=f"{category_name} products",
        )

        db.add(category)
        db.flush()

        category_map[category_name] = category

    db.commit()

    print(f"✓ Categories ready ({len(category_map)})")

    return category_map


def get_all_vendors(db: Session):

    vendors = db.query(Vendor).all()

    if not vendors:
        raise Exception("No vendors found. Seed users first.")

    return vendors


def generate_price():

    price = random.randint(200, 50000)

    discount = random.choice([0, 5, 10, 15, 20, 25, 30])

    discount_price = round(
        price * (100 - discount) / 100,
        2,
    )

    return (
        Decimal(str(price)),
        Decimal(str(discount_price)),
    )


def seed_products(db: Session):

    existing_products = db.query(Product).count()

    if existing_products > 0:
       print(f"Products already exist ({existing_products}). Skipping...")
       return
   
    print("Creating Products...")

    categories = seed_categories(db)
    vendors = get_all_vendors(db)

    count = 0
    attempts = 0
    max_attempts = NUM_PRODUCTS * 10

    try:

        while count < NUM_PRODUCTS and attempts < max_attempts:

            attempts += 1

            category_name = random.choice(CATEGORIES)
            category = categories[category_name]
            vendor = random.choice(vendors)

            # Pick a random product from the catalog
            product_data = random.choice(
                PRODUCT_CATALOG[category_name]
            )

            product_name = product_data["name"]
            brand = product_data["brand"]

            # Prevent duplicate products for the same vendor
            existing = (
                db.query(Product)
                .filter(
                    Product.vendor_id == vendor.vendor_id,
                    Product.product_name == product_name,
                )
                .first()
            )

            if existing:
                continue

            price, discount_price = generate_price()

            image = PRODUCT_IMAGES.get(
               product_name,
               DEFAULT_PRODUCT_IMAGE,
            )

            description = (
                f"Premium quality {product_name} "
                f"from {brand}."
            )

            while True:

                product_sku = sku()

                sku_exists = (
                    db.query(Product)
                    .filter(Product.sku == product_sku)
                    .first()
                )

                if not sku_exists:
                    break

            product = Product(
                vendor_id=vendor.vendor_id,
                category_id=category.category_id,
                product_name=product_name,
                description=description,
                brand=brand,
                sku=product_sku,
                thumbnail_url=image,
                price=price,
                discount_price=discount_price,
                rating=Decimal(str(rating())),
                product_status="ACTIVE",
            )

            db.add(product)

            count += 1

            if count % 50 == 0:
                db.commit()
                print(f"✓ Seeded {count} products...")

        db.commit()

        print(f"\n✓ Successfully seeded {count} products.")

        if count < NUM_PRODUCTS:
            print(
                f"⚠ Only {count} products could be generated. "
                f"Consider expanding PRODUCT_CATALOG."
            )

    except Exception as e:
        db.rollback()
        print(f"❌ Error while seeding products: {e}")
        raise