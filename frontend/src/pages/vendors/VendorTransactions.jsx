import { useEffect, useMemo, useState } from "react";
import { Search, IndianRupee, CreditCard, Download } from "lucide-react";

import api from "../../services/api";
import StatCard from "../../components/StatCard";
import { downloadCSV } from "../../utils/csvExport";

function VendorTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
  try {
    const response = await api.get("/vendor/transactions");
    setTransactions(response.data);
  } catch (error) {
    console.error(error);
  }
};
  
  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        transaction.customer_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.product_name
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const totalRevenue = filteredTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );

  const handleExportCSV = () => {
    const headers = [
      "Payment ID",
      "Customer Name",
      "Product Name",
      "Amount (INR)",
      "Payment Method",
      "Payment Status",
      "Payment Date",
    ];

    const dataRows = filteredTransactions.map((t) => [
      t.payment_id,
      t.customer_name,
      t.product_name,
      t.amount,
      t.payment_method || "N/A",
      t.payment_status || "SUCCESS",
      t.payment_date ? new Date(t.payment_date).toISOString() : "N/A",
    ]);

    downloadCSV(
      `Vendor_Transactions_${new Date().toISOString().slice(0, 10)}.csv`,
      [headers, ...dataRows]
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Transactions
          </h1>

          <p className="mt-2 text-slate-500">
            View all successful payments received for your products.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          icon={<IndianRupee size={22} />}
        />

        <StatCard
          title="Transactions"
          value={filteredTransactions.length}
          icon={<CreditCard size={22} />}
        />
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96 mb-6">
        <Search
          size={18}
          className="absolute left-3 top-3 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search customer or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow border border-slate-200">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr className="text-left text-slate-700">

              <th className="px-6 py-4">Payment ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>

            </tr>

          </thead>

          <tbody>

            {filteredTransactions.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="text-center py-10 text-slate-500"
                >
                  No transactions found.
                </td>

              </tr>

            ) : (

              filteredTransactions.map((transaction) => (

                <tr
                  key={transaction.order_item_id}
                  className="border-t hover:bg-slate-50 transition"
                >

                  <td className="px-6 py-4 font-semibold">
                    #{transaction.payment_id}
                  </td>

                  <td className="px-6 py-4">
                    {transaction.customer_name}
                  </td>

                  <td className="px-6 py-4">
                    {transaction.product_name}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    ₹{Number(transaction.amount).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    {transaction.payment_method}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      {transaction.payment_status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(
                      transaction.payment_date
                    ).toLocaleDateString("en-IN")}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}

export default VendorTransactions;