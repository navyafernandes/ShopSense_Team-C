from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.analytics_schema import (
    DashboardSummary,
    SalesSummary,
    VendorAnalytics,
    ProductAnalytics,
    InventoryAnalytics,
    RevenueTrend
)

from app.services.analytics_service import (
    get_dashboard_summary,
    get_sales_summary,
    get_vendor_analytics,
    get_product_analytics,
    get_inventory_analytics,
    get_revenue_trend
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get(
    "/admin/dashboard",
    response_model=DashboardSummary
)
@router.get(
    "/dashboard",
    response_model=DashboardSummary
)
def dashboard(
    db: Session = Depends(get_db)
):
    return get_dashboard_summary(db)

@router.get(
    "/sales",
    response_model=SalesSummary
)
def sales(
    db: Session = Depends(get_db)
):
    return get_sales_summary(db)

from typing import List

@router.get(
    "/vendors",
    response_model=List[VendorAnalytics]
)
def vendors(
    db: Session = Depends(get_db)
):
    return get_vendor_analytics(db)

@router.get(
    "/products",
    response_model=List[ProductAnalytics]
)
def products(
    db: Session = Depends(get_db)
):
    return get_product_analytics(db)

@router.get(
    "/inventory",
    response_model=InventoryAnalytics
)
def inventory(
    db: Session = Depends(get_db)
):
    return get_inventory_analytics(db)

@router.get(
    "/revenue-trend",
    response_model=list[RevenueTrend]
)
def revenue_trend(
    db: Session = Depends(get_db)
):
    return get_revenue_trend(db)