import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Layers,
  LayoutGrid,
  List,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Package,
  Star,
  Eye,
} from "lucide-react";
import api from "../../services/api";

import ProductCard from "../../components/products/ProductCard";
import ProductModal from "../../components/products/ProductModal";
import StatusBadge from "../../components/common/StatusBadge";

function ProductCatalogue() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedStock, setSelectedStock] = useState("ALL");
  const [viewMode, setViewMode] = useState("TABLE"); // 'TABLE' | 'GRID'
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionFeedback, setActionFeedback] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/catalogue");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await api.put(`/products/${productId}/status`, {
        product_status: newStatus,
      });

      // Update state locally
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === productId ? { ...p, product_status: newStatus } : p
        )
      );

      setActionFeedback(`Product #${productId} status updated to ${newStatus}`);
      setTimeout(() => setActionFeedback(""), 3500);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Unable to update product status.");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const term = search.toLowerCase();
      const matchesSearch =
        product.product_name.toLowerCase().includes(term) ||
        (product.brand || "").toLowerCase().includes(term) ||
        (product.vendor_name || "").toLowerCase().includes(term) ||
        (product.sku || "").toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "ALL" ||
        product.category_name === selectedCategory;

      const matchesStatus =
        selectedStatus === "ALL" ||
        product.product_status === selectedStatus;

      let matchesStock = true;
      const stock = product.stock_quantity ?? 0;
      if (selectedStock === "IN_STOCK") matchesStock = stock > 10;
      else if (selectedStock === "LOW_STOCK") matchesStock = stock > 0 && stock <= 10;
      else if (selectedStock === "OUT_OF_STOCK") matchesStock = stock === 0;

      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });
  }, [products, search, selectedCategory, selectedStatus, selectedStock]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="text-emerald-400" size={18} />
          <span className="text-sm font-medium">{actionFeedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Marketplace Product Governance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, moderate, and monitor vendor merchandise across categories.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto border border-slate-200">
          <button
            onClick={() => setViewMode("TABLE")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              viewMode === "TABLE"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List size={16} />
            Table View
          </button>
          <button
            onClick={() => setViewMode("GRID")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              viewMode === "GRID"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid size={16} />
            Card Grid
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative lg:col-span-4">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search product, vendor, brand, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Category */}
        <div className="relative lg:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_name}>
                {c.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative lg:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active (Live)</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="DISCONTINUED">Discontinued</option>
          </select>
        </div>

        {/* Stock Filter */}
        <div className="relative lg:col-span-2">
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          >
            <option value="ALL">All Stock</option>
            <option value="IN_STOCK">In Stock (&gt;10)</option>
            <option value="LOW_STOCK">Low Stock (≤10)</option>
            <option value="OUT_OF_STOCK">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Result Count / Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredProducts.length}</strong> of {products.length} catalog items
        </span>
        {(search || selectedCategory !== "ALL" || selectedStatus !== "ALL" || selectedStock !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("ALL");
              setSelectedStatus("ALL");
              setSelectedStock("ALL");
            }}
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Reset Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          Loading catalog products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center">
          <Package className="mx-auto text-slate-300 mb-3" size={48} />
          <h3 className="text-base font-bold text-slate-800">No products match the selected filters</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting filters to view all products.</p>
        </div>
      ) : viewMode === "TABLE" ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-center">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const img = p.thumbnail_url?.startsWith("http")
                    ? p.thumbnail_url
                    : p.thumbnail_url
                    ? `http://localhost:8000${p.thumbnail_url}`
                    : "https://via.placeholder.com/80?text=Item";

                  return (
                    <tr
                      key={p.product_id}
                      className="hover:bg-slate-50/70 transition duration-150"
                    >
                      {/* Product details */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={p.product_name}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/80?text=Item";
                            }}
                          />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">
                              {p.product_name}
                            </p>
                            <p className="text-slate-400 text-[11px]">
                              {p.brand || "Brand"} • SKU: {p.sku || `#${p.product_id}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="p-4 font-semibold text-slate-700">
                        {p.vendor_name}
                      </td>

                      {/* Category */}
                      <td className="p-4 text-slate-600">
                        {p.category_name}
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <p className="font-bold text-slate-900">
                          ₹{Number(p.discount_price || p.price).toLocaleString("en-IN")}
                        </p>
                        {p.discount_price && Number(p.discount_price) < Number(p.price) && (
                          <p className="text-[11px] text-slate-400 line-through">
                            ₹{Number(p.price).toLocaleString("en-IN")}
                          </p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            (p.stock_quantity ?? 0) === 0
                              ? "text-rose-600 font-bold"
                              : (p.stock_quantity ?? 0) <= 10
                              ? "text-amber-600 font-bold"
                              : "text-slate-700"
                          }`}
                        >
                          {p.stock_quantity ?? 0} units
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <StatusBadge status={p.product_status} />
                      </td>

                      {/* Moderation Actions */}
                      <td className="p-4 pr-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Inspect Details"
                          >
                            <Eye size={16} />
                          </button>

                          <select
                            value={p.product_status}
                            onChange={(e) =>
                              handleStatusChange(p.product_id, e.target.value)
                            }
                            className={`rounded-lg border px-2 py-1 text-[11px] font-bold focus:outline-none transition cursor-pointer ${
                              p.product_status === "ACTIVE"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : p.product_status === "OUT_OF_STOCK"
                                ? "border-amber-200 bg-amber-50 text-amber-800"
                                : "border-rose-200 bg-rose-50 text-rose-800"
                            }`}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                            <option value="DISCONTINUED">DISCONTINUED</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onView={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {/* Product Detail / Moderation Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isAdmin={true}
          onClose={() => setSelectedProduct(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default ProductCatalogue;