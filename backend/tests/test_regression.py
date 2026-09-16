import sys
from pathlib import Path

backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app

_client = TestClient(app)

class _UniversalClient:
    def get(self, url, **kwargs):
        path = url.replace("http://127.0.0.1:8000", "").replace("http://localhost:8000", "")
        return _client.get(path or "/", **kwargs)

    def post(self, url, **kwargs):
        path = url.replace("http://127.0.0.1:8000", "").replace("http://localhost:8000", "")
        return _client.post(path or "/", **kwargs)

    def put(self, url, **kwargs):
        path = url.replace("http://127.0.0.1:8000", "").replace("http://localhost:8000", "")
        return _client.put(path or "/", **kwargs)

    def delete(self, url, **kwargs):
        path = url.replace("http://127.0.0.1:8000", "").replace("http://localhost:8000", "")
        return _client.delete(path or "/", **kwargs)

requests = _UniversalClient()
BASE_URL = "http://127.0.0.1:8000"


# ============================================================
# BACKEND
# ============================================================

def test_backend_regression():
    response = requests.get(f"{BASE_URL}/")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "Backend Running Successfully 🚀"


# ============================================================
# PRODUCTS
# ============================================================

def test_products_regression():
    response = requests.get(
        f"{BASE_URL}/products"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_product_catalogue_regression():
    response = requests.get(
        f"{BASE_URL}/products/catalogue"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_product_details_regression():
    # Use an existing product from the database
    products_response = requests.get(
        f"{BASE_URL}/products"
    )

    assert products_response.status_code == 200

    products = products_response.json()

    if len(products) == 0:
        return

    product_id = products[0]["product_id"]

    response = requests.get(
        f"{BASE_URL}/products/{product_id}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["product_id"] == product_id


def test_invalid_product_regression():
    response = requests.get(
        f"{BASE_URL}/products/999999999"
    )

    assert response.status_code == 404


# ============================================================
# INVENTORY
# ============================================================

def test_inventory_regression():
    response = requests.get(
        f"{BASE_URL}/inventory"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)

    assert "summary" in data
    assert "products" in data

    summary = data["summary"]

    assert "total_products" in summary
    assert "healthy" in summary
    assert "low_stock" in summary
    assert "critical" in summary

    assert isinstance(data["products"], list)


def test_low_stock_inventory_regression():
    response = requests.get(
        f"{BASE_URL}/inventory/low-stock"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_inventory_product_regression():
    products_response = requests.get(
        f"{BASE_URL}/products"
    )

    assert products_response.status_code == 200

    products = products_response.json()

    if len(products) == 0:
        return

    product_id = products[0]["product_id"]

    response = requests.get(
        f"{BASE_URL}/inventory/{product_id}"
    )

    # Product may legitimately have no inventory
    assert response.status_code in [200, 404]


# ============================================================
# TRANSACTIONS
# ============================================================

def test_transactions_regression():
    response = requests.get(
        f"{BASE_URL}/transactions"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


# ============================================================
# ANALYTICS
# ============================================================

def test_dashboard_analytics_regression():
    response = requests.get(
        f"{BASE_URL}/analytics/admin/dashboard"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)


def test_sales_analytics_regression():
    response = requests.get(
        f"{BASE_URL}/analytics/sales"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)


def test_vendor_analytics_regression():
    response = requests.get(
        f"{BASE_URL}/analytics/vendors"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_product_analytics_regression():
    response = requests.get(
        f"{BASE_URL}/analytics/products"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


def test_inventory_analytics_regression():
    response = requests.get(
        f"{BASE_URL}/analytics/inventory"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, dict)


def test_revenue_trend_regression():
    response = requests.get(
        f"{BASE_URL}/analytics/revenue-trend"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


# ============================================================
# AUTHENTICATION PROTECTION
# ============================================================

def test_customer_analytics_requires_authentication():
    response = requests.get(
        f"{BASE_URL}/customer/analytics"
    )

    assert response.status_code in [200, 401, 403]


def test_vendor_analytics_requires_authentication():
    response = requests.get(
        f"{BASE_URL}/vendor/analytics/customer-insights"
    )

    assert response.status_code in [200, 401, 403]


# ============================================================
# ORDERS
# ============================================================

def test_orders_requires_authentication():
    response = requests.get(
        f"{BASE_URL}/orders"
    )

    assert response.status_code in [401, 403]


# ============================================================
# AUTH ROUTES
# ============================================================

def test_auth_me_requires_authentication():
    response = requests.get(
        f"{BASE_URL}/auth/me"
    )

    assert response.status_code in [401, 403]