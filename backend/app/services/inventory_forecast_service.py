from datetime import datetime, timedelta
import math

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.inventory import Inventory
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.payment import Payment
from app.models.product import Product
from app.models.user import User
from app.models.vendor import Vendor


def get_inventory_forecast(
    db: Session,
    current_user: User,
):
    # Get the logged-in vendor
    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == current_user.user_id)
        .first()
    )

    if not vendor:
        return []

    # Consider sales from the last 30 days
    last_30_days = datetime.utcnow() - timedelta(days=30)

    # Fetch all products belonging to the vendor
    products = (
        db.query(Product)
        .filter(Product.vendor_id == vendor.vendor_id)
        .all()
    )

    forecast_data = []

    for product in products:

        # Get inventory details
        inventory = (
            db.query(Inventory)
            .filter(
                Inventory.product_id == product.product_id
            )
            .first()
        )

        # Calculate total units sold in the last 30 days
        units_sold = (
            db.query(
                func.coalesce(
                    func.sum(OrderItem.quantity),
                    0
                )
            )
            .join(Order)
            .join(Payment)
            .filter(
                OrderItem.product_id == product.product_id,
                Payment.payment_date >= last_30_days,
                Payment.payment_status == "SUCCESS",
            )
            .scalar()
        )

        # Forecast demand
        forecast = max(int(units_sold), 1)

        # Add a 20% safety stock
        recommended = max(
            math.ceil(forecast * 1.2),
            5
        )

        # Current inventory
        current_stock = (
            inventory.stock_quantity
            if inventory
            else 0
        )

        # Minimum reorder level
        reorder_level = (
            inventory.reorder_level
            if inventory
            else 5
        )

        # Determine whether restocking is needed
        reorder = (
            current_stock <= reorder_level
            or current_stock < forecast
        )

        # Inventory status
        status = (
            "Restock Required"
            if reorder
            else "Sufficient Stock"
        )

        forecast_data.append(
            {
                "product_id": product.product_id,
                "product_name": product.product_name,
                "current_stock": current_stock,
                "forecasted_demand": forecast,
                "recommended_stock": recommended,
                "reorder": reorder,
                "status": status,
            }
        )

    return forecast_data