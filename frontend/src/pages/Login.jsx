import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

const {
  access_token,
  role,
  name,
} = response.data;

localStorage.setItem(
  "access_token",
  access_token
);

localStorage.setItem(
  "role",
  role
);

localStorage.setItem(
  "name",
  name
);

api.defaults.headers.common[
  "Authorization"
] = `Bearer ${access_token}`;

if (role === "ADMIN") {
  navigate("/admin/dashboard");
} else if (role === "VENDOR") {
  navigate("/vendor/dashboard");
} else {
  navigate("/customer/products");
}
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid email or password."
      );
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      {/* Left Panel */}

      <div className="hidden lg:flex flex-col justify-center px-20 xl:px-28">

        <div className="flex items-center gap-3 mb-10">

          <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">

            <ShoppingBag className="text-white" size={28} />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              ShopSense
            </h1>

            <p className="text-sm text-slate-500">
              Marketplace Intelligence
            </p>

          </div>

        </div>

        <h2 className="text-6xl font-black leading-tight text-slate-900">

          Manage Your

          <br />

          Marketplace

          <span className="block text-indigo-600">
            Smarter.
          </span>

        </h2>

        <p className="mt-8 text-lg leading-8 text-slate-600 max-w-lg">

          One platform to manage vendors, products,
          inventory, orders, payments and analytics—
          all from one beautiful dashboard.

        </p>

        <div className="mt-14 space-y-6 max-w-md">

          {[
            {
              title: "Vendor Management",
              desc: "Onboard and manage marketplace vendors."
            },
            {
              title: "Sales Analytics",
              desc: "Track revenue and product performance."
            },
            {
              title: "Inventory Monitoring",
              desc: "Monitor stock levels in real time."
            },
            {
              title: "Business Reports",
              desc: "Generate actionable marketplace insights."
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4"
            >

              <div className="mt-1 h-3 w-3 rounded-full bg-indigo-600" />

              <div>

                <h3 className="font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-slate-500 text-sm">
                  {item.desc}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Right Panel */}

      <div className="flex items-center justify-center p-8">

        <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl p-10">

          <div className="mb-10">

            <h2 className="text-4xl font-bold text-slate-900">
              Welcome Back 👋
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to continue to ShopSense
            </p>

          </div>

          {error && (

            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">

              {error}

            </div>

          )}

          <div className="space-y-6">

            <div>

              <label className="block mb-2 font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-4 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>

            <div>

              <label className="block mb-2 font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-4 text-slate-400"
                />

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />

              </div>

            </div>

            <button
              onClick={handleLogin}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-white font-semibold transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
            >

              Sign In

              <ArrowRight size={18} />

            </button>

          </div>

          <div className="mt-8 text-center text-slate-600">

            New to ShopSense?

            <Link
              to="/register"
              className="ml-2 font-semibold text-indigo-600 hover:underline"
            >

              Create Account

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;