import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import Sidebar  from "./Sidebar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 h-14 bg-black/90 backdrop-blur flex items-center gap-3 px-4 border-b border-white/10">
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <Menu className="text-white" />
        </button>
        <Link to="/admin" className="font-semibold">Admin</Link>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Mobile drawer */}
        {open && (
          <div
            className="md:hidden fixed inset-0 z-50 flex"
            onClick={() => setOpen(false)}
          >
            <div className="w-64 bg-[#0B0B0B]" onClick={(e) => e.stopPropagation()}>
              <Sidebar />
            </div>
            <div className="flex-1 bg-black/50" />
          </div>
        )}

        {/* Content */}
        <main className="flex-1 md:ml-64">
          {/* Top header */}
          <div className="hidden md:flex items-center justify-between h-16 px-6 border-b border-white/10 bg-black/50 backdrop-blur fixed top-0 left-64 right-0 z-40">
            <div className="font-semibold">Dashboard</div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
                <input
                  className="pl-9 pr-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/40"
                  placeholder="Search…"
                />
              </div>
            </div>
          </div>

          {/* Routed content */}
          {/* Routed content (push below fixed header) */}
          <div className="p-6 pt-24">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
