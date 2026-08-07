from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.enums.user_role import UserRole
from app.models.user import User

from app.schemas.customer_analytics_schema import (
    CustomerAnalyticsResponse,
)

from app.services.customer_analytics_service import (
    get_customer_analytics,
)


router = APIRouter(
    prefix="/customer/analytics",
    tags=["Customer Analytics"],
)


@router.get(
    "",
    response_model=CustomerAnalyticsResponse,
)
def customer_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=403,
            detail="Only customers can access this."
        )

    result = get_customer_analytics(
        db,
        current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found."
        )

    return result