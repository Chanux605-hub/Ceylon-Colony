import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ModernLogin from "./Components/ModernLogin.jsx";
import AdminLayout from "./Components/admin/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import OurProducts from "./pages/OurProducts.jsx";
import StoreContextProvider from "./context/StoreContext";

import Community from "./pages/Community.jsx";

import About from "./pages/About.jsx";
import Workshops from "./pages/Workshops.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import AdminProducts from "./Components/admin/modules/AdminProducts.jsx";
import AdminInventory from "./Components/admin/modules/AdminInventory.jsx";
import AdminStockAnalysis from "./Components/admin/modules/AdminStockAnalysis";
import OrderDeliveryManagement from "./Components/admin/modules/OrderDeliveryManagement.jsx";
import WorkshopScheduleManagement from "./Components/admin/modules/WorkshopScheduleManagement.jsx";
import CustomerMediaManagement from "./Components/admin/modules/CustomerMediaManagement.jsx";
import AdminDahboard from "./Components/admin/AdminDahboard.jsx";
import FarmRegistrationForm from "./HarvestManagement/FarmRegistrationForm.jsx";
import HiveRegistrationForm from "./HarvestManagement/HiveRegistration.jsx";
import FarmHarvestManagement from "./HarvestManagement/FarmHarvestManagement.jsx";
import Cart from "./Components/User/Cart.jsx";
import PlaceOrder from "./Components/User/PlaceOrder.jsx";
import AddBlogForm from "./HarvestManagement/Blog/AddBlogForm.jsx";
import ManageBlogs from "./HarvestManagement/Blog/ManageBlog.jsx";
import ProductDetails from "./pages/ProductDetails";
import AdminOrders from "./Components/admin/modules/AdminOrders.jsx";

// --- Simple auth helpers ---
const isAuthed = () => !!localStorage.getItem("token");

function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  return isAuthed() ? <Navigate to="/admin" replace /> : children;
}

function AuthedRedirect() {
  return <Navigate to={isAuthed() ? "/admin" : "/home"} replace />;
}

/* Dev helper for auto-login in dev environment */
function DevLogin() {
  React.useEffect(() => {
    localStorage.setItem("token", "dev");
  }, []);
  return <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <StoreContextProvider>
      <BrowserRouter>
        <Routes>
          {/* Login (public only) */}
          <Route path="/login" element={<ModernLogin brand="Ceylon Colony" />} />
          <Route path="cart" element={<Cart />} />

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
            <Route path="stock-analysis" element={<AdminStockAnalysis />} />
            <Route path="workshops" element={<WorkshopScheduleManagement />} />
            <Route path="orders" element={<OrderDeliveryManagement />} />
            <Route path="media" element={<CustomerMediaManagement />} />
            <Route path="allorders" element={<AdminOrders />} />
            <Route path="farm-harvest" element={<FarmHarvestManagement />} />
            <Route path="addblog" element={<AddBlogForm />} />
            <Route path="blogs" element={<ManageBlogs />} />
          </Route>

          {/* Dev login */}
          <Route path="/dev-login" element={<DevLogin />} />

          {/* Root & fallback */}
          <Route path="/" element={<AuthedRedirect />} />
          <Route path="*" element={<AuthedRedirect />} />

          {/* Public pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<OurProducts />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/farmRegistration" element={<FarmRegistrationForm />} />
          <Route path="/hiveRegistration" element={<HiveRegistrationForm />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="placeorder" element={<PlaceOrder />} />
        </Routes>
      </BrowserRouter>
    </StoreContextProvider>
  );
}
