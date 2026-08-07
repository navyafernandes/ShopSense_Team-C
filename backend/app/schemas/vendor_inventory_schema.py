from pydantic import BaseModel


class VendorInventoryResponse(BaseModel):
    product_id: int
    product_name: str
    stock_quantity: int
    reorder_level: int
    warehouse_location: str | None

    class Config:
        from_attributes = True


class InventorySummary(BaseModel):
    total_products: int
    healthy: int
    low_stock: int
    critical: int


class VendorInventoryPageResponse(BaseModel):
    summary: InventorySummary
    products: list[VendorInventoryResponse]