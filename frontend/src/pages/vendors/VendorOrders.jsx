import { useEffect, useState } from "react";
import api from "../../services/api";

import OrderCard from "../../components/vendor/OrderCard";
import UpdateOrderStatusModal from "../../components/vendor/UpdateOrderStatusModal";
import { downloadCSV } from "../../utils/csvExport";

import { Search, Download } from "lucide-react";

function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.customer_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.product_name
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredOrders(filtered);
  }, [search, orders]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/vendor/orders");
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Product Name",
      "Quantity",
      "Price (INR)",
      "Total Amount (INR)",
      "Order Status",
      "Order Date",
    ];

    const dataRows = filteredOrders.map((o) => [
      o.order_id,
      o.customer_name,
      o.product_name,
      o.quantity,
      o.price,
      o.total_amount,
      o.order_status,
      o.created_at ? new Date(o.created_at).toISOString() : "N/A",
    ]);

    downloadCSV(
      `Vendor_Orders_${new Date().toISOString().slice(0, 10)}.csv`,
      [headers, ...dataRows]
    );
  };

  return (
    <div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Vendor Orders
          </h1>

          <p className="text-slate-500 mt-2">
            View and manage customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-sm whitespace-nowrap"
          >
            <Download size={16} />
            Export CSV
          </button>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search customer or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-slate-500">
          No orders found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredOrders.map((order) => (
            <OrderCard
              key={`${order.order_id}-${order.product_name}`}
              order={order}
              onUpdate={openModal}
            />
          ))}

        </div>
      )}

      <UpdateOrderStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onSuccess={fetchOrders}
      />

    </div>
  );
}

export default VendorOrders;