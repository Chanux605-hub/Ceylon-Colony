// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Adjust this path to match your real file location:
import ModernLogin from "./Components/ModernLogin.jsx";
import Layout from "./Components/admin/Layout.jsx";
import Home from "./pages/Home.jsx";
import OurProducts from "./pages/OurProducts.jsx";


// Module pages (rendered inside Layout's <Outlet/>)
import ProductManagement from "./Components/admin/modules/AdminProducts.jsx";
import InventoryManagement from "./Components/admin/modules/AdminInventory.jsx";
import OrderDeliveryManagement from "./Components/admin/modules/OrderDeliveryManagement.jsx";
import WorkshopScheduleManagement from "./Components/admin/modules/WorkshopScheduleManagement.jsx";
import CustomerMediaManagement from "./Components/admin/modules/CustomerMediaManagement.jsx";
import OverviewPage from "./Components/admin/modules/OverviewPage.jsx";
import HarvestFarmManagement from "./Components/admin/modules/HarvestFarmManagement.jsx";


// --- Simple auth helpers ---
const isAuthed = () => !!localStorage.getItem("token");

function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}
function PublicOnly({ children }) {
  return isAuthed() ? <Navigate to="/admin" replace /> : children;
}
function AuthedRedirect() {
  return <Navigate to={isAuthed() ? "/admin" : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login (public only) */}
        <Route path="/login" element={<ModernLogin brand="Ceylon Colony" />} />

        {/* Admin shell (protected) */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview"  element={<OverviewPage />} />
          <Route path="products"  element={<ProductManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="workshops" element={<WorkshopScheduleManagement />} />
          <Route path="harvest"   element={<HarvestFarmManagement />} />
          <Route path="orders"    element={<OrderDeliveryManagement />} />
          <Route path="media"     element={<CustomerMediaManagement />} />
          <Route path="harvest" element={<HarvestFarmManagement />} />
        </Route>

        {/* Root & fallback */}
        <Route path="/" element={<AuthedRedirect />} />
        <Route path="*" element={<AuthedRedirect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<OurProducts />} />
      </Routes>
    </BrowserRouter>
  );
}
