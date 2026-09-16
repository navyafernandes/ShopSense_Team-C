import { useEffect, useState } from "react";

import {
  DollarSign,
  ShoppingCart,
  Users,
  Store,
} from "lucide-react";

import api from "../services/api";

import PageHeader from "../components/common/PageHeader";
import LoadingSpinner from "../components/common/LoadingSpinner";

import AnalyticsCard from "../components/analytics/AnalyticsCard";

function Analytics() {
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get("/analytics/dashboard");

      setSummary(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) return <LoadingSpinner />;

  return (
    <div className="p-8">

      <PageHeader
        title="Marketplace Analytics"
        subtitle="Monitor marketplace performance and business insights."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <AnalyticsCard
          title="Marketplace Revenue"
          value={`₹${Number(
            summary.total_revenue
          ).toLocaleString("en-IN")}`}
          icon={<DollarSign size={28} />}
        />

        <AnalyticsCard
          title="Orders"
          value={summary.total_orders}
          icon={<ShoppingCart size={28} />}
        />

        <AnalyticsCard
          title="Customers"
          value={summary.total_customers}
          icon={<Users size={28} />}
        />

        <AnalyticsCard
          title="Approved Vendors"
          value={summary.total_vendors}
          icon={<Store size={28} />}
        />

      </div>

    </div>
  );
}

export default Analytics;