import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import InventoryCard from "../../components/vendor/InventoryCard";
import UpdateInventoryModal from "../../components/vendor/UpdateInventoryModal";
import InventoryOverview from "../../components/vendor/InventoryOverview";

import {
  Package,
  CheckCircle2,
  AlertTriangle,
  CircleAlert,
} from "lucide-react";

function VendorInventory() {
  const [inventory, setInventory] = useState([]);

  const [summary, setSummary] = useState({
    total_products: 0,
    healthy: 0,
    low_stock: 0,
    critical: 0,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState([]);

  const [editingInventory, setEditingInventory] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
  try {

    const [
      inventoryRes,
      forecastRes,
    ] = await Promise.all([
      api.get("/vendor/inventory"),
      api.get("/vendor/dashboard/inventory-forecast"),
    ]);

    setSummary(inventoryRes.data.summary);
    setInventory(inventoryRes.data.products);

    setForecast(forecastRes.data);

  } catch (error) {

    console.error(
      "Failed to fetch inventory:",
      error
    );

  } finally {

    setLoading(false);

  }
};
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) =>
      item.product_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [inventory, search]);

  return (
    <div className="p-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            My Inventory
          </h1>

          <p className="text-slate-500 mt-2">
            Monitor stock levels and update inventory for your products.
          </p>

        </div>

        <input
          type="text"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-3 w-80"
        />

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">

          <div>

            <p className="text-slate-500">
              Total Products
            </p>

            <h2 className="text-4xl font-bold text-indigo-600 mt-2">
              {summary.total_products}
            </h2>

          </div>

          <Package
            className="text-indigo-500"
            size={38}
          />

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">

          <div>

            <p className="text-slate-500">
              Healthy Stock
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {summary.healthy}
            </h2>

          </div>

          <CheckCircle2
            className="text-green-500"
            size={38}
          />

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">

          <div>

            <p className="text-slate-500">
              Low Stock
            </p>

            <h2 className="text-4xl font-bold text-amber-500 mt-2">
              {summary.low_stock}
            </h2>

          </div>

          <AlertTriangle
            className="text-amber-500"
            size={38}
          />

        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">

          <div>

            <p className="text-slate-500">
              Critical Stock
            </p>

            <h2 className="text-4xl font-bold text-red-500 mt-2">
              {summary.critical}
            </h2>

          </div>

          <CircleAlert
            className="text-red-500"
            size={38}
          />

        </div>

      </div>

      <InventoryOverview
    summary={summary}
    forecast={forecast}
/>

      {/* Inventory Count */}

      <div className="mb-6">

        <span className="text-slate-500">
          Showing
        </span>

        <span className="font-semibold mx-2">
          {filteredInventory.length}
        </span>

        <span className="text-slate-500">
          inventory items
        </span>

      </div>

      {/* Inventory Grid */}

      {loading ? (

        <div className="text-slate-500">
          Loading inventory...
        </div>

      ) : filteredInventory.length === 0 ? (

        <div className="text-center py-20 text-slate-500">
          No inventory found.
        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredInventory.map((item) => (

            <InventoryCard
              key={item.product_id}
              inventory={item}
              onEdit={setEditingInventory}
            />

          ))}

        </div>

      )}

      {/* Update Inventory */}

      {editingInventory && (

        <UpdateInventoryModal
          inventory={editingInventory}
          onClose={() => setEditingInventory(null)}
          onSuccess={fetchInventory}
        />

      )}

    </div>
  );
}

export default VendorInventory;