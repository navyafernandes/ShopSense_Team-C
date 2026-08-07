from pydantic import BaseModel, EmailStr
from typing import Optional

from app.enums.user_role import UserRole

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

    role: UserRole

    # Vendor Information
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    gst_number: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    phone: Optional[str]
    role: str
    status: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str