import {
  FaShoppingBag,
  FaArrowRight,
} from "react-icons/fa";

function ShoppingRecommendations({
  recommendations,
}) {

  return (

    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">

          <FaShoppingBag
            className="text-indigo-600"
            size={22}
          />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Personalized Recommendations
          </h2>

          <p className="text-slate-500">
            Suggestions based on your shopping history and spending patterns.
          </p>

        </div>

      </div>

      {recommendations?.length > 0 ? (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {recommendations.map(
            (recommendation, index) => (

              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >

                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-5">

                  <FaShoppingBag size={20} />

                </div>

                <h3 className="text-lg font-bold text-slate-900">

                  {recommendation.title}

                </h3>

                <p className="text-slate-500 mt-3 leading-7">

                  {recommendation.description}

                </p>

                <button
                  className="mt-6 flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
                >

                  Explore

                  <FaArrowRight size={13} />

                </button>

              </div>

            )
          )}

        </div>

      ) : (

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">

          <FaShoppingBag
            size={42}
            className="mx-auto text-slate-400"
          />

          <h3 className="mt-5 text-xl font-semibold text-slate-700">

            No Recommendations Yet

          </h3>

          <p className="mt-3 text-slate-500">

            Shop a few more products and we'll generate
            personalized recommendations for you.

          </p>

        </div>

      )}

    </div>

  );

}

export default ShoppingRecommendations;