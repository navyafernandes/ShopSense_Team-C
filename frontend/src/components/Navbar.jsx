import { FaBell, FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const role = localStorage.getItem("role");

  const userName =
    localStorage.getItem("name") ||
    localStorage.getItem("username") ||
    "User";

  let roleLabel = "";
  let pageTitle = "Dashboard";

  // -----------------------------
  // User Role Label
  // -----------------------------

  switch (role) {
    case "ADMIN":
      roleLabel = "Marketplace Manager";
      break;

    case "VENDOR":
      roleLabel = "Vendor";
      break;

    case "CUSTOMER":
      roleLabel = "Customer";
      break;

    default:
      roleLabel = "";
  }

  // -----------------------------
  // Dynamic Page Title
  // -----------------------------

  const path = location.pathname;

  if (path.includes("/dashboard")) {
    pageTitle =
      role === "ADMIN"
        ? "Admin Dashboard"
        : role === "VENDOR"
        ? "Business Overview"
        : "Customer Dashboard";
  }

  else if (path.includes("/products")) {
    pageTitle =
      role === "VENDOR"
        ? "My Products"
        : "Products";
  }

  else if (path.includes("/inventory")) {
    pageTitle = "Inventory";
  }

  else if (path.includes("/orders")) {
    pageTitle = "Orders";
  }

  else if (path.includes("/transactions")) {
    pageTitle = "Transactions";
  }

  else if (path.includes("/analytics")) {
    pageTitle = "Analytics & Insights";
  }

  else if (path.includes("/customers")) {
    pageTitle = "Customers";
  }

  else if (path.includes("/vendors")) {
    pageTitle = "Vendors";
  }

  else if (path.includes("/categories")) {
    pageTitle = "Categories";
  }

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20">

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          {pageTitle}
        </h1>

        <p className="text-slate-500 mt-1">
          {today}
        </p>

      </div>

      <div className="flex items-center gap-6">

        <button className="relative text-slate-500 hover:text-slate-800 transition">

          <FaBell size={20} />

          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle
            size={34}
            className="text-slate-500"
          />

          <div>

            <p className="font-semibold">
              {userName}
            </p>

            <p className="text-sm text-slate-500">
              {roleLabel}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;