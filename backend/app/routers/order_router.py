from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.enums.user_role import UserRole
from app.models.user import User

from app.services import order_service

from typing import List
from app.schemas.order_schema import OrderListResponse

from app.schemas.order_schema import (
    OrderCreate,
    OrderSummaryResponse
)

from app.services.order_service import create_order

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.get(
    "",
    response_model=List[OrderListResponse]
)
def list_orders(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = order_service.get_customer_orders(
        db,
        user
    )
    if result == "CUSTOMER_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found."
        )
    return result


@router.post(
    "",
    response_model=OrderSummaryResponse
)
def place_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=403,
            detail="Only customers can place orders."
        )

    result = create_order(db, order, current_user)

    if result == "CUSTOMER_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found."
        )
    if result == "CART_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Cart not found."
        )
    if result == "EMPTY_CART":
        raise HTTPException(
            status_code=400,
            detail="Cart is empty."
        )
    if result == "PRODUCT_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Product in cart was not found."
        )
    if result == "INVENTORY_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Inventory record not found."
        )
    if result == "INSUFFICIENT_STOCK":
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock for one or more items."
        )

    return result

    