import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import VendorOnboarding from "./pages/admin/VendorOnboarding";
import ProductCatalogue from "./pages/admin/ProductCatalogue";
import Transactions from "./pages/admin/Transactions";

import VendorDashboard from "./pages/vendors/VendorDashboard";
import VendorProducts from "./pages/vendors/VendorProducts";
import VendorInventory from "./pages/vendors/VendorInventory";
import VendorOrders from "./pages/vendors/VendorOrders";
import VendorTransactions from "./pages/vendors/VendorTransactions";
import BusinessAnalytics from "./pages/vendors/BusinessAnalytics";

import CustomerProducts from "./pages/customer/CustomerProducts";
import CustomerAnalytics from "./pages/customer/CustomerAnalytics";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Payment from "./pages/customer/Payment";
import MyOrders from "./pages/customer/MyOrders";
import Profile from "./pages/customer/Profile";

import AdminIntelligence from "./pages/admin/AdminIntelligence";
import ExecutiveBI from "./pages/admin/ExecutiveBI";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayout>
                <VendorOnboarding />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayout>
                <ProductCatalogue />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayout>
                <Transactions />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
           path="/admin/intelligence"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayout>
                <AdminIntelligence />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
           path="/admin/executive-bi"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayout>
                <ExecutiveBI />
              </MainLayout>
            </ProtectedRoute>
          }
        />


        {/* ================= VENDOR ================= */}

        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["VENDOR"]}>
              <MainLayout>
                <VendorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/products"
          element={
            <ProtectedRoute allowedRoles={["VENDOR"]}>
              <MainLayout>
                <VendorProducts />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/inventory"
          element={
            <ProtectedRoute allowedRoles={["VENDOR"]}>
              <MainLayout>
                <VendorInventory />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/orders"
          element={
            <ProtectedRoute allowedRoles={["VENDOR"]}>
              <MainLayout>
                <VendorOrders />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor/transactions"
          element={
            <ProtectedRoute allowedRoles={["VENDOR"]}>
              <MainLayout>
                <VendorTransactions />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
  path="/vendor/analytics"
  element={
    <ProtectedRoute allowedRoles={["VENDOR"]}>
      <MainLayout>
        <BusinessAnalytics />
      </MainLayout>
    </ProtectedRoute>
  }
/>

        {/* ================= CUSTOMER ================= */}

        <Route
          path="/customer/products"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MainLayout>
                <CustomerProducts />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/cart"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MainLayout>
                <Cart />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/checkout"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MainLayout>
                <Checkout />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/payment"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MainLayout>
                <Payment />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/orders"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MainLayout>
                <MyOrders />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/analytics"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MainLayout>
                <CustomerAnalytics />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
  path="/customer/profile"
  element={
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <MainLayout>
        <Profile />
      </MainLayout>
    </ProtectedRoute>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;