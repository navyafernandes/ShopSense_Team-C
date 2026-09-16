from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.enums.user_role import UserRole
from app.models.user import User

from app.schemas.product_schema import (
    ProductCreate,
    ProductUpdate,
    ProductStatusUpdate,
    ProductResponse,
    ProductCatalogueResponse,
)

from app.services.product_service import (
    create_product,
    get_all_products,
    get_product_by_id,
    update_product,
    delete_product,
    get_product_catalogue,
    update_product_status,
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("", response_model=ProductResponse)
def add_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != UserRole.VENDOR:
        raise HTTPException(
            status_code=403,
            detail="Only vendors can add products."
        )

    new_product = create_product(
        db,
        product,
        current_user
    )

    if new_product is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor profile not found."
        )

    return new_product

@router.get("", response_model=list[ProductResponse])
def list_products(
    db: Session = Depends(get_db)
):
    return get_all_products(db)

@router.get(
    "/catalogue",
    response_model=list[ProductCatalogueResponse]
)
def catalogue(
    db: Session = Depends(get_db)
):
    return get_product_catalogue(db)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = get_product_by_id(db, product_id)

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    return product

@router.put("/{product_id}", response_model=ProductResponse)
def edit_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != UserRole.VENDOR:
        raise HTTPException(
            status_code=403,
            detail="Only vendors can update products."
        )

    updated_product = update_product(
        db,
        product_id,
        product,
        current_user
    )

    if updated_product is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor profile not found."
        )

    if updated_product == "NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    if updated_product == "FORBIDDEN":
        raise HTTPException(
            status_code=403,
            detail="You can update only your own products."
        )

    return updated_product

@router.delete("/{product_id}")
def remove_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != UserRole.VENDOR:
        raise HTTPException(
            status_code=403,
            detail="Only vendors can delete products."
        )

    result = delete_product(
        db,
        product_id,
        current_user
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor profile not found."
        )

    if result == "NOT_FOUND":
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    if result == "FORBIDDEN":
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own products."
        )

    return {
        "message": "Product deleted successfully."
    }


@router.put("/{product_id}/status", response_model=ProductResponse)
def change_product_status(
    product_id: int,
    status_update: ProductStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.VENDOR]:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized to update product status."
        )

    product = get_product_by_id(db, product_id)
    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    if current_user.role == UserRole.VENDOR:
        from app.models.vendor import Vendor
        vendor = db.query(Vendor).filter(Vendor.user_id == current_user.user_id).first()
        if not vendor or product.vendor_id != vendor.vendor_id:
            raise HTTPException(
                status_code=403,
                detail="You can update only your own products."
            )

    new_status = status_update.product_status.upper()
    allowed_statuses = ["ACTIVE", "OUT_OF_STOCK", "DISCONTINUED"]
    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed statuses: {', '.join(allowed_statuses)}"
        )

    return update_product_status(db, product_id, new_status)