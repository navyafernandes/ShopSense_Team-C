import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
  "#EC4899",
];

function CategoryRevenueChart({
  categories,
}) {

  const data =
    categories || [];

  return (

    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">

        Revenue by Category

      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="revenue"
            nameKey="category"
            outerRadius={110}
            innerRadius={60}
            label
          >

            {data.map((entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[
                    index %
                      COLORS.length
                  ]
                }
              />

            ))}

          </Pie>

          <Tooltip
            formatter={(value) =>
              `₹${Number(value).toLocaleString("en-IN")}`
            }
          />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}

export default CategoryRevenueChart;