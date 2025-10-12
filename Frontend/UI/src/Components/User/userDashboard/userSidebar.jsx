import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const UserSidebar = () => {
const { user } = useAuth(); // get user from context
  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-neutral-900 text-white shadow-lg">
    <div className="p-6 text-center border-b border-neutral-700">
      <img
        src={user?.avatarUrl || "https://i.pravatar.cc/100?img=3"}
        alt="Profile"
        className="w-16 h-16 rounded-full border-2 border-[#FBB01A] mx-auto object-cover"
      />
      <p className="mt-2 font-semibold text-white">{user?.name || "Guest User"}</p>
      <p className="text-sm text-gray-400">{user?.email || "No email"}</p>
    </div>

      <nav className="mt-6 flex flex-col gap-3 px-4">
        <Link to="/dashboard" className="hover:text-[#FBB01A]">Profile Hub</Link>
        <Link to="/dashboard/orders" className="hover:text-[#FBB01A]">My Orders</Link>
        <Link to="/dashboard/cart" className="hover:text-[#FBB01A]">Cart</Link>
        <Link to="/dashboard/uploads" className="hover:text-[#FBB01A]">My Uploads</Link>
        <Link to="/dashboard/workshops" className="hover:text-[#FBB01A]">My Workshops</Link>
        <Link to="/dashboard/notifications" className="hover:text-[#FBB01A]">Notifications</Link>
      </nav>
    </aside>
  );
};

export default UserSidebar;
