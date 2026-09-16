import { ShoppingCart, Zap, Star } from "lucide-react";

function ProductCard({ product, onAddToCart, onBuyNow, onViewDetails }) {
  const imageUrl = product.thumbnail_url?.startsWith("http")
    ? product.thumbnail_url
    : `http://localhost:8000${product.thumbnail_url}`;

  const isOutOfStock =
    product.stock_quantity !== undefined && product.stock_quantity <= 0;
  const isSuspended =
    product.product_status && product.product_status !== "ACTIVE";
  const isUnavailable = isOutOfStock || isSuspended;

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

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(product.product_id)}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between border border-slate-100 relative"
    >
      {/* Discount / Status Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {hasDiscount && (
          <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            {discountPercent}% OFF
          </span>
        )}
        {isOutOfStock && (
          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-bold text-white shadow">
            Out of Stock
          </span>
        )}
        {isSuspended && !isOutOfStock && (
          <span className="rounded-full bg-amber-600 px-2.5 py-1 text-xs font-bold text-white shadow">
            {product.product_status}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="h-56 overflow-hidden bg-slate-100 relative">
        <img
          src={imageUrl}
          alt={product.product_name}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isUnavailable ? "opacity-60 grayscale-[40%]" : ""
          }`}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {product.brand || "Generic"}
          </p>

          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-slate-800 leading-snug">
            {product.product_name}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-slate-600">
              {Number(product.rating) > 0
                ? Number(product.rating).toFixed(1)
                : "4.2"}
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">
              ₹{Number(product.discount_price || product.price).toLocaleString("en-IN")}
            </span>

            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isUnavailable && onAddToCart) {
                onAddToCart(product.product_id);
              }
            }}
            disabled={isUnavailable}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-sm font-medium transition ${
              isUnavailable
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-95 border border-indigo-200"
            }`}
            title={isUnavailable ? "Product unavailable" : "Add to Cart"}
          >
            <ShoppingCart size={16} />
            <span className="truncate">Cart</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isUnavailable && onBuyNow) {
                onBuyNow(product.product_id);
              }
            }}
            disabled={isUnavailable}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-sm font-semibold transition shadow-sm ${
              isUnavailable
                ? "bg-slate-300 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-emerald-200"
            }`}
            title={isUnavailable ? "Product unavailable" : "Buy Now"}
          >
            <Zap size={16} className="fill-current" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;