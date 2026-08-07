import { useEffect, useState } from "react";
import api from "../../services/api";

import StatCard from "../../components/StatCard";

import { getVendorDashboardAnalytics } from "../../services/dashboardAnalyticsService";

import RevenueLineChart from "../../components/vendor/charts/RevenueLineChart";
import RevenuePieChart from "../../components/vendor/charts/RevenuePieChart";
import TopProductsChart from "../../components/vendor/charts/TopProductsChart";
import MarketplaceHealthCard from "../../components/vendor/charts/MarketplaceHealthCard";




import {
  IndianRupee,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  UserCheck,
  UserPlus,
  BadgeDollarSign,
} from "lucide-react";

function VendorDashboard() {
  const [summary, setSummary] =useState(null);
  const [forecast, setForecast] = useState([]);
  const [customerInsights, setCustomerInsights] = useState(null);
  const [customerSegments, setCustomerSegments] = useState(null);
  const [analytics, setAnalytics] = useState({
    monthly_revenue: [],
    revenue_by_category: [],
    top_products: [],
    health: {},
    ai_insights: [],
});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [
  dashboardRes,
  forecastRes,
  customerRes,
  customerSegmentsRes,
  analyticsRes,
] = await Promise.all([
  api.get("/vendor/dashboard"),
  api.get("/vendor/dashboard/inventory-forecast"),
  api.get("/vendor/analytics/customer-insights"),
  api.get("/vendors/analytics/customer-segments"),
  api.get("/vendor/dashboard/analytics"),
]);

setSummary(dashboardRes.data);
setForecast(forecastRes.data);
setCustomerInsights(customerRes.data);
setCustomerSegments(customerSegmentsRes.data);
setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!summary || !customerInsights || !customerSegments) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <h2 className="text-xl font-semibold text-slate-600">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div>
      {/* Business Overview */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Business Overview
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor your products, sales and business performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Revenue"
          value={`₹${Number(summary.total_revenue).toLocaleString("en-IN")}`}
          icon={<IndianRupee size={22} />}
        />

        <StatCard
          title="Orders"
          value={summary.total_orders}
          icon={<ShoppingCart size={22} />}
        />

        <StatCard
          title="Products"
          value={summary.total_products}
          icon={<Package size={22} />}
        />

        <StatCard
          title="Units Sold"
          value={summary.products_sold}
          icon={<TrendingUp size={22} />}
        />
      </div>

      {/* Revenue Analytics */}

<div className="mt-10">
  <h2 className="text-2xl font-semibold text-slate-800 mb-6">
    Revenue Analytics
  </h2>

  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

    <RevenueLineChart
      data={analytics.monthly_revenue}
    />

    <RevenuePieChart
      data={analytics.revenue_by_category}
    />

  </div>
</div>

{/* Top Products & Marketplace Health */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

  <TopProductsChart
    data={analytics.top_products}
  />

  <MarketplaceHealthCard
    health={analytics.health}
  />

</div>


      {/* Inventory Forecast */}
      <div className="mt-10 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Inventory Forecast
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-slate-600">
                <th className="text-left py-3">Product</th>
                <th className="text-center py-3">Current Stock</th>
                <th className="text-center py-3">Forecast</th>
                <th className="text-center py-3">Recommended</th>
                <th className="text-center py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {forecast.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-slate-500"
                  >
                    No inventory data available.
                  </td>
                </tr>
              ) : (
                forecast.map((item) => (
                  <tr
                    key={item.product_id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="py-4 font-medium text-slate-800">
                      {item.product_name}
                    </td>

                    <td className="text-center">
                      {item.current_stock}
                    </td>

                    <td className="text-center">
                      {item.forecasted_demand}
                    </td>

                    <td className="text-center">
                      {item.recommended_stock}
                    </td>

                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.reorder
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
          Customer Insights
        </h2>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <StatCard
            title="Total Customers"
            value={customerInsights.total_customers}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Repeat Customers"
            value={customerInsights.repeat_customers}
            icon={<UserCheck size={22} />}
          />

          <StatCard
            title="New Customers"
            value={customerInsights.new_customers}
            icon={<UserPlus size={22} />}
          />

          <StatCard
            title="Average Order Value"
            value={`₹${Number(customerInsights.average_order_value).toLocaleString("en-IN")}`}
            icon={<BadgeDollarSign size={22} />}
          />

        </div>

        {/* Top Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">
              Top Customer
            </h3>

            {customerInsights.top_customer ? (
              <>
                <p className="text-xl font-bold">
                  {customerInsights.top_customer.customer_name}
                </p>

                <p className="text-slate-500 mt-2">
                  Total Spent
                </p>

                <p className="text-green-600 font-semibold">
                  ₹
                  {Number(
                    customerInsights.top_customer.total_spent
                  ).toLocaleString("en-IN")}
                </p>
              </>
            ) : (
              <p className="text-slate-500">
                No customer data available.
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">
              Top Product
            </h3>

            {customerInsights.top_product ? (
              <>
                <p className="text-xl font-bold">
                  {customerInsights.top_product.product_name}
                </p>

                <p className="text-slate-500 mt-2">
                  Units Sold
                </p>

                <p className="text-blue-600 font-semibold">
                  {customerInsights.top_product.units_sold}
                </p>
              </>
            ) : (
              <p className="text-slate-500">
                No product data available.
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">
              Top Category
            </h3>

            {customerInsights.top_category ? (
              <>
                <p className="text-xl font-bold">
                  {customerInsights.top_category.category_name}
                </p>

                <p className="text-slate-500 mt-2">
                  Units Sold
                </p>

                <p className="text-purple-600 font-semibold">
                  {customerInsights.top_category.units_sold}
                </p>
              </>
            ) : (
              <p className="text-slate-500">
                No category data available.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Customer Segmentation */}
<div className="mt-10">
  <h2 className="text-2xl font-semibold text-slate-800 mb-6">
    Customer Segmentation
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

    <StatCard
      title="Total Customers"
      value={customerSegments.total_customers}
      icon={<Users size={22} />}
    />

    <StatCard
      title="Premium Customers"
      value={customerSegments.premium_customers}
      icon={<BadgeDollarSign size={22} />}
    />

    <StatCard
      title="Regular Customers"
      value={customerSegments.regular_customers}
      icon={<Users size={22} />}
    />

    <StatCard
      title="New Customers"
      value={customerSegments.new_customers}
      icon={<UserPlus size={22} />}
    />

    <StatCard
      title="Inactive Customers"
      value={customerSegments.inactive_customers}
      icon={<UserCheck size={22} />}
    />

    <StatCard
      title="Silhouette Score"
      value={customerSegments.silhouette_score}
      icon={<TrendingUp size={22} />}
    />

  </div>

  <div className="mt-8 bg-white rounded-xl shadow-md overflow-x-auto">

    <table className="w-full">

      <thead>
        <tr className="border-b text-slate-600">
          <th className="text-left py-3 px-4">Customer</th>
          <th className="text-left py-3 px-4">Segment</th>
          <th className="text-center py-3">Spent</th>
          <th className="text-center py-3">Orders</th>
          <th className="text-center py-3">Average</th>
          <th className="text-center py-3">Recency</th>
        </tr>
      </thead>

      <tbody>

        {customerSegments.customers.map((customer) => (

          <tr
            key={customer.customer_id}
            className="border-b hover:bg-slate-50"
          >

            <td className="py-3 px-4 font-medium">
              {customer.customer_name}
            </td>

            <td className="py-3 px-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    customer.segment === "Premium"
                      ? "bg-green-100 text-green-700"
                      : customer.segment === "Regular"
                      ? "bg-blue-100 text-blue-700"
                      : customer.segment === "New"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {customer.segment}
              </span>
            </td>

            <td className="text-center">
              ₹{Number(customer.total_spent).toLocaleString("en-IN")}
            </td>

            <td className="text-center">
              {customer.order_count}
            </td>

            <td className="text-center">
              ₹{Number(customer.average_order_value).toLocaleString("en-IN")}
            </td>

            <td className="text-center">
              {customer.recency_days} days
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>
</div>
    </div>
  );
}

export default VendorDashboard;