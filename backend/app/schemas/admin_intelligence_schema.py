from pydantic import BaseModel


class MarketplaceHealth(BaseModel):
    score: int
    status: str


class Forecast(BaseModel):
    current_revenue: float
    predicted_revenue: float
    growth_percentage: float


class CustomerInsights(BaseModel):
    total_customers: int
    returning_customers: int
    premium_customers: int
    average_order_value: float


class VendorBenchmark(BaseModel):
    vendor_name: str
    revenue: float


class CategoryRevenue(BaseModel):
    category: str
    revenue: float


class AIInsight(BaseModel):
    title: str
    description: str
    level: str


class AdminIntelligenceResponse(BaseModel):
    health: MarketplaceHealth

    forecast: Forecast

    customer: CustomerInsights

    vendor_ranking: list[VendorBenchmark]

    category_revenue: list[CategoryRevenue]

    ai_insights: list[AIInsight]