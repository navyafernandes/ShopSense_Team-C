from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import List, Optional


from pydantic import BaseModel


class OrderCreate(BaseModel):
    shipping_address: str


class OrderItemResponse(BaseModel):
    product_id: int
    vendor_id: int
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    order_id: int
    customer_id: int
    order_date: datetime
    total_amount: Decimal
    order_status: str
    shipping_address: str
    tracking_number: str | None

    class Config:
        from_attributes = True


class OrderSummaryResponse(BaseModel):
    order: OrderResponse
    items: List[OrderItemResponse]

class OrderItemDetailResponse(BaseModel):
    product_id: int
    product_name: str
    brand: Optional[str] = None
    thumbnail_url: Optional[str] = None
    vendor_name: Optional[str] = None
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    order_id: int
    order_date: datetime
    total_amount: Decimal
    order_status: str
    shipping_address: str
    tracking_number: Optional[str] = None
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    items: List[OrderItemDetailResponse] = []

    class Config:
        from_attributes = True

