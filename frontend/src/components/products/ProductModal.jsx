import { useState } from "react";
import StatusBadge from "../common/StatusBadge";
import { ShoppingCart, Zap, Star, ShieldAlert, Package, CheckCircle2 } from "lucide-react";

function ProductModal({ product, onClose, onAddToCart, onBuyNow, isAdmin = false, onStatusChange }) {
  const [quantity, setQuantity] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(product?.product_status || "ACTIVE");

  if (!product) return null;

  const hasDiscount =
    product.discount_price &&
    Number(product.discount_price) < Number(product.price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.discount_price)) /
          Number(product.price)) *
          100
      )
    : 0;

  const isOutOfStock =
    product.stock_quantity !== undefined && product.stock_quantity <= 0;
  const isSuspended = currentStatus && currentStatus !== "ACTIVE";
  const isUnavailable = isOutOfStock || isSuspended;

  const imageUrl = product.thumbnail_url?.startsWith("http")
    ? product.thumbnail_url
    : product.thumbnail_url
    ? `http://localhost:8000${product.thumbnail_url}`
    : "https://via.placeholder.com/600x600?text=No+Image";

  const handleAdminStatusUpdate = async (newStatus) => {
    if (!onStatusChange) return;
    try {
      setUpdatingStatus(true);
      await onStatusChange(product.product_id, newStatus);
      setCurrentStatus(newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              {product.brand || "Brand Item"}
            </span>
            {isAdmin && (
              <span className="text-xs font-semibold text-slate-500">
                • Product #{product.product_id}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center font-bold text-lg transition"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Image & Stock */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden bg-slate-100 h-72 border border-slate-200 relative flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={product.product_name}
                  className={`w-full h-full object-cover ${
                    isUnavailable ? "opacity-60 grayscale-[30%]" : ""
                  }`}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x600?text=No+Image";
                  }}
                />

                {hasDiscount && (
                  <span className="absolute top-3 left-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Stock Status Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-slate-500" />
                  <span className="text-slate-600">Stock Availability:</span>
                </div>
                <span
                  className={`font-semibold ${
                    isOutOfStock
                      ? "text-rose-600"
                      : (product.stock_quantity || 10) < 10
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : `${product.stock_quantity ?? "In Stock"} units`}
                </span>
              </div>
            </div>

            {/* Right: Details & Actions */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                  {product.product_name}
                </h3>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      {Number(product.rating) > 0
                        ? Number(product.rating).toFixed(1)
                        : "4.5"}
                    </span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <StatusBadge status={currentStatus} />
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ₹{Number(product.discount_price || product.price).toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-slate-400 line-through font-medium">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* Vendor & Specs */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-500">Vendor:</span>
                    <p className="font-semibold text-slate-800 truncate">
                      {product.vendor_name || "Official Vendor"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Category:</span>
                    <p className="font-semibold text-slate-800 truncate">
                      {product.category_name || "General"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">SKU:</span>
                    <p className="font-mono font-medium text-slate-700">
                      {product.sku || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    About Product
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed max-h-24 overflow-y-auto">
                    {product.description || "High quality product from verified marketplace vendors."}
                  </p>
                </div>
              </div>

              {/* Admin Moderation Controls */}
              {isAdmin && onStatusChange && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2 text-amber-900 font-semibold text-sm">
                    <ShieldAlert size={16} />
                    Marketplace Moderation
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["ACTIVE", "OUT_OF_STOCK", "DISCONTINUED"].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleAdminStatusUpdate(st)}
                        disabled={updatingStatus || currentStatus === st}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 ${
                          currentStatus === st
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
                        }`}
                      >
                        {currentStatus === st && <CheckCircle2 size={12} />}
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Actions: Quantity, Cart, Buy Now */}
              {!isAdmin && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Select Quantity:
                    </span>
                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isUnavailable || quantity <= 1}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-semibold text-slate-800 text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={isUnavailable}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        if (!isUnavailable && onAddToCart) {
                          onAddToCart(product.product_id, quantity);
                        }
                      }}
                      disabled={isUnavailable}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition ${
                        isUnavailable
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 active:scale-95"
                      }`}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => {
                        if (!isUnavailable && onBuyNow) {
                          onBuyNow(product.product_id, quantity);
                        }
                      }}
                      disabled={isUnavailable}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition shadow-md ${
                        isUnavailable
                          ? "bg-slate-300 text-slate-400 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-emerald-200"
                      }`}
                    >
                      <Zap size={18} className="fill-current" />
                      Buy Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;