import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Adjust this path to match your real file location:
import ModernLogin from "./Components/ModernLogin.jsx";
import AdminLayout from "./Components/admin/AdminLayout.jsx";
import Home from "./pages/Home.jsx"
import OurProducts from "./pages/OurProducts.jsx"
import Community from "./pages/Community.jsx"

// Module pages (rendered inside Layout's <Outlet/>)
import AdminProducts from "./Components/admin/modules/AdminProducts.jsx";
import AdminInventory from "./Components/admin/modules/AdminInventory.jsx";
import OrderDeliveryManagement from "./Components/admin/modules/OrderDeliveryManagement.jsx";
import WorkshopScheduleManagement from "./Components/admin/modules/WorkshopScheduleManagement.jsx";
import CustomerMediaManagement from "./Components/admin/modules/CustomerMediaManagement.jsx";
import AdminDahboard from "./Components/admin/AdminDahboard.jsx";
//import HarvestFarmManagement from "./Components/admin/modules/HarvestFarmManagement.jsx";




import ProductDetails from "./pages/ProductDetails";



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

 {/* Done by Gima - do not delete this is for admin page acess in web browser */}
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
        {/* Login (public only) */}
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
          <Route path="admindashboard"  element={<AdminDahboard />} />
          <Route path="products"  element={<AdminProducts />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="workshops" element={<WorkshopScheduleManagement />} />
        
          <Route path="orders"    element={<OrderDeliveryManagement />} />
          <Route path="media"     element={<CustomerMediaManagement />} />
        
        </Route>

          
       {/* Done by Gima - do not delete this is for admin page acess in web browser */}
     {/* Dev helper route (remove later if you want) */}
        <Route path="/dev-login" element={<DevLogin />} />



        {/* Root & fallback */}
        <Route path="/" element={<AuthedRedirect />} />
        <Route path="*" element={<AuthedRedirect />} />

        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<OurProducts />} />
        <Route path="/community" element={<Community />} />


         <Route path="/product/:id" element={<ProductDetails />} />

      </Routes>
    </BrowserRouter>
  );
}