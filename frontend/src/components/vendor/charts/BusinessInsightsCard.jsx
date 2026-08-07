import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Trophy,
  Package,
  HeartPulse,
} from "lucide-react";

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
];

function BusinessInsightsCard({
  revenueByCategory = [],
  topProducts = [],
  health = {},
}) {

  const topCategory =
    revenueByCategory.length > 0
      ? revenueByCategory.reduce((a, b) =>
          a.revenue > b.revenue ? a : b
        )
      : null;

  const bestProduct =
    topProducts.length > 0
      ? topProducts[0]
      : null;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      {/* Header */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-slate-800">
          Business Insights
        </h2>

        <p className="text-slate-500 mt-2">
          Quick overview of your business performance.
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* LEFT */}

        <div>

          <h3 className="font-semibold text-lg text-slate-700 mb-5">
            Revenue Distribution
          </h3>

          <div className="h-80">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={revenueByCategory}
                  dataKey="revenue"
                  nameKey="category"
                  innerRadius={75}
                  outerRadius={110}
                  paddingAngle={3}
                >

                  {revenueByCategory.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* Legend */}

          <div className="grid grid-cols-2 gap-3 mt-5">

            {revenueByCategory.map((item, index) => (

              <div
                key={index}
                className="flex items-center gap-3"
              >

                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    background: COLORS[index % COLORS.length],
                  }}
                />

                <span className="text-sm text-slate-700">
                  {item.category}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          {/* Top Category */}

          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-green-100 p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="rounded-full bg-white p-4 shadow">

                <Trophy
                  className="text-emerald-600"
                  size={28}
                />

              </div>

              <div>

                <p className="text-slate-500">
                  Top Category
                </p>

                <h3 className="text-2xl font-bold text-slate-800">
                  {topCategory?.category}
                </h3>

                <p className="text-emerald-700 font-semibold mt-1">
                  ₹
                  {Number(
                    topCategory?.revenue || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>

            </div>

          </div>

          {/* Best Seller */}

          <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-100 p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="rounded-full bg-white p-4 shadow">

                <Package
                  className="text-orange-600"
                  size={28}
                />

              </div>

              <div>

                <p className="text-slate-500">
                  Best Seller
                </p>

                <h3 className="text-2xl font-bold text-slate-800">
                  {bestProduct?.product_name}
                </h3>

                <p className="text-orange-700 font-semibold mt-1">
                  {bestProduct?.units_sold} Units Sold
                </p>

              </div>

            </div>

          </div>

          {/* Health */}

          <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-100 p-6 shadow-sm">

            <div className="flex items-center gap-4">

              <div className="rounded-full bg-white p-4 shadow">

                <HeartPulse
                  className="text-indigo-600"
                  size={28}
                />

              </div>

              <div>

                <p className="text-slate-500">
                  Marketplace Health
                </p>

                <h3 className="text-2xl font-bold text-slate-800">
                  {health.status}
                </h3>

                <p className="text-indigo-700 font-semibold mt-1">
                  Score : {health.score}/100
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BusinessInsightsCard;