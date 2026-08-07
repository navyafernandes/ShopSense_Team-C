from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user

from app.enums.user_role import UserRole
from app.models.user import User

from app.schemas.vendor_inventory_schema import (
    VendorInventoryPageResponse,
)

from app.services.vendor_inventory_service import (
    get_vendor_inventory,
)

router = APIRouter(
    prefix="/vendor/inventory",
    tags=["Vendor Inventory"],
)


@router.get(
    "",
    response_model=VendorInventoryPageResponse,
)
def inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != UserRole.VENDOR:
        raise HTTPException(
            status_code=403,
            detail="Only vendors can access this."
        )

    result = get_vendor_inventory(
        db,
        current_user,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found."
        )

    return result