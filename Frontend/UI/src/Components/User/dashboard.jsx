import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import UserSidebar from "./userDashboard/userSidebar";
import ProfileHub from "./userDashboard/profileHub";
import MyWorkshops from "./userDashboard/MyWorkshops";

const Dashboard = () => {
  return (
    <div className="fixed inset-0 flex flex-col bg-neutral-950 text-white">
      {/* Navbar fixed at top */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-black border-r border-neutral-800">
          <UserSidebar />
        </aside>

        {/* Main content (switches based on route) */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<ProfileHub />} />
            <Route path="workshops" element={<MyWorkshops />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
