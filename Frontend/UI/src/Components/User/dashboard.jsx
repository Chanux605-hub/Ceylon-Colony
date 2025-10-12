import React from "react";
import Navbar from "./navbar";
import UserSidebar from "./userDashboard/userSidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileHub from "./userDashboard/profileHub";
import OrdersPage from "./orderDetails";

const Dashboard = () => {
  return (
    <div className="fixed inset-0 flex flex-col bg-neutral-950">
      {/* Navbar fixed at top */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Sidebar + Content (fills the rest of screen) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fixed width */}
        <aside className="w-64 bg-black border-r border-neutral-800">
          <UserSidebar />
        </aside>

        {/* Main content scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfileHub />} />
            <Route path="orders" element={<OrdersPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
