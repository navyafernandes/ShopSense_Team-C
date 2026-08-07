from decimal import Decimal
from pydantic import BaseModel
from datetime import date


class DashboardSummary(BaseModel):
    total_revenue: Decimal
    total_orders: int
    total_vendors: int
    total_customers: int
    total_products: int


class SalesSummary(BaseModel):
    total_revenue: Decimal
    total_orders: int
    products_sold: int
    average_order_value: Decimal


class VendorAnalytics(BaseModel):
    vendor_name: str
    revenue: Decimal
    orders: int
    products_sold: int


class ProductAnalytics(BaseModel):
    product_name: str
    units_sold: int
    revenue: Decimal


class InventoryAnalytics(BaseModel):
    total_products: int
    low_stock_products: int
    out_of_stock_products: int


class RevenueTrend(BaseModel):
    date: str
    revenue: float