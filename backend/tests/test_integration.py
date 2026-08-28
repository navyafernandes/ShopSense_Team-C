import requests

BASE_URL = "http://127.0.0.1:8000"


def test_backend_is_running():
    response = requests.get(f"{BASE_URL}/")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "Backend Running Successfully 🚀"


def test_products_to_inventory_flow():
    """
    Verifies that product and inventory APIs
    are available and can work together.
    """

    products_response = requests.get(
        f"{BASE_URL}/products"
    )

    inventory_response = requests.get(
        f"{BASE_URL}/inventory"
    )

    assert products_response.status_code == 200
    assert inventory_response.status_code == 200

    products = products_response.json()
    inventory = inventory_response.json()

    # Products endpoint returns a list
    assert isinstance(products, list)

    # Inventory endpoint returns summary + products
    assert isinstance(inventory, dict)

    assert "summary" in inventory
    assert "products" in inventory

    # Validate inventory summary
    summary = inventory["summary"]

    assert "total_products" in summary
    assert "healthy" in summary
    assert "low_stock" in summary
    assert "critical" in summary

    # Validate inventory product list
    assert isinstance(inventory["products"], list)


def test_analytics_endpoints_integration():
    """
    Verifies that the analytics layer can retrieve
    information from the marketplace data layer.
    """

    endpoints = [
        "/analytics/admin/dashboard",
        "/analytics/sales",
        "/analytics/vendors",
        "/analytics/products",
        "/analytics/inventory",
        "/analytics/revenue-trend",
    ]

    for endpoint in endpoints:

        response = requests.get(
            BASE_URL + endpoint
        )

        assert response.status_code == 200

        data = response.json()

        assert data is not None


def test_transaction_to_analytics_flow():
    """
    Verifies that transaction data and analytics
    endpoints are simultaneously accessible.
    """

    transaction_response = requests.get(
        f"{BASE_URL}/transactions"
    )

    analytics_response = requests.get(
        f"{BASE_URL}/analytics/admin/dashboard"
    )

    assert transaction_response.status_code == 200
    assert analytics_response.status_code == 200

    transactions = transaction_response.json()
    analytics = analytics_response.json()

    assert isinstance(transactions, list)
    assert isinstance(analytics, dict)


def test_customer_analytics_endpoint():
    """
    Verifies that the customer analytics endpoint
    is available.
    """

    response = requests.get(
        f"{BASE_URL}/customer/analytics"
    )

    # This endpoint requires authentication,
    # so 401/403 is acceptable without a JWT.
    assert response.status_code in [200, 401, 403]


def test_vendor_analytics_endpoint():
    """
    Verifies that the vendor analytics endpoint
    is available.
    """

    response = requests.get(
        f"{BASE_URL}/vendor/analytics/customer-insights"
    )

    # This endpoint requires authentication,
    # so 401/403 is acceptable without a JWT.
    assert response.status_code in [200, 401, 403]