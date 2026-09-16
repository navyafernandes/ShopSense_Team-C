import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShoppingCart,
  Zap,
  Star,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import api from "../../../services/api";
import { useState } from "react";

function ShoppingRecommendations({
  recommendedProducts = [],
  recommendations = [],
}) {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [addingId, setAddingId] = useState(null);

  // Combine or prioritize real recommended products
  const products = recommendedProducts || [];

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    try {
      setAddingId(product.product_id);
      await api.post("/cart/items", {
        product_id: product.product_id,
        quantity: 1,
      });
      setFeedback(`Added "${product.product_name}" to your Cart!`);
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setFeedback("Unable to add to cart.");
      setTimeout(() => setFeedback(""), 3000);
    } finally {
      setAddingId(null);
    }
  };

  const handleBuyNow = async (e, product) => {
    e.stopPropagation();
    try {
      setAddingId(product.product_id);
      await api.post("/cart/items", {
        product_id: product.product_id,
        quantity: 1,
      });
      navigate("/customer/checkout");
    } catch (err) {
      console.error("Buy now failed:", err);
      setFeedback("Unable to proceed to checkout.");
      setTimeout(() => setFeedback(""), 3000);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5">
          <Sparkles className="text-amber-400" size={18} />
          <span className="text-sm font-medium">{feedback}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Personalized Product Recommendations
            </h2>
            <p className="text-sm text-slate-500">
              Curated based on your purchase history, preference affinity, and marketplace trends.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/customer/products")}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 self-start sm:self-auto transition"
        >
          Explore Full Catalog
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Real Product Cards */}
      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
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

            const imageUrl = product.thumbnail_url?.startsWith("http")
              ? product.thumbnail_url
              : `http://localhost:8000${product.thumbnail_url}`;

            return (
              <div
                key={product.product_id}
                onClick={() => navigate("/customer/products")}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                {/* Top badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  {hasDiscount && (
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Product Image */}
                <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={imageUrl}
                    alt={product.product_name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x400?text=ShopSense";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold uppercase tracking-wider text-indigo-600 truncate max-w-[120px]">
                        {product.brand || product.category_name}
                      </span>
                      {product.rating && (
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star size={12} className="fill-amber-400" />
                          {Number(product.rating).toFixed(1)}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 line-clamp-2 text-sm leading-snug group-hover:text-indigo-600 transition">
                      {product.product_name}
                    </h3>
                  </div>

                  {/* Recommendation Reason */}
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 flex items-center gap-1">
                    <Sparkles size={11} className="shrink-0" />
                    <span className="truncate">{product.reason || "Recommended for you"}</span>
                  </div>

                  {/* Pricing */}
                  <div className="pt-1 border-t border-slate-100 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-slate-900">
                        ₹
                        {Number(
                          product.discount_price || product.price
                        ).toLocaleString("en-IN")}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addingId === product.product_id}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
                    >
                      <ShoppingCart size={13} />
                      {addingId === product.product_id ? "Adding..." : "Add"}
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e, product)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                      <Zap size={13} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : recommendations?.length > 0 ? (
        /* Fallback tips */
        <div className="grid md:grid-cols-3 gap-6">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm">
                <ShoppingBag size={18} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{rec.title}</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">{rec.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <ShoppingBag size={40} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Recommendations Yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Place an order to receive personalized AI recommendations tailored to your preferences.
          </p>
        </div>
      )}
    </div>
  );
}

export default ShoppingRecommendations;