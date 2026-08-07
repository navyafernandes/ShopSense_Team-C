from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class VendorTransactionResponse(BaseModel):
    order_item_id: int
    payment_id: int
    order_id: int
    customer_name: str
    product_name: str
    amount: Decimal
    payment_method: str
    payment_status: str
    payment_date: datetime

    class Config:
        from_attributes = True