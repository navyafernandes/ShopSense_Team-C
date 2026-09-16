import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Save,
  X,
  ShoppingBag,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [profile, setProfile] = useState({
    customer_id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    created_at: null,
    total_orders: 0,
    total_spent: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers/profile");

      setProfile({
        customer_id: res.data.customer_id,
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        city: res.data.city || "",
        state: res.data.state || "",
        country: res.data.country || "",
        postal_code: res.data.postal_code || "",
        created_at: res.data.created_at,
        total_orders: res.data.total_orders || 0,
        total_spent: res.data.total_spent || 0,
      });
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: "Unable to load your profile information.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      setFeedback({
        type: "error",
        message: "Full name is required.",
      });
      return;
    }

    try {
      setSaving(true);
      setFeedback({ type: "", message: "" });

      await api.put("/customers/profile", {
        name: profile.name.trim(),
        phone: profile.phone?.trim() || null,
        address: profile.address?.trim() || null,
        city: profile.city?.trim() || null,
        state: profile.state?.trim() || null,
        country: profile.country?.trim() || null,
        postal_code: profile.postal_code?.trim() || null,
      });

      setFeedback({
        type: "success",
        message: "Your profile information has been saved successfully!",
      });

      setEditing(false);
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        message: "Unable to save profile changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-base font-semibold text-slate-500 animate-pulse">
          Loading customer account details...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <User className="text-white" size={40} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    Verified Customer
                  </span>
                </div>
                <p className="text-indigo-100 text-sm mt-1">{profile.email}</p>
              </div>
            </div>

            {!editing ? (
              <button
                onClick={() => {
                  setEditing(true);
                  setFeedback({ type: "", message: "" });
                }}
                className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow transition"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow transition disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Summary Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/70 p-4 border-b border-slate-200">
          <div className="flex items-center gap-4 p-3 sm:px-6">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <ShoppingBag size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Total Orders
              </p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                {profile.total_orders} Orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 sm:px-6">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CreditCard size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Total Spending
              </p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                ₹{Number(profile.total_spent).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 sm:px-6">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Member Since
              </p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Active Member"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
          ) : (
            <AlertCircle className="text-rose-600 shrink-0" size={20} />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Main Form Cards */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Section 1: Account Information (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Account Information
              </h2>
              <p className="text-xs text-slate-500">
                Personal details and login contact
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-3 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g. John Doe"
                  className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm transition ${
                    editing
                      ? "border-indigo-400 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                      : "bg-slate-50/70 border-slate-200 text-slate-800 cursor-default"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Email Address (Account Identifier)
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-3 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 pl-10 pr-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3.5 top-3 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="+91 98765 43210"
                  className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm transition ${
                    editing
                      ? "border-indigo-400 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                      : "bg-slate-50/70 border-slate-200 text-slate-800 cursor-default"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Delivery Information (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Delivery Information
              </h2>
              <p className="text-xs text-slate-500">
                Default shipping destination for orders
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Street Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Street Address
              </label>
              <textarea
                rows="2"
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Apartment, suite, street address"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm transition resize-none ${
                  editing
                    ? "border-indigo-400 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                    : "bg-slate-50/70 border-slate-200 text-slate-800 cursor-default"
                }`}
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g. Mumbai"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm transition ${
                    editing
                      ? "border-indigo-400 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                      : "bg-slate-50/70 border-slate-200 text-slate-800 cursor-default"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g. Maharashtra"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm transition ${
                    editing
                      ? "border-indigo-400 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                      : "bg-slate-50/70 border-slate-200 text-slate-800 cursor-default"
                  }`}
                />
              </div>
            </div>

            {/* Country & Postal Code */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={profile.postal_code}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g. 400001"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm transition ${
                    editing
                      ? "border-indigo-400 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                      : "bg-slate-50/70 border-slate-200 text-slate-800 cursor-default"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g. India"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm transition ${
                    editing
                      ? "border-indigo-400 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
                      : "bg-slate-50/70 border-slate-200 text-slate-800 cursor-default"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;