from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.customer_insights_schema import CustomerInsightsResponse
from app.services.customer_insights_service import get_customer_insights

router = APIRouter(
    prefix="/vendor/analytics",
    tags=["Vendor Analytics"]
)


@router.get(
    "/customer-insights",
    response_model=CustomerInsightsResponse
)
def customer_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_customer_insights(db, current_user)