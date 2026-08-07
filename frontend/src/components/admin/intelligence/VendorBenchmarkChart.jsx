import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function VendorBenchmarkChart({ vendors }) {

  const data =
    vendors?.slice(0, 6) || [];

  return (

    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">

        Vendor Benchmark

      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart
          data={data}
          layout="vertical"
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            type="number"
          />

          <YAxis
            dataKey="vendor_name"
            type="category"
            width={120}
          />

          <Tooltip
            formatter={(value) =>
              `₹${Number(value).toLocaleString("en-IN")}`
            }
          />

          <Bar
            dataKey="revenue"
            radius={[0, 8, 8, 0]}
            fill="#4F46E5"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default VendorBenchmarkChart;