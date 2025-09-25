import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ModernLogin from "./Components/ModernLogin.jsx";
import AdminLayout from "./Components/admin/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import OurProducts from "./pages/OurProducts.jsx";
import Community from "./pages/Community.jsx";

// Admin modules...
import AdminProducts from "./Components/admin/modules/AdminProducts.jsx";
import AdminInventory from "./Components/admin/modules/AdminInventory.jsx";
import OrderDeliveryManagement from "./Components/admin/modules/OrderDeliveryManagement.jsx";
import WorkshopScheduleManagement from "./Components/admin/modules/WorkshopScheduleManagement.jsx";
import CustomerMediaManagement from "./Components/admin/modules/CustomerMediaManagement.jsx";
import AdminDahboard from "./Components/admin/AdminDahboard.jsx";

// --- Simple auth helpers ---
const isAuthed = () => !!localStorage.getItem("token");
function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}
function PublicOnly({ children }) {
  return isAuthed() ? <Navigate to="/admin" replace /> : children;
}

// Dev helper
function DevLogin() {
  React.useEffect(() => {
    localStorage.setItem("token", "dev");
  }, []);
  return <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin login */}
        <Route path="/login" element={<ModernLogin brand="Ceylon Colony" />} />

        {/* Admin shell (protected) */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="admindashboard" replace />} />
          <Route path="admindashboard" element={<AdminDahboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="workshops" element={<WorkshopScheduleManagement />} />
          <Route path="orders" element={<OrderDeliveryManagement />} />
          <Route path="customer-media" element={<CustomerMediaManagement />} />
        </Route>

        {/* Dev helper */}
        <Route path="/dev-login" element={<DevLogin />} />

        {/* Root & fallback → always go to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />

        {/* Customer-facing pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<OurProducts />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </BrowserRouter>
  );
}
