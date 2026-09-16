from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.schemas.customer_schema import (
    CustomerProfileResponse,
    CustomerProfileUpdate,
    MessageResponse,
)

from app.services import customer_service

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.get(
    "/profile",
    response_model=CustomerProfileResponse
)
def get_profile(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = customer_service.get_customer_profile(db, user)
    if result == "CUSTOMER_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found."
        )
    return result


@router.put(
    "/profile",
    response_model=MessageResponse
)
def update_profile(
    profile: CustomerProfileUpdate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    result = customer_service.update_customer_profile(db, user, profile)
    if result == "CUSTOMER_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found."
        )
    return result