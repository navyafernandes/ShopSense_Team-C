from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.product import Product
from app.models.vendor import Vendor


def create_inventory(
    db: Session,
    inventory_data,
    user
):

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == user.user_id)
        .first()
    )

    if vendor is None:
        return None

    product = (
        db.query(Product)
        .filter(Product.product_id == inventory_data.product_id)
        .first()
    )

    if product is None:
        return "PRODUCT_NOT_FOUND"

    if product.vendor_id != vendor.vendor_id:
        return "FORBIDDEN"

    existing_inventory = (
        db.query(Inventory)
        .filter(
            Inventory.product_id == inventory_data.product_id
        )
        .first()
    )

    if existing_inventory:
        return "ALREADY_EXISTS"

    inventory = Inventory(
        product_id=inventory_data.product_id,
        stock_quantity=inventory_data.stock_quantity,
        reorder_level=inventory_data.reorder_level,
        warehouse_location=inventory_data.warehouse_location
    )

    db.add(inventory)
    db.commit()
    db.refresh(inventory)

    return inventory


def get_low_stock_products(db: Session):

    return (
        db.query(Inventory, Product)
        .join(Product, Inventory.product_id == Product.product_id)
        .filter(
            Inventory.stock_quantity <= Inventory.reorder_level
        )
        .all()
    )


def update_inventory(
    db: Session,
    product_id: int,
    inventory_data,
    user
):

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == user.user_id)
        .first()
    )

    if vendor is None:
        return None

    product = (
        db.query(Product)
        .filter(Product.product_id == product_id)
        .first()
    )

    if product is None:
        return "PRODUCT_NOT_FOUND"

    if product.vendor_id != vendor.vendor_id:
        return "FORBIDDEN"

    inventory = (
        db.query(Inventory)
        .filter(Inventory.product_id == product_id)
        .first()
    )

    if inventory is None:
        return "INVENTORY_NOT_FOUND"

    inventory.stock_quantity = inventory_data.stock_quantity
    inventory.reorder_level = inventory_data.reorder_level
    inventory.warehouse_location = inventory_data.warehouse_location

    db.commit()
    db.refresh(inventory)

    return inventory


def get_all_inventory(db: Session):

    inventory = db.query(Inventory).all()

    total_products = len(inventory)

    healthy = 0
    low_stock = 0
    critical = 0

    for item in inventory:

        if item.stock_quantity <= 0:
            critical += 1

        elif item.stock_quantity <= item.reorder_level:
            low_stock += 1

        else:
            healthy += 1

    return {
        "summary": {
            "total_products": total_products,
            "healthy": healthy,
            "low_stock": low_stock,
            "critical": critical,
        },
        
        "products": inventory,
    }


def get_inventory_by_product(
    db: Session,
    product_id: int
):

    return (
        db.query(Inventory)
        .filter(
            Inventory.product_id == product_id
        )
        .first()
    )