import { Lightbulb } from "lucide-react";

function AIRecommendations({ recommendations = [] }) {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <div className="flex items-center gap-3 mb-8">

        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
          <Lightbulb
            className="text-yellow-600"
            size={24}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            AI Recommendations
          </h2>

          <p className="text-slate-500">
            Personalized suggestions generated from your business performance.
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {recommendations.map((item, index) => (

          <div
            key={index}
            className="rounded-xl border border-yellow-100 bg-yellow-50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >

            <div className="flex items-center gap-3 mb-4">

              <div className="h-10 w-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <h3 className="font-semibold text-slate-800">
                Recommendation
              </h3>

            </div>

            <p className="leading-7 text-slate-600">
              {item}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AIRecommendations;