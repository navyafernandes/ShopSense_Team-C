import { useEffect, useState } from "react";
import api from "../../services/api";

import CustomerSummaryCards from "../../components/customer/analytics/CustomerSummaryCards";
import MonthlySpendingChart from "../../components/customer/analytics/MonthlySpendingChart";
import CategoryPieChart from "../../components/customer/analytics/CategoryPieChart";
import BrandBarChart from "../../components/customer/analytics/BrandBarChart";
import OrderStatusDonut from "../../components/customer/analytics/OrderStatusDonut";
import AIShoppingInsights from "../../components/customer/analytics/AIShoppingInsights";
import ShoppingRecommendations from "../../components/customer/analytics/ShoppingRecommendations";

function CustomerAnalytics() {

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

    try {

      const res = await api.get(
        "/customer/analytics"
      );

      setAnalytics(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Loading Spending Insights...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto mt-12">
        <h2 className="text-xl font-bold text-slate-800">No Shopping Insights Yet</h2>
        <p className="text-slate-500 text-sm mt-2">
          Start browsing products and placing orders to view your personalized spending trends and recommendations.
        </p>
      </div>
    );
  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Spending Insights
        </h1>

        <p className="text-slate-500 mt-2">
          Discover your shopping behaviour,
          spending trends and personalized
          recommendations.
        </p>

      </div>

      <CustomerSummaryCards
        summary={analytics.summary}
      />

      <MonthlySpendingChart
        data={analytics.monthly_spending}
      />

      <div className="grid lg:grid-cols-2 gap-8">

        <CategoryPieChart
          data={analytics.category_breakdown}
        />

        <BrandBarChart
          data={analytics.brand_breakdown}
        />

      </div>

      <OrderStatusDonut
        status={analytics.order_status}
      />

      <AIShoppingInsights
        insights={analytics.ai_insights}
      />

      <ShoppingRecommendations
        recommendedProducts={analytics.recommended_products}
        recommendations={analytics.recommendations}
      />

    </div>

  );

}

export default CustomerAnalytics;