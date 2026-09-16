import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

import api from "../../services/api";
import { downloadCSV } from "../../utils/csvExport";

import PageHeader from "../../components/common/PageHeader";
import SearchInput from "../../components/common/SearchInput";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    const term = search.toLowerCase();

    return transactions.filter((transaction) => {
      return (
        transaction.order_id.toString().includes(term) ||
        transaction.customer_name.toLowerCase().includes(term) ||
        transaction.vendor_name.toLowerCase().includes(term)
      );
    });
  }, [transactions, search]);

  const handleExportCSV = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Vendor Name",
      "Amount (INR)",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Payment Date",
    ];

    const dataRows = filteredTransactions.map((t) => [
      t.order_id,
      t.customer_name,
      t.vendor_name,
      t.total_amount,
      t.payment_method || "N/A",
      t.payment_status || "PENDING",
      t.order_status,
      t.payment_date ? new Date(t.payment_date).toISOString() : "N/A",
    ]);

    downloadCSV(
      `ShopSense_Transactions_${new Date().toISOString().slice(0, 10)}.csv`,
      [headers, ...dataRows]
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">

      <PageHeader
        title="Marketplace Transactions"
        subtitle="Monitor orders and payments across the marketplace"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-sm"
          >
            <Download size={16} />
            Export CSV
          </button>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
          />
        </div>
      </PageHeader>

      {filteredTransactions.length === 0 ? (
        <EmptyState message="No transactions found." />
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="text-left">

                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Order Status</th>
                <th className="px-6 py-4">Date</th>

              </tr>

            </thead>

            <tbody>

              {filteredTransactions.map((transaction) => (

                <tr
                  key={transaction.order_id}
                  className="border-t hover:bg-slate-50 transition"
                >

                  <td className="px-6 py-4 font-semibold">
                    #{transaction.order_id}
                  </td>

                  <td className="px-6 py-4">
                    {transaction.customer_name}
                  </td>

                  <td className="px-6 py-4">
                    {transaction.vendor_name}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ₹
                    {Number(
                      transaction.total_amount
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">

                    <div className="space-y-1">

                      <p className="text-sm font-medium">
                        {transaction.payment_method || "-"}
                      </p>

                      <StatusBadge
                        status={
                          transaction.payment_status || "PENDING"
                        }
                      />

                    </div>

                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge
                      status={transaction.order_status}
                    />
                  </td>

                  <td className="px-6 py-4 text-slate-500">

                    {transaction.payment_date
                      ? new Date(
                          transaction.payment_date
                        ).toLocaleDateString("en-IN")
                      : "-"}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Transactions;