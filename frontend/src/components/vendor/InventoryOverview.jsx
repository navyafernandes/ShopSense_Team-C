import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

import {
  PackageCheck,
  TriangleAlert,
} from "lucide-react";

function InventoryOverview({
  summary,
  forecast,
}) {
  const total =
    summary.total_products || 1;

  const health =
    (
      (summary.healthy / total) *
      100
    ).toFixed(0);

  const radialData = [
    {
      name: "Healthy",
      value: health,
      fill: "#22C55E",
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">

      {/* Stock Health */}

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <div className="flex items-center gap-3 mb-8">

          <PackageCheck
            className="text-green-600"
            size={28}
          />

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Stock Health
            </h2>

            <p className="text-slate-500">
              Overall inventory status
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 items-center">

          <div className="relative h-64">

            <ResponsiveContainer>

              <RadialBarChart
                innerRadius="72%"
                outerRadius="100%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
                barSize={18}
              >

                <PolarAngleAxis
                  type="number"
                  domain={[0,100]}
                  tick={false}
                />

                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={20}
                />

              </RadialBarChart>

            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col justify-center items-center">

              <h1 className="text-5xl font-bold text-green-600">
                {health}%
              </h1>

              <p className="text-slate-500 mt-2">
                Healthy
              </p>

            </div>

          </div>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Healthy
              </span>

              <span className="font-bold text-green-600">
                {summary.healthy}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Low Stock
              </span>

              <span className="font-bold text-amber-500">
                {summary.low_stock}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Critical
              </span>

              <span className="font-bold text-red-500">
                {summary.critical}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Forecast Alerts */}

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <div className="flex items-center gap-3 mb-8">

          <TriangleAlert
            className="text-amber-500"
            size={28}
          />

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Forecast Alerts
            </h2>

            <p className="text-slate-500">
              Products requiring attention
            </p>

          </div>

        </div>

        {forecast.length === 0 ? (

          <div className="h-64 flex items-center justify-center text-slate-400">

            No forecast available.

          </div>

        ) : (

          <div className="space-y-5">

            {forecast
              .filter(item => item.reorder)
              .slice(0,4)
              .map((item,index)=>(

                <div
                  key={index}
                  className="rounded-xl border border-red-100 bg-red-50 p-5"
                >

                  <div className="flex justify-between">

                    <h3 className="font-semibold text-slate-800">
                      {item.product_name}
                    </h3>

                    <span className="text-red-600 font-semibold">
                      Restock
                    </span>

                  </div>

                  <div className="grid grid-cols-3 mt-4 text-center">

                    <div>

                      <p className="text-xs text-slate-500">
                        Current
                      </p>

                      <p className="font-bold">
                        {item.current_stock}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-slate-500">
                        Forecast
                      </p>

                      <p className="font-bold text-amber-600">
                        {item.forecasted_demand}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-slate-500">
                        Recommended
                      </p>

                      <p className="font-bold text-green-600">
                        {item.recommended_stock}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default InventoryOverview;