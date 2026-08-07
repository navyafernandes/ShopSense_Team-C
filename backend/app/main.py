from fastapi import FastAPI

from app.routers.auth_router import router as auth_router

from app.routers.product_router import router as product_router

from app.routers.inventory_router import router as inventory_router

from app.routers.cart_router import router as cart_router

from app.routers.order_router import router as order_router

from app.routers.payment_router import router as payment_router

from app.routers.analytics_router import router as analytics_router

from app.routers.vendor_router import router as vendor_router

from app.routers.transaction_router import router as transaction_router

from app.routers.vendor_dashboard_router import router as vendor_dashboard_router

from app.routers.vendor_product_router import (
    router as vendor_product_router
)

from app.routers.category_router import (
    router as category_router
)

from app.routers.vendor_inventory_router import (
    router as vendor_inventory_router
)

from app.routers.vendor_order_router import (
    router as vendor_order_router
)

from app.routers.vendor_transaction_router import (
    router as vendor_transaction_router,
)

from app.routers.admin_intelligence_router import (
    router as admin_intelligence_router
)

from app.routers import customer_router

from app.routers import vendor_analytics

from app.routers import recommendation_router

from app.routers.customer_analytics_router import (
    router as customer_analytics_router
)

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(
    title="ShopSense API",
    description="Multi-Vendor E-Commerce Analytics Platform",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to ShopSense!",
        "status": "Backend Running Successfully 🚀"
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(product_router)
app.include_router(inventory_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(payment_router)
app.include_router(analytics_router)
app.include_router(vendor_router)
app.include_router(transaction_router)
app.include_router(vendor_dashboard_router)
app.include_router(vendor_product_router)
app.include_router(category_router)
app.include_router(vendor_inventory_router)
app.include_router(vendor_order_router)
app.include_router(vendor_transaction_router)
app.include_router(customer_router.router)
app.include_router(customer_analytics_router)
app.include_router(vendor_analytics.router)
app.include_router(recommendation_router.router)
app.include_router(admin_intelligence_router)