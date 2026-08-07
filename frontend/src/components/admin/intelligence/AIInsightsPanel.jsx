import {
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";

function AIInsightsPanel({ insights }) {

  const getStyle = (level) => {

    switch (level) {

      case "SUCCESS":
        return {
          icon: (
            <CheckCircle2
              className="text-green-600"
              size={24}
            />
          ),
          bg: "bg-green-50",
          border: "border-green-200",
          title: "text-green-700",
        };

      case "WARNING":
        return {
          icon: (
            <AlertTriangle
              className="text-amber-600"
              size={24}
            />
          ),
          bg: "bg-amber-50",
          border: "border-amber-200",
          title: "text-amber-700",
        };

      default:
        return {
          icon: (
            <Info
              className="text-blue-600"
              size={24}
            />
          ),
          bg: "bg-blue-50",
          border: "border-blue-200",
          title: "text-blue-700",
        };

    }

  };

  return (

    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-900">
          AI Marketplace Advisor
        </h2>

        <p className="text-slate-500 mt-1">
          AI-generated insights based on marketplace performance.
        </p>

      </div>

      <div className="space-y-5">

        {insights?.map((item, index) => {

          const style = getStyle(item.level);

          return (

            <div
              key={index}
              className={`rounded-xl border p-5 ${style.bg} ${style.border}`}
            >

              <div className="flex gap-4">

                {style.icon}

                <div>

                  <h3
                    className={`font-bold text-lg ${style.title}`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-slate-600 mt-2 leading-7">
                    {item.description}
                  </p>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default AIInsightsPanel;