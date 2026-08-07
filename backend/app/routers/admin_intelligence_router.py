from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.enums.user_role import UserRole
from app.models.user import User

from app.schemas.admin_intelligence_schema import (
    AdminIntelligenceResponse,
)

from app.services.admin_intelligence_service import (
    get_marketplace_intelligence,
)

router = APIRouter(
    prefix="/admin/intelligence",
    tags=["Admin Intelligence"],
)


@router.get(
    "",
    response_model=AdminIntelligenceResponse,
)
def marketplace_intelligence(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can access this."
        )

    return get_marketplace_intelligence(db)