import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

function BrandBarChart({ data }) {

  const formatCurrency = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

  return (

    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-900">
          Top Brands
        </h2>

        <p className="text-slate-500 mt-1">
          Brands you've spent the most on.
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={360}
      >

        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 10,
            right: 25,
            left: 20,
            bottom: 10,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E2E8F0"
          />

          <XAxis
            type="number"
            tickFormatter={(value) =>
              `₹${(value / 1000).toFixed(0)}k`
            }
            tick={{
              fill: "#64748B",
              fontSize: 12,
            }}
          />

          <YAxis
            type="category"
            dataKey="brand"
            width={90}
            tick={{
              fill: "#334155",
              fontSize: 13,
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

          <Bar
            dataKey="amount"
            radius={[0, 10, 10, 0]}
          >

            {data?.map((entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />

            ))}

          </Bar>

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default BrandBarChart;