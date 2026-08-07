import { Activity } from "lucide-react";

function MarketplaceHealthCard({ health }) {

  const score = health?.score ?? 0;

  const status = health?.status ?? "Unknown";

  const color =
    score >= 85
      ? "text-green-600"
      : score >= 70
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-500">
            Marketplace Health
          </p>

          <h2 className={`text-4xl font-bold mt-3 ${color}`}>
            {score}%
          </h2>

          <p className="mt-2 text-slate-600">
            {status}
          </p>

        </div>

        <Activity
          size={42}
          className={color}
        />

      </div>

      <div className="mt-6">

        <div className="h-3 bg-slate-200 rounded-full">

          <div
            className="h-3 rounded-full bg-indigo-600"
            style={{
              width: `${score}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default MarketplaceHealthCard;