import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
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

function CategoryPieChart({ data }) {

  const formatCurrency = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;

  return (

    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-900">
          Spending by Category
        </h2>

        <p className="text-slate-500 mt-1">
          See where most of your shopping budget goes.
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={360}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={120}
            paddingAngle={3}
            label={({ percent }) =>
              `${(percent * 100).toFixed(0)}%`
            }
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

          </Pie>

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

          <Legend
            verticalAlign="bottom"
            height={36}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}

export default CategoryPieChart;