import React from "react";
import Navbar from "./navbar";
import UserSidebar from "./userDashboard/userSidebar";
import ProfileHub from "./userDashboard/profileHub";
import FarmOwnerProfile from "../../HarvestManagement/FarmOwnerProfile"; // ✅ Correct path
import { useAuth } from "../../context/AuthContext"; // ✅ Updated path

const Dashboard = () => {
  const { user } = useAuth(); // ✅ Must be inside component

  // ✅ Loading or missing user
  if (!user) {
    return <div className="text-white p-4">Loading user...</div>;
  }

  // ✅ If user is farm owner — show only their profile page (no navbar/sidebar)
  if (user.role === "farmOwner") {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <FarmOwnerProfile />
      </div>
    );
  }

  // ✅ Default layout (Navbar + Sidebar + ProfileHub)
  return (
    <div className="fixed inset-0 flex flex-col bg-neutral-950">
      {/* Navbar fixed at top */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fixed width */}
        <aside className="w-64 bg-black border-r border-neutral-800">
          <UserSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 text-white">
          <ProfileHub />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
