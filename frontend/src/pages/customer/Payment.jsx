import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const { orderId, totalAmount } = location.state || {};

  const paymentMethods = [
    { label: "UPI", value: "UPI" },
    { label: "Credit Card", value: "CARD" },
    { label: "Debit Card", value: "CARD" },
    { label: "Net Banking", value: "NET_BANKING" },
    { label: "Cash on Delivery", value: "COD" },
  ];

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  if (!orderId) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">
          Invalid Payment Request
        </h2>

        <button
          onClick={() => navigate("/customer/products")}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      setLoading(true);

      await api.post("/payments", {
        order_id: orderId,
        payment_method: paymentMethod,
      });

      alert("Payment Successful!");

      navigate("/customer/orders");
    } catch (error) {
      console.error(error);
      alert("Payment Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">
          Payment
        </h1>

        <div className="space-y-5">
          <div>
            <p className="text-slate-500">
              Order ID
            </p>

            <h2 className="text-xl font-semibold">
              #{orderId}
            </h2>
          </div>

          <div>
            <p className="text-slate-500">
              Total Amount
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              ₹{Number(totalAmount).toLocaleString("en-IN")}
            </h2>
          </div>

          <div>
            <p className="font-semibold mb-3">
              Select Payment Method
            </p>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.label}
                  className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  {method.label}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold mt-8 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;