import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ArrowUpDown, CheckCircle, ShoppingBag, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";
import ProductModal from "../../components/products/ProductModal";

import { getRecommendations } from "../../services/recommendationService";

function CustomerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT");
  const [search, setSearch] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchRecommendations();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendations();
      setRecommendations(response.recommended_products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        product.product_name.toLowerCase().includes(search.toLowerCase()) ||
        (product.brand || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" ||
        product.category_id === Number(selectedCategory);

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "PRICE_LOW") {
      result = [...result].sort(
        (a, b) =>
          Number(a.discount_price || a.price) -
          Number(b.discount_price || b.price)
      );
    } else if (sortBy === "PRICE_HIGH") {
      result = [...result].sort(
        (a, b) =>
          Number(b.discount_price || b.price) -
          Number(a.discount_price || a.price)
      );
    } else if (sortBy === "RATING") {
      result = [...result].sort(
        (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  const handleViewDetails = (productId) => {
    const found =
      products.find((p) => p.product_id === productId) ||
      recommendations.find((p) => p.product_id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await api.post("/cart/items", {
        product_id: productId,
        quantity: quantity,
      });

      showToast(`Added ${quantity > 1 ? `${quantity} items` : "product"} to your cart!`);
    } catch (error) {
      console.error(error);
      alert("Unable to add product to cart. Please check available stock.");
    }
  };

  const handleBuyNow = async (productId, quantity = 1) => {
    try {
      // 1. Add product to cart
      await api.post("/cart/items", {
        product_id: productId,
        quantity: quantity,
      });

      // 2. Direct checkout navigation
      if (selectedProduct) {
        setSelectedProduct(null);
      }
      navigate("/customer/checkout");
    } catch (error) {
      console.error(error);
      alert("Unable to proceed with Buy Now. Please check stock availability.");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl animate-in slide-in-from-bottom-5 border border-slate-700">
          <CheckCircle className="text-emerald-400" size={20} />
          <span className="font-medium text-sm">{toastMessage}</span>
          <button
            onClick={() => navigate("/customer/cart")}
            className="ml-3 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-500"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Marketplace
          </h1>
          <p className="mt-1 text-slate-500">
            Discover premium products from verified multi-vendor merchants.
          </p>
        </div>

        <button
          onClick={() => navigate("/customer/cart")}
          className="flex items-center gap-2 self-start md:self-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
        >
          <ShoppingBag size={18} />
          My Cart
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative md:col-span-6">
          <Search
            className="absolute left-3.5 top-3 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by product name, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="relative md:col-span-3">
          <div className="absolute left-3 top-3 pointer-events-none text-slate-400">
            <Filter size={16} />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-8 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="relative md:col-span-3">
          <div className="absolute left-3 top-3 pointer-events-none text-slate-400">
            <ArrowUpDown size={16} />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-8 text-sm font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          >
            <option value="DEFAULT">Sort By: Featured</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="RATING">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* ================= AI Recommendations ================= */}
      <div className="mb-12 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="text-indigo-600" size={24} />
          <h2 className="text-2xl font-bold text-slate-900">
            {recommendations.length > 0 &&
            recommendations[0].reason === "Popular among customers"
              ? "Trending & Popular Picks"
              : "Recommended For You"}
          </h2>
        </div>

        <p className="mb-6 text-sm text-slate-600">
          Personalized recommendations tailored to your browsing preferences and marketplace trends.
        </p>

        {loadingRecommendations ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            Fetching personalized recommendations...
          </div>
        ) : recommendations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/70 p-6 text-center text-sm text-slate-500">
            Browse more items to receive tailored AI recommendations!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendations.map((product) => (
              <div key={`rec-${product.product_id}`} className="flex flex-col">
                <ProductCard
                  product={product}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
                <div className="mt-2.5 rounded-xl border border-indigo-100 bg-white/90 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span className="truncate">{product.reason}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Browse All Products */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            All Products
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Showing {filteredProducts.length} items
          </p>
        </div>
      </div>

      {loadingProducts ? (
        <div className="py-20 text-center text-slate-500">
          Loading catalog products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-16 text-center bg-white">
          <ShoppingBag className="mx-auto text-slate-300 mb-3" size={48} />
          <h3 className="text-lg font-bold text-slate-700">No products match your criteria</h3>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or category filter.</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("ALL");
            }}
            className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
  );
}

export default CustomerProducts;