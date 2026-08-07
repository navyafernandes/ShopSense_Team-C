from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.vendor import Vendor
from app.models.customer import Customer
from app.models.product import Product
from app.models.order_item import OrderItem
from app.models.inventory import Inventory



def get_dashboard_summary(db: Session):

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(Order.total_amount),
                0
            )
        )
        .scalar()
    )

    total_orders = (
        db.query(Order)
        .count()
    )

    total_vendors = (
        db.query(Vendor)
        .count()
    )

    total_customers = (
        db.query(Customer)
        .count()
    )

    total_products = (
        db.query(Product)
        .count()
    )

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_vendors": total_vendors,
        "total_customers": total_customers,
        "total_products": total_products
    }

def get_sales_summary(db: Session):

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(Order.total_amount),
                0
            )
        )
        .scalar()
    )

    total_orders = (
        db.query(Order)
        .count()
    )

    products_sold = (
        db.query(
            func.coalesce(
                func.sum(OrderItem.quantity),
                0
            )
        )
        .scalar()
    )

    average_order_value = (
        db.query(
            func.coalesce(
                func.avg(Order.total_amount),
                0
            )
        )
        .scalar()
    )

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "products_sold": products_sold,
        "average_order_value": average_order_value
    }

def get_product_analytics(db: Session):

    results = (
        db.query(
            Product.product_name,
            func.sum(OrderItem.quantity).label("units_sold"),
            func.sum(
                OrderItem.quantity * OrderItem.price
            ).label("revenue")
        )
        .join(
            OrderItem,
            Product.product_id == OrderItem.product_id
        )
        .group_by(
            Product.product_name
        )
        .order_by(
            func.sum(OrderItem.quantity).desc()
        )
        .all()
    )

    return [
        {
            "product_name": row.product_name,
            "units_sold": row.units_sold,
            "revenue": row.revenue
        }
        for row in results
    ]

def get_vendor_analytics(db: Session):

    results = (
    db.query(
        Vendor.business_name,
        func.sum(
            OrderItem.quantity * OrderItem.price
        ).label("revenue"),
        func.count(
            func.distinct(OrderItem.order_id)
        ).label("orders"),
        func.sum(
            OrderItem.quantity
        ).label("products_sold")
    )
    .join(
        Product,
        Vendor.vendor_id == Product.vendor_id
    )
    .join(
        OrderItem,
        Product.product_id == OrderItem.product_id
    )
    .group_by(
        Vendor.business_name
    )
    .order_by(
        func.sum(
            OrderItem.quantity * OrderItem.price
        ).desc()
    )
    .all()
    )

    return [
        {
            "vendor_name": row.business_name,
            "revenue": row.revenue,
            "orders": row.orders,
            "products_sold": row.products_sold
        }
        for row in results
    ]

def get_inventory_analytics(db: Session):

    total_products = (
        db.query(Inventory)
        .count()
    )

    low_stock_products = (
        db.query(Inventory)
        .filter(
            Inventory.stock_quantity <= 10,
            Inventory.stock_quantity > 0
        )
        .count()
    )

    out_of_stock_products = (
        db.query(Inventory)
        .filter(
            Inventory.stock_quantity == 0
        )
        .count()
    )

    return {
        "total_products": total_products,
        "low_stock_products": low_stock_products,
        "out_of_stock_products": out_of_stock_products
    }

def get_revenue_trend(db: Session):

    results = (
        db.query(
            func.extract("year", Order.order_date).label("year"),
            func.extract("month", Order.order_date).label("month"),
            func.sum(Order.total_amount).label("revenue")
        )
        .group_by(
            func.extract("year", Order.order_date),
            func.extract("month", Order.order_date)
        )
        .order_by(
            func.extract("year", Order.order_date),
            func.extract("month", Order.order_date)
        )
        .all()
    )

    month_names = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]

    return [
        {
            "date": f"{month_names[int(row.month)]} {int(row.year)}",
            "revenue": float(row.revenue)
        }
        for row in results
    ]