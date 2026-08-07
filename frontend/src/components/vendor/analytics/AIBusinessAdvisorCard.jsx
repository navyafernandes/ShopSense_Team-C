import {
  Bot,
  Lightbulb,
  TriangleAlert,
  Loader2,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

function AIBusinessAdvisorCard({ ai, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10">
        <div className="flex items-center gap-3 mb-8">
          <Bot className="text-violet-600" size={30} />
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              AI Business Advisor
            </h2>
            <p className="text-slate-500">
              Generating personalized business insights...
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16">
          <Loader2
            size={55}
            className="animate-spin text-violet-600"
          />

          <p className="mt-6 text-xl font-semibold text-slate-700">
            AI is analyzing your business
          </p>

          <p className="mt-3 max-w-xl text-center text-slate-500 leading-7">
            Comparing your revenue, benchmark position,
            marketplace performance and product trends to
            generate personalized strategic recommendations.
          </p>
        </div>
      </div>
    );
  }

  if (!ai) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      {/* Header */}

      <div className="flex items-center justify-between border-b pb-6">

        <div className="flex items-center gap-4">

          <div className="h-14 w-14 rounded-2xl bg-violet-100 flex items-center justify-center">
            <Sparkles
              className="text-violet-600"
              size={28}
            />
          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-800">
              AI Business Advisor
            </h2>

            <p className="text-slate-500 mt-1">
              Strategic recommendations powered by AI
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">

          <CheckCircle2
            size={18}
            className="text-green-600"
          />

          <span className="font-medium text-green-700">
            Live Analysis
          </span>

        </div>

      </div>

      {/* Executive Summary */}

      <div className="mt-8">

        <div className="flex items-center gap-3 mb-4">

          <Bot
            size={22}
            className="text-violet-600"
          />

          <h3 className="text-2xl font-semibold">
            Executive Summary
          </h3>

        </div>

        <div className="bg-white border-l-4 border-violet-600 rounded-xl shadow-sm p-6">

          <p className="leading-8 text-slate-700">
            {ai.summary}
          </p>

        </div>

      </div>

      {/* Recommendations */}

      <div className="mt-10">

        <div className="flex items-center gap-3 mb-5">

          <Lightbulb
            size={22}
            className="text-amber-500"
          />

          <h3 className="text-2xl font-semibold">
            Strategic Recommendations
          </h3>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {ai.recommendations?.map(
            (item, index) => (

              <div
                key={index}
                className="rounded-xl border border-slate-200 p-6 hover:shadow-lg transition"
              >

                <div className="flex items-center justify-between">

                  <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">

                    <TrendingUp
                      size={20}
                      className="text-violet-600"
                    />

                  </div>

                  <span
                    className={`text-xs font-semibold rounded-full px-3 py-1 ${
                      index === 0
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {index === 0
                      ? "HIGH IMPACT"
                      : "MEDIUM"}
                  </span>

                </div>

                <p className="mt-6 leading-7 text-slate-700">
                  {item}
                </p>

              </div>

            )
          )}

        </div>

      </div>

      {/* Risks */}

      <div className="mt-10">

        <div className="flex items-center gap-3 mb-5">

          <ShieldAlert
            size={22}
            className="text-red-500"
          />

          <h3 className="text-2xl font-semibold">
            Business Risks
          </h3>

        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <div className="space-y-4">

            {ai.risks?.map((risk, index) => (

              <div
                key={index}
                className="flex items-start gap-3"
              >

                <TriangleAlert
                  size={18}
                  className="text-red-500 mt-1"
                />

                <p className="leading-7 text-slate-700">
                  {risk}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIBusinessAdvisorCard;