import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard, Package, Boxes, BarChart3, Truck, Users, Settings, LogOut, Leaf, CalendarDays, Video,
} from "lucide-react";

import logo from "../../assets/logo (2).png"; // or .png/.jpg

const linkBase =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition";

const item = (to, label, Icon) => (
  <NavLink
    key={to}
    to={to}
    className={({ isActive }) =>
      `${linkBase} ${isActive ? "bg-white/10 text-[#FBB01A]" : "text-white/80 hover:bg-white/5 hover:text-white"}`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-[#0B0B0B] text-white border-r border-white/10">
      <div className="h-16 flex items-center px-4 border-b border-white/10">
      <Link to="/admin" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Ceylon Colony"
          className="h-10 w-auto object-contain select-none"
          draggable="false"
        />
        <span className="font-semibold">Ceylon Colony Admin</span>
      </Link>

      </div>

      <nav className="p-3 space-y-1">
        {item("/admin", "Overview", LayoutDashboard)}
        {item("/admin/products", "Products", Package)}
        {item("/admin/inventory", "Inventory", Boxes)}
        {item("/admin/stock-analysis", "Stock Analysis", BarChart3)}
        {item("/admin/suppliers", "Suppliers", Truck)}
        {item("/admin/customers", "Customers", Users)}
        {item("/admin/farm-harvest", "Farm & Harvest", Leaf)}
        {item("/admin/workshops", "Workshops", CalendarDays)} 
        {item("/admin/customer-media", "Customers Media", Video)}
      </nav>

      <div className="mt-auto p-3 space-y-1">
        {item("/admin/settings", "Settings", Settings)}
        <button className={`${linkBase} w-full text-white/70 hover:text-white hover:bg-white/5`}>
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
