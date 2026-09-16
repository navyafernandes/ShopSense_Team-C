import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ShoppingBag, ShieldCheck, ArrowRight, Truck, AlertCircle } from "lucide-react";
import api from "../../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    items: [],
    total_amount: 0,
  });

  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const [cartRes, profileRes] = await Promise.allSettled([
        api.get("/cart"),
        api.get("/customers/profile"),
      ]);

      if (cartRes.status === "fulfilled") {
        setCart(cartRes.value.data);
      }

      if (profileRes.status === "fulfilled" && profileRes.value.data) {
        const prof = profileRes.value.data;
        const addressParts = [
          prof.address,
          prof.city,
          prof.state,
          prof.postal_code,
          prof.country,
        ].filter(Boolean);

        if (addressParts.length > 0) {
          setShippingAddress(addressParts.join(", "));
        }
      }
    } catch (error) {
      console.error("Error loading checkout data:", error);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setErrorMessage("");
    if (!shippingAddress.trim()) {
      setErrorMessage("Please enter a valid delivery address to proceed.");
      return;
    }

    if (cart.items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before placing an order.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await api.post("/orders", {
        shipping_address: shippingAddress.trim(),
      });

      const orderId = response.data.order.order_id;
      const totalAmount = response.data.order.total_amount;

      navigate("/customer/payment", {
        state: {
          orderId,
          totalAmount,
        },
      });
    } catch (error) {
      console.error("Failed to place order:", error);
      const detail = error.response?.data?.detail;
      setErrorMessage(
        typeof detail === "string"
          ? detail
          : "Unable to place order. Please check inventory stock and try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-base font-semibold text-slate-500 animate-pulse">
          Preparing checkout experience...
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-12 my-12 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          There are no items currently in your cart ready for checkout.
        </p>
        <button
          onClick={() => navigate("/customer/products")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow"
        >
          Explore Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review your items, confirm delivery address, and proceed to payment.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping Address & Guarantee (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Delivery Address
              </h2>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Items will be securely shipped to this address.
            </p>

            <textarea
              rows="5"
              placeholder="Enter your complete street address, city, state, postal code and country..."
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50 focus:bg-white transition"
            />

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <MapPin size={14} className="text-slate-400" />
              <span>Pre-filled from your profile information. You can edit this anytime.</span>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 text-xs text-slate-600">
            <ShieldCheck size={28} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-slate-800">
                ShopSense Buyer Protection Guarantee
              </p>
              <p className="text-slate-500 mt-0.5">
                All transactions are encrypted and verified against merchant inventory in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 sticky top-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                Order Summary
              </h2>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {cart.items.length} {cart.items.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex justify-between items-center py-2 text-sm border-b border-slate-50"
                >
                  <div className="flex-1 pr-3">
                    <p className="font-semibold text-slate-800 line-clamp-1">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Qty: {item.quantity} × ₹{Number(item.subtotal / item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="font-bold text-slate-900 shrink-0">
                    ₹{Number(item.subtotal).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span>₹{Number(cart.total_amount).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-emerald-500" />
                  Express Delivery
                </span>
                <span className="text-emerald-600 font-semibold uppercase text-xs">
                  FREE
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">
                Total Payable
              </span>
              <span className="text-2xl font-extrabold text-emerald-600">
                ₹{Number(cart.total_amount).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={placingOrder}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-4 rounded-2xl font-bold text-base transition shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {placingOrder ? (
                "Processing Order..."
              ) : (
                <>
                  Proceed to Payment
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;