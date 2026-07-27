import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";

import { getRecommendations } from "../../services/recommendationService";

function CustomerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchRecommendations();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendations();
      setRecommendations(response.recommended_products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.product_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (product.brand || "")
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleViewDetails = (productId) => {
    navigate(`/customer/products/${productId}`);
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post("/cart/items", {
        product_id: productId,
        quantity: 1,
      });

      alert("Product added to cart!");
    } catch (error) {
      console.error(error);
      alert("Unable to add product.");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Explore Products
        </h1>

        <p className="mt-2 text-slate-500">
          Discover products from trusted vendors.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search
          className="absolute left-3 top-3 text-slate-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search by name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* ================= Recommendations ================= */}

      <div className="mb-14 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-900">
          {recommendations.length > 0 &&
          recommendations[0].reason === "Popular among customers"
            ? "🔥 Popular Products"
            : "✨ Recommended For You"}
        </h2>

        <p className="mb-6 mt-2 text-slate-600">
          Handpicked products based on your shopping preferences and marketplace
          trends.
        </p>

        {loadingRecommendations ? (
          <p className="text-slate-500">
            Loading recommendations...
          </p>
        ) : recommendations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">
            No personalized recommendations yet.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommendations.map((product) => (
              <div key={product.product_id}>
                <ProductCard
                  product={product}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleAddToCart}
                />

                <div className="mt-3 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm">
                  ⭐ {product.reason}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}

      <div className="mb-10">
        <hr className="border-slate-300" />
      </div>

      {/* Browse Products */}

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">
          🛍️ Browse All Products
        </h2>

        <p className="mt-2 text-slate-600">
          Explore our complete collection from trusted vendors.
        </p>
      </div>

      {/* Products */}

      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          No products found.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerProducts;