import { TrendingUp } from "lucide-react";

function RevenueForecastCard({ forecast }) {

  const format = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (

    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="flex justify-between">

        <div>

          <p className="text-slate-500">
            Revenue Forecast
          </p>

          <h2 className="text-2xl font-bold mt-3 text-indigo-600">

            {format(
              forecast?.predicted_revenue
            )}

          </h2>

          <p className="mt-3 text-green-600 font-semibold">

            ↑ {forecast?.growth_percentage}% Expected Growth

          </p>

        </div>

        <TrendingUp
          size={42}
          className="text-green-500"
        />

      </div>

    </div>

  );

}

export default RevenueForecastCard;