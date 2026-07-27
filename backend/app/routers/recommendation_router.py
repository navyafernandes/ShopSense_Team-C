from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.enums.user_role import UserRole
from app.models.user import User

from app.schemas.recommendation_schema import RecommendationResponse
from app.services.recommendation_service import get_recommendations

router = APIRouter(
    prefix="/customers",
    tags=["Customer Recommendations"]
)


@router.get(
    "/recommendations",
    response_model=RecommendationResponse
)
def customer_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=403,
            detail="Only customers can access recommendations."
        )

    if current_user.customer is None:
      raise HTTPException(
        status_code=404,
        detail="Customer profile not found."
      )

    return get_recommendations(
      db=db,
      customer_id=current_user.customer.customer_id
    )