import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = {
  Delivered: "#10B981",
  Shipped: "#3B82F6",
  Pending: "#F59E0B",
  Cancelled: "#EF4444",
};

function OrderStatusDonut({ status }) {

  const data = [
    {
      name: "Delivered",
      value: status?.delivered || 0,
    },
    {
      name: "Shipped",
      value: status?.shipped || 0,
    },
    {
      name: "Pending",
      value: status?.pending || 0,
    },
    {
      name: "Cancelled",
      value: status?.cancelled || 0,
    },
  ];

  const totalOrders = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (

    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-900">
          Order Status
        </h2>

        <p className="text-slate-500 mt-1">
          Distribution of your marketplace orders.
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={360}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={3}
            label={({ percent }) =>
              percent > 0
                ? `${(percent * 100).toFixed(0)}%`
                : ""
            }
          >

            {data.map((entry) => (

              <Cell
                key={entry.name}
                fill={COLORS[entry.name]}
              />

            ))}

          </Pie>

          <Tooltip
            formatter={(value) => [
              value,
              "Orders",
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
          />

          {/* Center Text */}

          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-900"
            style={{
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            {totalOrders}
          </text>

          <text
            x="50%"
            y="57%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-500"
            style={{
              fontSize: "13px",
            }}
          >
            Orders
          </text>

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}

export default OrderStatusDonut;