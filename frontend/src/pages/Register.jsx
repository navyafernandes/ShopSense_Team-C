import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  Store,
  Building2,
  BadgeCheck,
} from "lucide-react";
import api from "../services/api";

const PASSWORD_REQUIREMENTS = [
  { id: "length", label: "Minimum 8 characters", check: (pwd) => pwd.length >= 8 },
  { id: "upper", label: "At least one uppercase letter (A-Z)", check: (pwd) => /[A-Z]/.test(pwd) },
  { id: "lower", label: "At least one lowercase letter (a-z)", check: (pwd) => /[a-z]/.test(pwd) },
  { id: "number", label: "At least one number (0-9)", check: (pwd) => /\d/.test(pwd) },
  { id: "special", label: "At least one special character (!@#$...)", check: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
];

function getPasswordStrength(password) {
  if (!password) {
    return { label: "", score: 0, textColor: "text-slate-400" };
  }
  const metCount = PASSWORD_REQUIREMENTS.filter((req) => req.check(password)).length;
  if (metCount <= 2) {
    return {
      label: "Weak",
      score: metCount,
      textColor: "text-red-600",
      barClass: "w-1/3 bg-red-500",
    };
  }
  if (metCount <= 4) {
    return {
      label: "Medium",
      score: metCount,
      textColor: "text-amber-600",
      barClass: "w-2/3 bg-amber-500",
    };
  }
  return {
    label: "Strong",
    score: metCount,
    textColor: "text-emerald-600",
    barClass: "w-full bg-emerald-500",
  };
}

function InputField({
  icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
}) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-4 top-4 text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3.5 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />
      </div>
    </div>
  );
}

function PasswordStrengthIndicator({ password }) {
  if (!password) {
    return null;
  }

  const strength = getPasswordStrength(password);
  const isStrong = strength.label === "Strong";

  return (
    <div className="mt-2 space-y-1.5 px-0.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">
          Password strength:{" "}
          <span className={`font-semibold ${strength.textColor}`}>
            {strength.label}
          </span>
        </span>
      </div>

      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${strength.barClass}`}
        />
      </div>

      <div className="text-xs pt-0.5">
        {isStrong ? (
          <p className="text-emerald-600 font-medium flex items-center gap-1">
            ✓ Strong password
          </p>
        ) : (
          <p className="text-slate-500 leading-tight">
            Use at least 8 characters with uppercase, lowercase, number and special character.
          </p>
        )}
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    role: "CUSTOMER",
    business_name: "",
    business_type: "",
    gst_number: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!form.full_name.trim()) {
      setError("Full Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!form.password) {
      setError("Password is required.");
      return;
    }

    const isStrong = PASSWORD_REQUIREMENTS.every((req) =>
      req.check(form.password)
    );
    if (!isStrong) {
      setError("Password does not meet all security requirements.");
      return;
    }

    if (!form.confirm_password) {
      setError("Confirm Password is required.");
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (form.role === "VENDOR") {
      if (!form.business_name.trim()) {
        setError("Business Name is required for vendors.");
        return;
      }
      if (!form.business_type.trim()) {
        setError("Business Type is required for vendors.");
        return;
      }
      if (!form.gst_number.trim()) {
        setError("GST Number is required for vendors.");
        return;
      }
    }

    try {
      // confirm_password is only a client validation field and is not stored or sent
      const payload = {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
        ...(form.role === "VENDOR"
          ? {
              business_name: form.business_name,
              business_type: form.business_type,
              gst_number: form.gst_number,
            }
          : {}),
      };

      await api.post("/auth/register", payload);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail) && detail.length > 0) {
        const msg =
          detail[0]?.msg?.replace(/^Value error,\s*/i, "") ||
          "Registration failed.";
        setError(msg);
      } else {
        setError("Registration failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-8">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-10">

        <h1 className="text-4xl font-bold text-slate-900">
          Create Account
        </h1>

        <p className="text-slate-500 mt-2 mb-8">
          Join ShopSense Marketplace
        </p>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-600 p-4">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl bg-green-50 border border-green-200 text-green-700 p-4">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">

          <InputField
            icon={<User size={18} />}
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
          />

          <InputField
            icon={<Mail size={18} />}
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <div className="space-y-4">
            <InputField
              icon={<Lock size={18} />}
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <PasswordStrengthIndicator password={form.password} />

            <InputField
              icon={<Lock size={18} />}
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
              value={form.confirm_password}
              onChange={handleChange}
            />
          </div>

          <div>
            <InputField
              icon={<Phone size={18} />}
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="mt-8">

          <h3 className="font-semibold text-slate-700 mb-4">
            Select Role
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  role: "CUSTOMER",
                }))
              }
              className={`rounded-2xl border p-5 transition ${
                form.role === "CUSTOMER"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-slate-200"
              }`}
            >
              👤
              <h4 className="font-bold mt-2">
                Customer
              </h4>
            </button>

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  role: "VENDOR",
                }))
              }
              className={`rounded-2xl border p-5 transition ${
                form.role === "VENDOR"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-slate-200"
              }`}
            >
              🏪
              <h4 className="font-bold mt-2">
                Vendor
              </h4>
            </button>

          </div>

        </div>

        {form.role === "VENDOR" && (
          <div className="grid md:grid-cols-2 gap-5 mt-8">

            <InputField
              icon={<Store size={18} />}
              name="business_name"
              placeholder="Business Name"
              value={form.business_name}
              onChange={handleChange}
            />

            <InputField
              icon={<Building2 size={18} />}
              name="business_type"
              placeholder="Business Type"
              value={form.business_type}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <InputField
                icon={<BadgeCheck size={18} />}
                name="gst_number"
                placeholder="GST Number"
                value={form.gst_number}
                onChange={handleChange}
              />
            </div>

          </div>
        )}

        <button
          type="button"
          onClick={handleRegister}
          className="mt-10 w-full rounded-xl bg-slate-900 py-3.5 text-white font-semibold hover:bg-slate-800 transition cursor-pointer"
        >
          Create Account
        </button>

        <p className="text-center mt-8 text-slate-600">
          Already have an account?

          <Link
            to="/"
            className="ml-2 text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;