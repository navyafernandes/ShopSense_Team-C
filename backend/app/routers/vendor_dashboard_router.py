from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.dependencies.auth import get_current_user
from app.enums.user_role import UserRole
from app.models.user import User

from app.schemas.vendor_dashboard_schema import (
    VendorDashboardSummary,
)

from app.services.vendor_dashboard_service import (
    get_vendor_dashboard,
)

from app.schemas.inventory_forecast_schema import InventoryForecastResponse

from app.services.inventory_forecast_service import (
    get_inventory_forecast,
)

from app.services.dashboard_analytics_service import (
    get_vendor_dashboard_analytics,
)

router = APIRouter(
    prefix="/vendor/dashboard",
    tags=["Vendor Dashboard"],
)


@router.get(
    "",
    response_model=VendorDashboardSummary,
)
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != UserRole.VENDOR:
        raise HTTPException(
            status_code=403,
            detail="Only vendors can access this dashboard.",
        )

    dashboard = get_vendor_dashboard(
        db,
        current_user,
    )

    if dashboard is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor profile not found.",
        )

    return dashboard

@router.get(
    "/inventory-forecast",
    response_model=list[InventoryForecastResponse],
)
def inventory_forecast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != UserRole.VENDOR:
        raise HTTPException(
            status_code=403,
            detail="Only vendors can access this feature.",
        )

    return get_inventory_forecast(
        db,
        current_user,
    )


@router.get("/analytics")
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    analytics = get_vendor_dashboard_analytics(
        db,
        current_user
    )

    if analytics is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found",
        )

    return analytics