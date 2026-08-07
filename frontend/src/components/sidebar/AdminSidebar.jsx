import {
  FaChartLine,
  FaBox,
  FaWarehouse,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaBrain,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
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

        <p className="text-sm text-slate-400 mt-2">
          Marketplace Admin Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-6 space-y-2">

        <NavLink to="/admin/dashboard" className={navItemClass}>
          <FaChartLine size={18} />
          <span>Analytics</span>
        </NavLink>
        
        <NavLink to="/admin/intelligence" className={navItemClass}>
          <FaBrain size={18} />
          <span>Marketplace Intelligence</span>
        </NavLink>

        <NavLink to="/vendors" className={navItemClass}>
          <FaUsers size={18} />
          <span>Vendor Onboarding</span>
        </NavLink>

        <NavLink to="/products" className={navItemClass}>
          <FaBox size={18} />
          <span>Products Catalogue</span>
        </NavLink>

        <NavLink to="/transactions" className={navItemClass}>
          <FaShoppingCart size={18} />
          <span>Transactions</span>
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

export default Sidebar;