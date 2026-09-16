from pydantic import BaseModel, Field
from typing import Optional


class InventoryCreate(BaseModel):
    product_id: int
    stock_quantity: int = Field(..., ge=0)
    reorder_level: int = Field(default=10, ge=0)
    warehouse_location: Optional[str] = None


class InventoryUpdate(BaseModel):
    stock_quantity: int = Field(..., ge=0)
    reorder_level: int = Field(..., ge=0)
    warehouse_location: Optional[str] = None


class InventoryResponse(BaseModel):
    inventory_id: int
    product_id: int
    stock_quantity: int
    reorder_level: int
    warehouse_location: Optional[str]

    class Config:
        from_attributes = True

class LowStockResponse(BaseModel):
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


class InventoryOverviewResponse(BaseModel):
    summary: InventorySummary
    products: list[InventoryResponse]