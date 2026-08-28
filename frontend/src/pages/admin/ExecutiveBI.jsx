import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaLightbulb,
  FaExclamationTriangle,
  FaFileAlt,
} from "react-icons/fa";

import { generateExecutiveReport } from "../../utils/executiveReport";

function ExecutiveBI() {
  const [sales, setSales] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExecutiveData();
  }, []);

  const fetchExecutiveData = async () => {
    try {
      const [
        salesResponse,
        inventoryResponse,
        vendorsResponse,
        productsResponse,
      ] = await Promise.all([
        api.get("/analytics/sales"),
        api.get("/analytics/inventory"),
        api.get("/analytics/vendors"),
        api.get("/analytics/products"),
      ]);

      setSales(salesResponse.data);
      setInventory(inventoryResponse.data);
      setVendors(vendorsResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error("Failed to load Executive BI data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !sales || !inventory) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <h2 className="text-xl font-semibold text-slate-600">
          Loading Executive BI...
        </h2>
      </div>
    );
  }

  const revenue = Number(sales.total_revenue || 0);
  const orders = Number(sales.total_orders || 0);
  const productsSold = Number(sales.products_sold || 0);
  const averageOrderValue = Number(sales.average_order_value || 0);

  /*
   * Business Score
   *
   * This is an operational indicator rather than an ML prediction.
   * It is calculated from:
   * - inventory health
   * - sales activity
   * - order activity
   */
  const totalInventoryProducts = Number(inventory.total_products || 0);
  const lowStock = Number(inventory.low_stock_products || 0);
  const outOfStock = Number(inventory.out_of_stock_products || 0);

  let inventoryScore = 100;

  if (totalInventoryProducts > 0) {
    inventoryScore =
      100 -
      ((lowStock + outOfStock) / totalInventoryProducts) * 100;
  }

  inventoryScore = Math.max(0, Math.min(100, inventoryScore));

  const businessScore = Math.round(inventoryScore);

  const businessStatus =
    businessScore >= 80
      ? "Healthy"
      : businessScore >= 60
      ? "Stable"
      : "Needs Attention";

  const scoreColor =
    businessScore >= 80
      ? "text-emerald-400"
      : businessScore >= 60
      ? "text-amber-400"
      : "text-red-400";

  /*
   * Determine management priority dynamically
   */
  let managementPriority = "Monitor Inventory";
  let managementMessage =
    "Inventory levels should be monitored to prevent stock shortages from affecting marketplace performance.";

  if (outOfStock > 0) {
    managementPriority = "Resolve Stockouts";
    managementMessage = `${outOfStock} product(s) are currently out of stock and may affect sales availability.`;
  } else if (lowStock > 0) {
    managementPriority = "Monitor Inventory";
    managementMessage = `${lowStock} product(s) are approaching low-stock levels and may require replenishment.`;
  } else if (orders === 0) {
    managementPriority = "Monitor Sales Activity";
    managementMessage =
      "No orders have been recorded yet. Monitor marketplace activity and customer engagement.";
  } else {
    managementPriority = "Optimize Growth";
    managementMessage =
      "Inventory is currently healthy. Focus on improving sales performance and maximizing high-performing products.";
  }

  /*
   * Top vendor
   */
  const topVendor = vendors.length > 0 ? vendors[0] : null;

  /*
   * Top product
   */
  const topProduct = products.length > 0 ? products[0] : null;

  /*
   * Strategic performance
   *
   * Since the current API provides product-level analytics rather than
   * category-level analytics, we use the top products for the moment.
   */
  const strategicProducts = products.slice(0, 4);

  const maxProductUnits =
    strategicProducts.length > 0
      ? Math.max(
          ...strategicProducts.map(
            (product) => Number(product.units_sold || 0)
          )
        )
      : 1;

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Executive BI
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
            Executive Command Center
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            A strategic view of marketplace performance, business drivers,
            risks, and opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>

          <span className="text-sm font-medium text-slate-600">
            Marketplace Operational
          </span>
        </div>

      </div>


      {/* ================= BUSINESS SCORE ================= */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Business Score */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-7 text-white shadow-xl">

          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl"></div>

          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Business Score
          </p>

          <div className="mt-4 flex items-end gap-3">
            <span className={`text-6xl font-bold ${scoreColor}`}>
              {businessScore}
            </span>

            <span
              className={`mb-2 rounded-full px-3 py-1 text-sm font-semibold ${
                businessScore >= 80
                  ? "bg-emerald-500/20 text-emerald-400"
                  : businessScore >= 60
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {businessStatus}
            </span>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${businessScore}%` }}
            ></div>
          </div>

          <p className="mt-3 text-sm text-slate-400">
            Operational marketplace health indicator
          </p>

        </div>


        {/* Performance Direction */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaChartLine />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Performance Direction
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                {orders > 0 ? "Active Marketplace" : "Early Activity"}
              </h2>
            </div>

          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            The marketplace currently has{" "}
            <strong>{orders.toLocaleString("en-IN")}</strong> recorded
            orders and{" "}
            <strong>{productsSold.toLocaleString("en-IN")}</strong>{" "}
            products sold.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <FaArrowUp />
            Sales Activity
          </div>

        </div>


        {/* Management Priority */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaExclamationTriangle />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Management Priority
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                {managementPriority}
              </h2>
            </div>

          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            {managementMessage}
          </p>

        </div>

      </section>


      {/* ================= PERFORMANCE SNAPSHOT ================= */}
      <section>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Performance Snapshot
          </h2>

          <p className="text-sm text-slate-500">
            Current business indicators from the marketplace database.
          </p>
        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {[
            {
              label: "Revenue",
              value: `₹${revenue.toLocaleString("en-IN")}`,
            },
            {
              label: "Orders",
              value: orders.toLocaleString("en-IN"),
            },
            {
              label: "Products Sold",
              value: productsSold.toLocaleString("en-IN"),
            },
            {
              label: "Average Order Value",
              value: `₹${averageOrderValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}`,
            },
          ].map((metric) => (

            <div
              key={metric.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

              <p className="text-sm font-medium text-slate-500">
                {metric.label}
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {metric.value}
              </p>

              <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-indigo-600">
                <FaChartLine />

                <span className="font-normal text-slate-400">
                  Live marketplace metric
                </span>
              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= WHAT CHANGED / WHERE TO ACT ================= */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* What changed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaChartLine />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Marketplace Snapshot
              </h2>

              <p className="text-sm text-slate-500">
                Current operational movements.
              </p>
            </div>

          </div>


          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <FaArrowUp size={12} />
                </span>

                <span className="text-sm font-medium text-slate-700">
                  Revenue generated
                </span>
              </div>

              <span className="text-sm font-bold text-indigo-600">
                ₹{revenue.toLocaleString("en-IN")}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <FaShoppingCartIcon />
                </span>

                <span className="text-sm font-medium text-slate-700">
                  Total orders
                </span>
              </div>

              <span className="text-sm font-bold text-indigo-600">
                {orders.toLocaleString("en-IN")}
              </span>
            </div>


            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <FaChartLine size={12} />
                </span>

                <span className="text-sm font-medium text-slate-700">
                  Products sold
                </span>
              </div>

              <span className="text-sm font-bold text-indigo-600">
                {productsSold.toLocaleString("en-IN")}
              </span>
            </div>


            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <FaChartLine size={12} />
                </span>

                <span className="text-sm font-medium text-slate-700">
                  Average order value
                </span>
              </div>

              <span className="text-sm font-bold text-indigo-600">
                ₹
                {averageOrderValue.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

          </div>

        </div>


        {/* Where to act */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaLightbulb />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Where To Act?
              </h2>

              <p className="text-sm text-slate-500">
                Areas requiring management attention.
              </p>
            </div>

          </div>


          <div className="mt-6 space-y-4">

            {outOfStock > 0 && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-bold text-red-700">
                  Stockout Risk
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {outOfStock} product(s) currently have no available stock.
                </p>
              </div>
            )}


            {lowStock > 0 && (
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-700">
                  Low Stock
                </p>

                <p className="mt-1 text-sm text-amber-600">
                  {lowStock} product(s) are currently at low-stock levels.
                </p>
              </div>
            )}


            {topVendor && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-sm font-bold text-indigo-700">
                  Leading Vendor
                </p>

                <p className="mt-1 text-sm text-indigo-600">
                  {topVendor.vendor_name} is currently the leading vendor
                  by revenue.
                </p>
              </div>
            )}

          </div>

        </div>

      </section>


      {/* ================= STRATEGIC PERFORMANCE ================= */}
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Strategic Performance
          </h2>

          <p className="text-sm text-slate-500">
            Relative sales contribution of leading products.
          </p>
        </div>


        <div className="mt-8 space-y-6">

          {strategicProducts.length === 0 ? (
            <p className="text-sm text-slate-500">
              No product sales data available yet.
            </p>
          ) : (
            strategicProducts.map((product) => {

              const unitsSold = Number(product.units_sold || 0);

              const percentage =
                maxProductUnits > 0
                  ? Math.round((unitsSold / maxProductUnits) * 100)
                  : 0;

              return (
                <div key={product.product_name}>

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="font-semibold text-slate-700">
                      {product.product_name}
                    </span>

                    <span className="text-slate-500">
                      {unitsSold.toLocaleString("en-IN")} units
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${percentage}%` }}
                    />

                  </div>

                </div>
              );
            })
          )}

        </div>

      </section>


      {/* ================= EXECUTIVE BRIEF ================= */}
      <section className="rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 text-white shadow-xl">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-3xl">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-white/10 p-3">
                <FaFileAlt />
              </div>

              <div>

                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
                  Executive Reporting
                </p>

                <h2 className="text-2xl font-bold">
                  Executive Brief
                </h2>

              </div>

            </div>


            <p className="mt-5 leading-7 text-slate-300">

              The marketplace has generated{" "}
              <strong>
                ₹{revenue.toLocaleString("en-IN")}
              </strong>{" "}
              in revenue across{" "}
              <strong>
                {orders.toLocaleString("en-IN")}
              </strong>{" "}
              orders, with an average order value of{" "}
              <strong>
                ₹
                {averageOrderValue.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </strong>
              .{" "}

              {outOfStock > 0
                ? `Management attention is currently required for ${outOfStock} out-of-stock product(s).`
                : lowStock > 0
                ? `Management should monitor ${lowStock} low-stock product(s) to prevent future stockouts.`
                : "Current inventory levels are not showing immediate stockout concerns."}

              {topVendor &&
                ` ${topVendor.vendor_name} is currently the leading vendor by revenue.`}

            </p>

          </div>


          <button
            onClick={() => window.print()}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-indigo-50"
          >
            <FaFileAlt />
            Print Executive Report
          </button>

        </div>

      </section>

    </div>
  );
}

/*
 * Small local icon wrapper so we don't need another dependency.
 */
function FaShoppingCartIcon() {
  return <FaArrowUp size={12} />;
}

export default ExecutiveBI;