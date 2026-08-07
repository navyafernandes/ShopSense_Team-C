import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
  FaChartPie,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function CustomerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen flex flex-col shadow-2xl">

      {/* Logo */}
      <div className="px-8 py-8 border-b border-slate-800">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          Shop<span className="text-indigo-400">Sense</span>
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Customer Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-5 py-6">


        <NavLink to="/customer/products" className={navItemClass}>
          <FaBoxOpen size={18} />
          <span>Browse Products</span>
        </NavLink>

        <NavLink to="/customer/cart" className={navItemClass}>
          <FaShoppingCart size={18} />
          <span>My Cart</span>
        </NavLink>

        <NavLink to="/customer/orders" className={navItemClass}>
          <FaClipboardList size={18} />
          <span>My Orders</span>
        </NavLink>

        <NavLink to="/customer/analytics" className={navItemClass}>
          <FaChartPie size={18} />
          <span>Spending Insights</span>
        </NavLink>

        <NavLink to="/customer/profile" className={navItemClass}>
          <FaUserCircle size={18} />
          <span>Profile</span>
        </NavLink>

      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <FaSignOutAlt size={18} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default CustomerSidebar;