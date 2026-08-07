import { useEffect, useState } from "react";
import api from "../../services/api";
import StatusBadge from "../../components/common/StatusBadge";

function VendorOnboarding() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await api.get("/vendors");
      setVendors(response.data);
    } catch (err) {
      console.error(err);
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

      loadVendors();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.business_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Vendor Onboarding
          </h1>

          <p className="text-slate-500">
            Manage vendor registrations
          </p>
        </div>

        <button
          disabled
          className="bg-slate-300 text-white px-5 py-3 rounded-xl cursor-not-allowed"
        >
          Register via Signup
        </button>

      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search business..."
        className="w-full mb-6 border rounded-xl px-4 py-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4">
                Business
              </th>

              <th className="text-left p-4">
                Type
              </th>

              <th className="text-left p-4">
                GST
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-center p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredVendors.map((vendor) => (

              <tr
                key={vendor.vendor_id}
                className="border-t hover:bg-slate-50 transition"
              >

                <td className="p-4 font-medium">
                  {vendor.business_name}
                </td>

                <td className="p-4">
                  {vendor.business_type}
                </td>

                <td className="p-4">
                  {vendor.gst_number}
                </td>

                <td className="p-4">
                  <StatusBadge
                    status={vendor.verification_status}
                  />
                </td>

                <td className="p-4">

                  <div className="flex justify-center">

                    {/* Pending */}
                    {vendor.verification_status === "PENDING" && (

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            updateStatus(
                              vendor.vendor_id,
                              "APPROVED"
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              vendor.vendor_id,
                              "REJECTED"
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Reject
                        </button>

                      </div>

                    )}

                    {/* Approved */}
                    {vendor.verification_status === "APPROVED" && (

                      <button
                        disabled
                        className="bg-green-100 text-green-700 px-5 py-2 rounded-lg font-semibold cursor-default"
                      >
                        ✓ Approved
                      </button>

                    )}

                    {/* Rejected */}
                    {vendor.verification_status === "REJECTED" && (

                      <button
                        disabled
                        className="bg-red-100 text-red-700 px-5 py-2 rounded-lg font-semibold cursor-default"
                      >
                        Rejected
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
  );
}

export default VendorOnboarding;