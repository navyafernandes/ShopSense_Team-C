from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.user_schema import (
    UserRegister,
    UserResponse,
    UserLogin,
    Token,
)

from app.services.auth_service import (
    register_user,
    authenticate_user,
)

from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):

    new_user = register_user(
        db,
        user,
    )

    if not new_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists.",
        )

    return new_user


@router.post(
    "/login",
    response_model=Token,
)
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):

    result = authenticate_user(
        db,
        user.email,
        user.password,
    )

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return {
        "access_token": result["access_token"],
        "token_type": "bearer",
        "role": result["role"],
        "name": result["name"],
    }


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user