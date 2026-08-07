from sqlalchemy.orm import Session

from app.models.vendor import Vendor
from app.models.product import Product
from app.models.inventory import Inventory


def get_vendor_inventory(db: Session, user):

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == user.user_id)
        .first()
    )

    if vendor is None:
        return None

    results = (
        db.query(Inventory, Product)
        .join(
            Product,
            Inventory.product_id == Product.product_id
        )
        .filter(
            Product.vendor_id == vendor.vendor_id
        )
        .all()
    )

    products = []

    healthy = 0
    low_stock = 0
    critical = 0

    for inventory, product in results:

        if inventory.stock_quantity <= 0:
            critical += 1

        elif inventory.stock_quantity <= inventory.reorder_level:
            low_stock += 1

        else:
            healthy += 1

        products.append(
            {
                "product_id": product.product_id,
                "product_name": product.product_name,
                "stock_quantity": inventory.stock_quantity,
                "reorder_level": inventory.reorder_level,
                "warehouse_location": inventory.warehouse_location,
            }
        )

    return {
        "summary": {
            "total_products": len(products),
            "healthy": healthy,
            "low_stock": low_stock,
            "critical": critical,
        },
        "products": products,
    }