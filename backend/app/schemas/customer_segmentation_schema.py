from pydantic import BaseModel


class CustomerSegment(BaseModel):
    customer_id: int
    customer_name: str
    total_spent: float
    order_count: int
    average_order_value: float
    recency_days: int
    segment: str


class CustomerSegmentationResponse(BaseModel):
    total_customers: int

    premium_customers: int
    regular_customers: int
    new_customers: int
    inactive_customers: int

    silhouette_score: float

    customers: list[CustomerSegment]

    class Config:
        from_attributes = True