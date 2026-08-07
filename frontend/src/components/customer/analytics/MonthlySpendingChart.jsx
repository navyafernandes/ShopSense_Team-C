import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function MonthlySpendingChart({ data }) {

  const formatCurrency = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

  return (

    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-900">
          Monthly Spending
        </h2>

        <p className="text-slate-500 mt-1">
          Track how your spending has changed throughout the year.
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={360}
      >

        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 25,
            left: 0,
            bottom: 10,
          }}
        >

          <defs>

            <linearGradient
              id="spendingGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#4F46E5"
                stopOpacity={0.55}
              />

              <stop
                offset="100%"
                stopColor="#4F46E5"
                stopOpacity={0.05}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E2E8F0"
          />

          <XAxis
            dataKey="month"
            tick={{
              fill: "#64748B",
              fontSize: 12,
            }}
          />

          <YAxis
            tickFormatter={(value) =>
              `₹${(value / 1000).toFixed(0)}k`
            }
            tick={{
              fill: "#64748B",
              fontSize: 12,
            }}
          />

          <Tooltip
            formatter={(value) => [
              formatCurrency(value),
              "Spent",
            ]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #CBD5E1",
              boxShadow:
                "0 8px 20px rgba(0,0,0,0.08)",
            }}
          />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#4F46E5"
            strokeWidth={3}
            fill="url(#spendingGradient)"
            activeDot={{
              r: 6,
            }}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  );

}

export default MonthlySpendingChart;