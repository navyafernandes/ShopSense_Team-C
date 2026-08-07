import AdminSidebar from "../components/sidebar/AdminSidebar";
import VendorSidebar from "../components/sidebar/VendorSidebar";
import CustomerSidebar from "../components/sidebar/CustomerSidebar";

import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  const role = localStorage.getItem("role");

  const renderSidebar = () => {
    switch (role) {
      case "ADMIN":
        return <AdminSidebar />;

      case "VENDOR":
        return <VendorSidebar />;

      case "CUSTOMER":
        return <CustomerSidebar />;

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {renderSidebar()}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;