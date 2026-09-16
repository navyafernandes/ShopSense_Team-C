from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.enums.user_role import UserRole
from app.models.user import User

from app.schemas.inventory_schema import (
    InventoryCreate,
    InventoryUpdate,
    InventoryResponse,
    LowStockResponse,
    InventoryOverviewResponse,
)

from app.services.inventory_service import (
    create_inventory,
    get_low_stock_products,
    update_inventory,
    get_all_inventory,
    get_inventory_by_product
)

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.post("", response_model=InventoryResponse)
def add_inventory(
    inventory: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != UserRole.VENDOR:
        raise HTTPException(
            status_code=403,
            detail="Only vendors can manage inventory."
        )

    result = create_inventory(
        db,
        inventory,
        current_user
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor profile not found."
        )

    if result == "PRODUCT_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    if result == "FORBIDDEN":
        raise HTTPException(
            status_code=403,
            detail="You can manage only your own products."
        )

    if result == "ALREADY_EXISTS":
        raise HTTPException(
            status_code=400,
            detail="Inventory already exists for this product."
        )

    return result

@router.get(
    "/low-stock",
    response_model=list[LowStockResponse]
)
def low_stock(
    db: Session = Depends(get_db)
):

    results = get_low_stock_products(db)

    response = []

    for inventory, product in results:
        response.append(
            LowStockResponse(
                product_name=product.product_name,
                stock_quantity=inventory.stock_quantity,
                reorder_level=inventory.reorder_level,
                warehouse_location=inventory.warehouse_location
            )
        )

    return response

@router.put(
    "/{product_id}",
    response_model=InventoryResponse
)
def edit_inventory(
    product_id: int,
    inventory: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != UserRole.VENDOR:
        raise HTTPException(
            status_code=403,
            detail="Only vendors can manage inventory."
        )

    result = update_inventory(
        db,
        product_id,
        inventory,
        current_user
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor profile not found."
        )

    if result == "PRODUCT_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    if result == "FORBIDDEN":
        raise HTTPException(
            status_code=403,
            detail="You can update only your own products."
        )

    if result == "INVENTORY_NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Inventory not found."
        )

    return result

@router.get(
    "",
    response_model=InventoryOverviewResponse
)
def view_inventory(
    db: Session = Depends(get_db)
):

    return get_all_inventory(db)

@router.get(
    "/{product_id}",
    response_model=InventoryResponse
)
def view_inventory_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    inventory = get_inventory_by_product(
        db,
        product_id
    )

    if inventory is None:
        raise HTTPException(
            status_code=404,
            detail="Inventory not found."
        )

    return inventory

