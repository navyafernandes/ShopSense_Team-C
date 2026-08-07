import {
  FaLightbulb,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

function AIShoppingInsights({ insights }) {

  const getStyle = (level) => {

    switch (level) {

      case "SUCCESS":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          title: "text-green-700",
          icon: (
            <FaCheckCircle
              className="text-green-600"
              size={24}
            />
          ),
        };

      case "WARNING":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          title: "text-amber-700",
          icon: (
            <FaExclamationTriangle
              className="text-amber-600"
              size={24}
            />
          ),
        };

      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          title: "text-blue-700",
          icon: (
            <FaInfoCircle
              className="text-blue-600"
              size={24}
            />
          ),
        };

    }

  };

  return (

    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

          <FaLightbulb
            className="text-indigo-600"
            size={22}
          />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            AI Shopping Insights
          </h2>

          <p className="text-slate-500">
            Personalized insights generated from your shopping behaviour.
          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {insights?.length > 0 ? (

          insights.map((insight, index) => {

            const style = getStyle(
              insight.level
            );

            return (

              <div
                key={index}
                className={`${style.bg} ${style.border} border rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
              >

                <div className="flex gap-4">

                  <div>

                    {style.icon}

                  </div>

                  <div>

                    <h3
                      className={`font-bold text-lg ${style.title}`}
                    >
                      {insight.title}
                    </h3>

                    <p className="text-slate-600 mt-2 leading-7">
                      {insight.description}
                    </p>

                  </div>

                </div>

              </div>

            );

          })

        ) : (

          <div className="col-span-2 rounded-xl bg-slate-50 border border-slate-200 p-8 text-center">

            <FaLightbulb
              className="mx-auto text-slate-400"
              size={40}
            />

            <h3 className="mt-4 text-lg font-semibold text-slate-700">

              No Insights Available

            </h3>

            <p className="text-slate-500 mt-2">

              Continue shopping to receive personalized AI-powered insights.

            </p>

          </div>

        )}

      </div>

    </div>

  );

}

export default AIShoppingInsights;