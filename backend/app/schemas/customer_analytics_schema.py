from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from app.schemas.recommendation_schema import RecommendedProduct


class CustomerSummary(BaseModel):
    total_spent: float
    total_orders: int
    average_order: float
    categories_purchased: int
    favorite_category: Optional[str] = None
    favorite_brand: Optional[str] = None
    customer_segment: Optional[str] = None
    repeat_purchase_rate: Optional[float] = None


class MonthlySpending(BaseModel):
    month: str
    amount: float


class CategoryBreakdown(BaseModel):
    category: str
    amount: float


class BrandBreakdown(BaseModel):
    brand: str
    amount: float


class OrderStatus(BaseModel):
    delivered: int
    pending: int
    shipped: int
    cancelled: int


class AIInsight(BaseModel):
    title: str
    description: str
    level: str


class Recommendation(BaseModel):
    title: str
    description: str


class CustomerAnalyticsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    summary: CustomerSummary
    monthly_spending: list[MonthlySpending]
    category_breakdown: list[CategoryBreakdown]
    brand_breakdown: list[BrandBreakdown]
    order_status: OrderStatus
    ai_insights: list[AIInsight]
    recommendations: list[Recommendation] = []
    recommended_products: list[RecommendedProduct] = []