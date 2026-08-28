from locust import HttpUser, task, between


class ShopSenseAnalyticsUser(HttpUser):

    wait_time = between(1, 3)

    @task(3)
    def admin_dashboard(self):
        self.client.get(
            "/analytics/admin/dashboard",
            name="Admin Dashboard"
        )

    @task(2)
    def sales_analytics(self):
        self.client.get(
            "/analytics/sales",
            name="Sales Analytics"
        )

    @task(2)
    def product_analytics(self):
        self.client.get(
            "/analytics/products",
            name="Product Analytics"
        )

    @task(2)
    def inventory_analytics(self):
        self.client.get(
            "/analytics/inventory",
            name="Inventory Analytics"
        )

    @task(1)
    def vendor_analytics(self):
        self.client.get(
            "/analytics/vendors",
            name="Vendor Analytics"
        )

    @task(1)
    def revenue_trend(self):
        self.client.get(
            "/analytics/revenue-trend",
            name="Revenue Trend"
        )