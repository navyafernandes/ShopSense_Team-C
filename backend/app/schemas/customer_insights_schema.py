from pydantic import BaseModel


class TopCustomer(BaseModel):
    customer_id: int
    customer_name: str
    total_spent: float


class TopProduct(BaseModel):
    product_id: int
    product_name: str
    units_sold: int


class TopCategory(BaseModel):
    category_id: int
    category_name: str
    units_sold: int


class CustomerInsightsResponse(BaseModel):
    total_customers: int
    repeat_customers: int
    new_customers: int
    average_order_value: float

    top_customer: TopCustomer | None = None
    top_product: TopProduct | None = None
    top_category: TopCategory | None = None

    class Config:
        from_attributes = True