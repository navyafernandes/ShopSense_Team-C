from pydantic import BaseModel


class CustomerSummary(BaseModel):
    total_spent: float
    total_orders: int
    average_order: float
    categories_purchased: int


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

    summary: CustomerSummary

    monthly_spending: list[MonthlySpending]

    category_breakdown: list[CategoryBreakdown]

    brand_breakdown: list[BrandBreakdown]

    order_status: OrderStatus

    ai_insights: list[AIInsight]

    recommendations: list[Recommendation]