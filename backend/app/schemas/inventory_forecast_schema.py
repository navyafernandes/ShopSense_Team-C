from pydantic import BaseModel


class InventoryForecastResponse(BaseModel):
    product_id: int
    product_name: str
    current_stock: int
    forecasted_demand: int
    recommended_stock: int
    reorder: bool
    status: str

    class Config:
        from_attributes = True