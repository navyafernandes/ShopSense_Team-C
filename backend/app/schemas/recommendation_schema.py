from pydantic import BaseModel
from typing import Optional

class RecommendedProduct(BaseModel):
    product_id: int
    product_name: str
    brand: Optional[str]
    thumbnail_url: Optional[str]
    category_name: str
    price: float
    discount_price: Optional[float]
    rating: Optional[float]
    reason: str

class RecommendationResponse(BaseModel):
    total_recommendations: int
    recommended_products: list[RecommendedProduct]

    class Config:
        from_attributes = True