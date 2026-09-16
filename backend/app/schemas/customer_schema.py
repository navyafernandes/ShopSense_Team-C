from pydantic import BaseModel
from typing import Optional

from datetime import datetime
from decimal import Decimal

class CustomerProfileResponse(BaseModel):
    customer_id: int
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    created_at: Optional[datetime] = None
    total_orders: int = 0
    total_spent: Decimal = Decimal("0.00")

    class Config:
        from_attributes = True


class CustomerProfileUpdate(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None


class MessageResponse(BaseModel):
    message: str