import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart, MoreVertical, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo (2).png";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Ceylon Colony"
                className="h-12 w-auto select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                draggable="false"
              />
              <span className="hidden sm:inline text-2xl font-bold text-[#FBB01A]">
                Ceylon Colony
              </span>
            </Link>
          </div>

          {/* Center: Nav Links (desktop only) */}
          <div className="hidden lg:flex items-center space-x-8 font-medium">
            <Link to="/home" className="text-white hover:text-[#FBB01A]">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-[#FBB01A]">
              About Us
            </Link>
            <Link to="/blogs" className="text-white hover:text-[#FBB01A]">
              Blog
            </Link>
            <Link to="/workshops" className="text-white hover:text-[#FBB01A]">
              Workshops
            </Link>
            <Link to="/products" className="text-white hover:text-[#FBB01A]">
              Our Products
            </Link>
            <Link to="/community" className="text-white hover:text-[#FBB01A]">
              Community
            </Link>
          </div>

          {/* Right: Profile / Logout / Dropdown / Cart / Hamburger */}
          <div className="flex items-center gap-4 relative">
            {/* Cart (desktop only) */}
            <button className="relative hidden lg:block">
              <ShoppingCart className="w-6 h-6 text-white hover:text-[#FBB01A] transition" />
              <span className="absolute -top-2 -right-2 bg-[#FBB01A] text-black font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            {/* User profile + Logout */}
            {user && (
              <div className="flex items-center gap-2">
                <img
                  src={user.avatarUrl || "https://i.pravatar.cc/100?img=3"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-[#FBB01A] object-cover"
                />
                <div className="hidden md:flex flex-col max-w-[150px] truncate">
                  <span className="text-white text-sm font-semibold truncate">
                    {user.name || user.username}
                  </span>
                  <span className="hidden lg:block text-white/70 text-xs truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 px-4 py-1.5 rounded-full bg-[#FBB01A] text-black font-semibold hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            )}

            {/* 3-dot dropdown */}
            {user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-full hover:bg-white/10 transition"
                >
                  <MoreVertical className="w-6 h-6 text-white" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-neutral-900 text-white rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="flex flex-col items-center px-6 py-6 border-b border-neutral-700">
                      <img
                        src={user.avatarUrl || "https://i.pravatar.cc/100?img=3"}
                        alt={user.name}
                        className="w-20 h-20 rounded-full border-4 border-[#FBB01A] object-cover mb-3"
                      />
                      <p className="text-lg font-semibold text-[#FBB01A]">
                        {user.name || user.username}
                      </p>
                      <p className="text-sm text-gray-300">{user.email}</p>
                    </div>
                    <div className="p-4">
                      <Link
                        to="/dashboard"
                        className="block w-full text-center px-4 py-2 rounded-lg bg-[#FBB01A] text-black font-semibold hover:opacity-90 transition"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile hamburger (toggle drawer) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-white/10 transition"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="w-64 bg-neutral-900 h-full p-6 space-y-6">
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-white text-right block ml-auto mb-4"
            >
              ✕
            </button>
            <Link to="/home" className="block text-white hover:text-[#FBB01A]">
              Home
            </Link>
            <Link to="/about" className="block text-white hover:text-[#FBB01A]">
              About Us
            </Link>
            <Link to="/blogs" className="block text-white hover:text-[#FBB01A]">
              Blog
            </Link>
            <Link to="/workshops" className="block text-white hover:text-[#FBB01A]">
              Workshops
            </Link>
            <Link to="/products" className="block text-white hover:text-[#FBB01A]">
              Our Products
            </Link>
            <Link to="/community" className="block text-white hover:text-[#FBB01A]">
              Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
