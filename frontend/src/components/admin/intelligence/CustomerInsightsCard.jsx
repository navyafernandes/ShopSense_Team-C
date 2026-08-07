import { Users } from "lucide-react";

function CustomerInsightsCard({ customer }) {

  return (

    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="flex justify-between">

        <div>

          <p className="text-slate-500">

            Customer Intelligence

          </p>

          <h2 className="text-3xl font-bold text-indigo-600 mt-3">

            {customer?.total_customers}

          </h2>

        </div>

        <Users
          size={42}
          className="text-indigo-500"
        />

      </div>

      <div className="mt-6 space-y-3 text-sm">

        <div className="flex justify-between">

          <span>Returning</span>

          <span className="font-semibold">

            {customer?.returning_customers}

          </span>

        </div>

        <div className="flex justify-between">

          <span>Premium</span>

          <span className="font-semibold">

            {customer?.premium_customers}

          </span>

        </div>

        <div className="flex justify-between">

          <span>Avg Order</span>

          <span className="font-semibold">

            ₹{Number(
              customer?.average_order_value || 0
            ).toLocaleString("en-IN")}

          </span>

        </div>

      </div>

    </div>

  );

}

export default CustomerInsightsCard;