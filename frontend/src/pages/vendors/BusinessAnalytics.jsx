import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  FileDown,
  Loader2,
  Download,
} from "lucide-react";

import BenchmarkCard from "../../components/vendor/charts/BenchmarkCard";
import BusinessInsightsCard from "../../components/vendor/charts/BusinessInsightsCard";
import AIBusinessAdvisorCard from "../../components/vendor/analytics/AIBusinessAdvisorCard";

import { generateBusinessReport } from "../../utils/pdfReport";
import { downloadCSV } from "../../utils/csvExport";

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

  const handleExportCSV = () => {
    const rows = [
      ["ShopSense Vendor Business Analytics Report"],
      ["Generated Date", new Date().toLocaleString("en-IN")],
      [],
      ["Benchmark Metric", "Vendor Value", "Marketplace Benchmark"],
      [
        "Vendor Revenue",
        analytics.benchmark?.vendor_revenue || 0,
        analytics.benchmark?.avg_marketplace_revenue || 0,
      ],
      [
        "Vendor Orders",
        analytics.benchmark?.vendor_orders || 0,
        analytics.benchmark?.avg_marketplace_orders || 0,
      ],
      [
        "Average Order Value",
        analytics.benchmark?.vendor_aov || 0,
        analytics.benchmark?.avg_marketplace_aov || 0,
      ],
      [],
      ["Top Products", "Units Sold", "Revenue (INR)"],
      ...(analytics.top_products || []).map((p) => [
        p.product_name,
        p.units_sold,
        p.revenue,
      ]),
      [],
      ["Category Revenue Breakdown", "Revenue (INR)"],
      ...(analytics.revenue_by_category || []).map((c) => [
        c.category_name,
        c.revenue,
      ]),
    ];

    downloadCSV(
      `Vendor_Business_Analytics_${new Date().toISOString().slice(0, 10)}.csv`,
      rows
    );
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

        {/* Export Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-300 px-4 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            <Download size={18} />
            Export CSV
          </button>

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

                Generating PDF...
              </>
            ) : (
              <>
                <FileDown size={18} />

                Export PDF
              </>
            )}

          </button>
        </div>

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