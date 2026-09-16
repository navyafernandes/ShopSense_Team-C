from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.models.user import User
from app.enums.user_role import UserRole

from app.database import get_db

from app.schemas.vendor_schema import VendorResponse

from app.services.vendor_service import (
    get_all_vendors,
    get_vendor_by_id,
    delete_vendor,
    update_vendor_status,
)

from app.services.customer_segmentation_service import get_customer_segments
from app.schemas.customer_segmentation_schema import CustomerSegmentationResponse

router = APIRouter(

    prefix="/vendors",
    tags=["Vendors"],
)


@router.get(
    "",
    response_model=list[VendorResponse]
)
@router.get(
    "/",
    response_model=list[VendorResponse]
)
def list_vendors(db: Session = Depends(get_db)):
    return get_all_vendors(db)


@router.get(
    "/analytics/customer-segments",
    response_model=CustomerSegmentationResponse
)
def customer_segments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != UserRole.VENDOR:
        raise HTTPException(
            status_code=403,
            detail="Only vendors can access customer segmentation."
        )

    return get_customer_segments(db, current_user)


@router.get(
    "/{vendor_id}",
    response_model=VendorResponse
)
def vendor_details(
    vendor_id: int,
    db: Session = Depends(get_db),
):
    vendor = get_vendor_by_id(db, vendor_id)

    if vendor is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found",
        )

    return vendor


@router.put("/{vendor_id}/status")
def change_vendor_status(
    vendor_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    status = status.upper()

    allowed_status = [
        "PENDING",
        "APPROVED",
        "REJECTED"
    ]

    if status not in allowed_status:
        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    vendor = update_vendor_status(
        db,
        vendor_id,
        status
    )

    if vendor is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    return vendor