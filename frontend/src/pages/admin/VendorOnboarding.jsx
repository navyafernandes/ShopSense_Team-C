import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Ban,
  RotateCcw,
  Building2,
  ShieldCheck,
  Eye,
  AlertTriangle,
} from "lucide-react";
import api from "../../services/api";
import StatusBadge from "../../components/common/StatusBadge";

function VendorOnboarding() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vendors");
      setVendors(response.data || []);
    } catch (err) {
      console.error("Failed to load vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (vendorId, status) => {
    try {
      await api.put(
        `/vendors/${vendorId}/status`,
        null,
        {
          params: {
            status,
          },
        }
      );

      setFeedback(`Vendor #${vendorId} status set to ${status}`);
      setTimeout(() => setFeedback(""), 3500);

      loadVendors();
      if (selectedVendor && selectedVendor.vendor_id === vendorId) {
        setSelectedVendor((prev) => ({ ...prev, verification_status: status }));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Unable to update vendor status.");
    }
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const term = search.toLowerCase();
      const matchesSearch =
        vendor.business_name.toLowerCase().includes(term) ||
        (vendor.business_type || "").toLowerCase().includes(term) ||
        (vendor.gst_number || "").toLowerCase().includes(term) ||
        (vendor.email || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "ALL" ||
        vendor.verification_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vendors, search, statusFilter]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="text-emerald-400" size={18} />
          <span className="text-sm font-medium">{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Vendor Management & Onboarding
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review vendor verification applications, approve merchant credentials, and govern platform permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            {vendors.length} Total Merchants
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative sm:col-span-8">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by business name, type, GST, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="relative sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          >
            <option value="ALL">All Statuses ({vendors.length})</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved / Active</option>
            <option value="REJECTED">Rejected / Revoked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">
          Loading vendor accounts...
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center">
          <Building2 className="mx-auto text-slate-300 mb-3" size={48} />
          <h3 className="text-base font-bold text-slate-800">No vendors found</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search or status filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">Business Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">GST Number</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-center">Governance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.vendor_id}
                    className="hover:bg-slate-50/70 transition duration-150"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {vendor.business_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">
                            {vendor.business_name}
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            Vendor #{vendor.vendor_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {vendor.business_type || "Retailer"}
                    </td>

                    <td className="p-4 font-mono text-slate-600 text-[11px]">
                      {vendor.gst_number || "N/A"}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={vendor.verification_status} />
                    </td>

                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-center gap-2">
                        {/* Pending Review Actions */}
                        {vendor.verification_status === "PENDING" && (
                          <>
                            <button
                              onClick={() => updateStatus(vendor.vendor_id, "APPROVED")}
                              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-[11px] transition shadow-sm"
                            >
                              <CheckCircle2 size={13} />
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(vendor.vendor_id, "REJECTED")}
                              className="flex items-center gap-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl font-semibold text-[11px] transition"
                            >
                              <XCircle size={13} />
                              Reject
                            </button>
                          </>
                        )}

                        {/* Approved / Active Actions */}
                        {vendor.verification_status === "APPROVED" && (
                          <>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              Active Merchant
                            </span>
                            <button
                              onClick={() => updateStatus(vendor.vendor_id, "REJECTED")}
                              className="flex items-center gap-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-xl font-semibold text-[11px] transition"
                              title="Revoke / Reject merchant privileges"
                            >
                              <Ban size={12} />
                              Revoke
                            </button>
                          </>
                        )}

                        {/* Rejected Actions */}
                        {vendor.verification_status === "REJECTED" && (
                          <button
                            onClick={() => updateStatus(vendor.vendor_id, "APPROVED")}
                            className="flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-xl font-semibold text-[11px] transition"
                          >
                            <RotateCcw size={12} />
                            Re-Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorOnboarding;