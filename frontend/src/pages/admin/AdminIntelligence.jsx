import { useEffect, useState } from "react";
import api from "../../services/api";

import MarketplaceHealthCard from "../../components/admin/intelligence/MarketplaceHealthCard";
import RevenueForecastCard from "../../components/admin/intelligence/RevenueForecastCard";
import CustomerInsightsCard from "../../components/admin/intelligence/CustomerInsightsCard";
import VendorBenchmarkChart from "../../components/admin/intelligence/VendorBenchmarkChart";
import CategoryRevenueChart from "../../components/admin/intelligence/CategoryRevenueChart";
import AIInsightsPanel from "../../components/admin/intelligence/AIInsightsPanel";

function AdminIntelligence() {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchIntelligence();

  }, []);

  const fetchIntelligence = async () => {

    try {

      const res = await api.get(
        "/admin/intelligence"
      );

      setData(res.data);

    } catch (err) {

      console.error(
        "Failed to fetch intelligence",
        err
      );

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (
      <div className="p-10">
        Loading Marketplace Intelligence...
      </div>
    );

  }

  return (

    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold text-slate-900">
          Marketplace Intelligence
        </h1>

        <p className="text-slate-500 mt-2">
          AI-powered marketplace insights,
          forecasting and benchmarking.
        </p>

      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <MarketplaceHealthCard
          health={data.health}
        />

        <RevenueForecastCard
          forecast={data.forecast}
        />

        <CustomerInsightsCard
          customer={data.customer}
        />

      </div>

      {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-8">

        <VendorBenchmarkChart
          vendors={data.vendor_ranking}
        />

        <CategoryRevenueChart
          categories={data.category_revenue}
        />

      </div>

      {/* AI */}

      <AIInsightsPanel
        insights={data.ai_insights}
      />

    </div>

  );

}

export default AdminIntelligence;