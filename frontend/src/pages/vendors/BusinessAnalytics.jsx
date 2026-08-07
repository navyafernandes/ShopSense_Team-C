import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  FileDown,
  Loader2,
} from "lucide-react";

import BenchmarkCard from "../../components/vendor/charts/BenchmarkCard";
import BusinessInsightsCard from "../../components/vendor/charts/BusinessInsightsCard";
import AIBusinessAdvisorCard from "../../components/vendor/analytics/AIBusinessAdvisorCard";

import { generateBusinessReport } from "../../utils/pdfReport";

function BusinessAnalytics() {
  const [analytics, setAnalytics] =
    useState({
      benchmark: null,
      ai_insights: [],
      revenue_by_category: [],
      top_products: [],
      health: {},
    });

  const [ai, setAI] =
    useState(null);

  const [loadingAI, setLoadingAI] =
    useState(true);

  const [exporting, setExporting] =
    useState(false);

  useEffect(() => {
    fetchAnalytics();
    fetchAI();
  }, []);

  const fetchAnalytics =
    async () => {
      try {
        const res =
          await api.get(
            "/vendor/dashboard/analytics"
          );

        setAnalytics(res.data);
      } catch (error) {
        console.error(
          "Failed to fetch analytics:",
          error
        );
      }
    };

  const fetchAI =
    async () => {
      try {
        const res =
          await api.get(
            "/vendor/dashboard/ai-analysis"
          );

        setAI(res.data);
      } catch (error) {
        console.error(
          "Failed to fetch AI analysis:",
          error
        );
      } finally {
        setLoadingAI(false);
      }
    };

  const handleExport =
    async () => {
      try {
        setExporting(true);

        generateBusinessReport(
          analytics,
          ai
        );
      } catch (error) {
        console.error(
          "PDF Export Failed:",
          error
        );
      } finally {
        setExporting(false);
      }
    };

  return (
    <div className="space-y-10">

      {/* Page Header */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h1 className="text-4xl font-bold text-slate-900">
            Business Analytics
          </h1>

          <p className="mt-2 text-slate-500">
            Gain deeper insights into your
            marketplace performance and
            customers.
          </p>

        </div>

        {/* Export Button */}

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >

          {exporting ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Generating Report...
            </>
          ) : (
            <>
              <FileDown size={18} />

              Export Report
            </>
          )}

        </button>

      </div>

      {/* Marketplace Benchmark */}

      <BenchmarkCard
        benchmark={
          analytics.benchmark
        }
      />

      {/* Business Insights */}

      <BusinessInsightsCard
        insights={
          analytics.ai_insights
        }
        revenueByCategory={
          analytics.revenue_by_category
        }
        topProducts={
          analytics.top_products
        }
        health={
          analytics.health
        }
      />

      {/* AI Business Advisor */}

      <AIBusinessAdvisorCard
        ai={ai}
        loading={loadingAI}
      />

    </div>
  );
}

export default BusinessAnalytics;