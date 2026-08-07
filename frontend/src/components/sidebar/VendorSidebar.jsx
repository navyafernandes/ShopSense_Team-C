import {
  FaChartLine,
  FaBox,
  FaWarehouse,
  FaShoppingCart,
  FaMoneyCheckAlt,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function VendorSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-72 h-screen sticky top-0 bg-slate-900 text-white flex flex-col shadow-2xl flex-shrink-0">
      {/* Logo */}

      <div className="px-8 py-8 border-b border-slate-800">
        <h1 className="text-3xl font-bold tracking-wide">
          Shop
          <span className="text-indigo-400">
            Sense
          </span>
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          Marketplace Seller Portal
        </p>
      </div>

      {/* Navigation */}

      <nav className="px-5 py-6 space-y-2">
        <NavLink
          to="/vendor/dashboard"
          className={navItemClass}
        >
          <FaChartLine size={18} />
          <span>Business Overview</span>
        </NavLink>

        <NavLink
          to="/vendor/products"
          className={navItemClass}
        >
          <FaBox size={18} />
          <span>My Products</span>
        </NavLink>

        <NavLink
          to="/vendor/inventory"
          className={navItemClass}
        >
          <FaWarehouse size={18} />
          <span>Inventory</span>
        </NavLink>

        <NavLink
          to="/vendor/orders"
          className={navItemClass}
        >
          <FaShoppingCart size={18} />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/vendor/transactions"
          className={navItemClass}
        >
          <FaMoneyCheckAlt size={18} />
          <span>Transactions</span>
        </NavLink>

        <NavLink
          to="/vendor/analytics"
          className={navItemClass}
        >
          <FaChartBar size={18} />
          <span>Analytics & Insights</span>
        </NavLink>

        {/* Logout moved directly below Analytics */}

        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <FaSignOutAlt size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default VendorSidebar;