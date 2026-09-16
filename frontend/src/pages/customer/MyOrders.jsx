import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Calendar,
  MapPin,
  Truck,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import api from "../../services/api";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={13} />
            Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Truck size={13} />
            Shipped
          </span>
        );
      case "PAID":
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CreditCard size={13} />
            Paid & Processing
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={13} />
            Pending Payment
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle size={13} />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            {status || "Active"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-base font-semibold text-slate-500 animate-pulse">
          Loading order history...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-12 my-12 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <Package className="mx-auto text-slate-300 mb-4" size={54} />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Orders Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          You have not placed any orders yet. Start shopping our catalog today!
        </p>
        <button
          onClick={() => navigate("/customer/products")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow"
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Order History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your marketplace purchases ({orders.length} total orders)
          </p>
        </div>

        <button
          onClick={() => navigate("/customer/products")}
          className="flex items-center gap-2 self-start sm:self-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl text-sm font-semibold transition"
        >
          <ShoppingBag size={16} />
          Shop More Products
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition duration-200"
          >
            {/* Card Top Banner */}
            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 text-indigo-600">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Order #{order.order_id}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Calendar size={13} />
                    {new Date(order.order_date).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(order.order_status)}
                {order.payment_status && order.payment_status !== order.order_status && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Payment: {order.payment_status}
                  </span>
                )}
              </div>
            </div>

            {/* Items Container */}
            <div className="p-6 divide-y divide-slate-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => {
                  const itemImg = item.thumbnail_url?.startsWith("http")
                    ? item.thumbnail_url
                    : item.thumbnail_url
                    ? `http://localhost:8000${item.thumbnail_url}`
                    : "https://via.placeholder.com/150?text=Item";

                  return (
                    <div
                      key={`item-${order.order_id}-${idx}`}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={itemImg}
                          alt={item.product_name}
                          className="h-14 w-14 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=Item";
                          }}
                        />
                        <div>
                          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                            {item.brand || item.vendor_name || "Merchant Item"}
                          </p>
                          <p className="font-semibold text-slate-800 text-sm line-clamp-1">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-bold text-slate-900 text-sm">
                          ₹{Number(item.quantity * item.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-2 text-xs text-slate-400">
                  Total items processed in this order
                </div>
              )}
            </div>

            {/* Bottom Footer Details */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
              <div className="md:col-span-5 flex items-start gap-2 text-slate-600">
                <MapPin size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-700">Delivery Address:</span>
                  <p className="text-slate-500 line-clamp-1">{order.shipping_address}</p>
                </div>
              </div>

              <div className="md:col-span-4 flex items-center gap-2 text-slate-600">
                <Truck size={15} className="text-slate-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-700">Tracking:</span>{" "}
                  <span className="font-mono text-slate-600">
                    {order.tracking_number || "STANDARD-SHP-" + order.order_id}
                  </span>
                </div>
              </div>

              <div className="md:col-span-3 text-right">
                <span className="text-slate-500 mr-2">Order Total:</span>
                <span className="text-lg font-extrabold text-emerald-600">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;