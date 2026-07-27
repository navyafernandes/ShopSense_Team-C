from decimal import Decimal
from pydantic import BaseModel


# =====================================================
# Dashboard Summary
# =====================================================

class VendorDashboardSummary(BaseModel):
    total_revenue: Decimal
    total_orders: int
    total_products: int
    products_sold: int


# =====================================================
# Revenue Trend
# =====================================================

class RevenueTrend(BaseModel):
    month: str
    revenue: Decimal


# =====================================================
# Revenue by Category
# =====================================================

class RevenueByCategory(BaseModel):
    category: str
    revenue: Decimal


# =====================================================
# Top Selling Products
# =====================================================

class TopProduct(BaseModel):
    product_name: str
    units_sold: int


# =====================================================
# Marketplace Health
# =====================================================

class MarketplaceHealth(BaseModel):
    score: int
    status: str


# =====================================================
# AI Insights
# =====================================================

class AIInsight(BaseModel):
    title: str
    description: str
    level: str


# =====================================================
# Complete Analytics Dashboard Response
# =====================================================

class VendorDashboardAnalytics(BaseModel):
    monthly_revenue: list[RevenueTrend]
    revenue_by_category: list[RevenueByCategory]
    top_products: list[TopProduct]
    health: MarketplaceHealth
    ai_insights: list[AIInsight]