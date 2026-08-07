import {
  Trophy,
  Medal,
  TrendingUp,
  IndianRupee,
  BarChart3,
  Award,
} from "lucide-react";

import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

function BenchmarkCard({ benchmark }) {
  if (!benchmark) return null;

  const radialData = [
    {
      value: benchmark.percentile,
      fill: "#6366F1",
    },
  ];

  const revenueData = [
    {
      name: "Your Revenue",
      revenue: benchmark.vendor_revenue,
      fill: "#10B981",
    },
    {
      name: "Market Avg",
      revenue: benchmark.market_average_revenue,
      fill: "#3B82F6",
    },
  ];

  const difference =
    benchmark.vendor_revenue -
    benchmark.market_average_revenue;

  const percentAbove = (
    (difference / benchmark.market_average_revenue) *
    100
  ).toFixed(1);

  const badgeColor =
    benchmark.status === "Top Performer"
      ? "bg-emerald-100 text-emerald-700"
      : benchmark.status === "Above Average"
      ? "bg-blue-100 text-blue-700"
      : benchmark.status === "Average"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-amber-50 via-white to-indigo-50 p-8 border-b">

        <div className="flex items-center gap-5">

          <div className="h-16 w-16 rounded-2xl bg-amber-100 flex items-center justify-center shadow">

            <Trophy
              className="text-amber-600"
              size={32}
            />

          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-800">
              Marketplace Benchmark
            </h2>

            <p className="text-slate-500 mt-1">
              Compare your performance with other marketplace vendors.
            </p>

          </div>

        </div>

      </div>

      <div className="p-8">

        {/* Top Section */}

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Gauge */}

          <div className="flex justify-center">

            <div className="relative h-72 w-72">

              <ResponsiveContainer>

                <RadialBarChart
                  data={radialData}
                  innerRadius="72%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  barSize={18}
                >

                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />

                  <RadialBar
                    background
                    cornerRadius={20}
                    dataKey="value"
                  />

                </RadialBarChart>

              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col justify-center items-center">

                <p className="text-5xl font-bold text-indigo-600">
                  {benchmark.percentile}%
                </p>

                <p className="text-slate-500 mt-2">
                  Percentile
                </p>

                <p className="text-sm text-slate-400 mt-3">
                  Top {(100 - benchmark.percentile).toFixed(2)}% Sellers
                </p>

              </div>

            </div>

          </div>

          {/* KPI Cards */}

          <div className="grid gap-5">

            <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 p-5 flex justify-between items-center">

              <div>

                <p className="text-slate-500">
                  Vendor Rank
                </p>

                <h3 className="text-3xl font-bold text-indigo-700 mt-2">
                  #{benchmark.vendor_rank}
                </h3>

              </div>

              <Award
                size={38}
                className="text-indigo-500"
              />

            </div>

            <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-100 p-5 flex justify-between items-center">

              <div>

                <p className="text-slate-500">
                  Your Revenue
                </p>

                <h3 className="text-2xl font-bold text-emerald-700 mt-2">

                  ₹
                  {Number(
                    benchmark.vendor_revenue
                  ).toLocaleString("en-IN")}

                </h3>

              </div>

              <IndianRupee
                size={34}
                className="text-emerald-600"
              />

            </div>

            <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-blue-100 p-5 flex justify-between items-center">

              <div>

                <p className="text-slate-500">
                  Market Average
                </p>

                <h3 className="text-2xl font-bold text-blue-700 mt-2">

                  ₹
                  {Number(
                    benchmark.market_average_revenue
                  ).toLocaleString("en-IN")}

                </h3>

              </div>

              <BarChart3
                size={34}
                className="text-blue-600"
              />

            </div>

            <div className="flex justify-between items-center rounded-2xl border p-5">

              <span className="font-medium text-slate-600">
                Overall Performance
              </span>

              <span
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${badgeColor}`}
              >

                <Medal size={18} />

                {benchmark.status}

              </span>

            </div>

          </div>

        </div>

        {/* Revenue Comparison */}

        <div className="mt-14">

          <h3 className="text-xl font-bold text-slate-800 mb-6">
            Revenue Comparison
          </h3>

          <div className="h-80">

            <ResponsiveContainer>

              <BarChart data={revenueData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

                <Bar
                  dataKey="revenue"
                  radius={[10, 10, 0, 0]}
                >

                  {revenueData.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={entry.fill}
                    />

                  ))}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Insight */}

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 border border-indigo-100 p-6">

          <div className="flex gap-4">

            <div className="rounded-full bg-indigo-100 p-3 h-fit">

              <TrendingUp
                className="text-indigo-600"
                size={24}
              />

            </div>

            <div>

              <h4 className="font-bold text-xl text-slate-800">
                Performance Insight
              </h4>

              <p className="mt-3 text-slate-600 leading-8">

                You are ranked
                <strong>
                  {" "}#{benchmark.vendor_rank}
                </strong>

                {" "}out of

                <strong>
                  {" "}{benchmark.total_vendors}
                </strong>

                {" "}vendors.

                {difference > 0 ? (
                  <>
                    {" "}Your revenue is

                    <strong>
                      {" "}{percentAbove}%
                    </strong>

                    {" "}higher than the marketplace average, placing you among the

                    <strong>
                      {" "}top {(100 - benchmark.percentile).toFixed(2)}%
                    </strong>

                    {" "}of sellers.
                  </>
                ) : (
                  <>
                    {" "}Your revenue is currently below the marketplace average.
                    Increasing conversions and expanding your product catalog
                    can improve your ranking.
                  </>
                )}

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BenchmarkCard;