import React from "react";
import { ShoppingCart, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo (2).png";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); // ✅ get from context

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
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

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            <Link to="/home" className="text-white hover:text-[#FBB01A]">Home</Link>
            <a href="#" className="text-white hover:text-[#FBB01A] transition">About Us</a>
            <a href="#" className="text-white hover:text-[#FBB01A] transition">Blog</a>
            <a href="#" className="text-white hover:text-[#FBB01A] transition">WorkShops</a>
            <Link to="/products" className="text-white hover:text-[#FBB01A] transition">Our Products</Link>
            <Link to="/community" className="text-white hover:text-[#FBB01A]">Community</Link>

            {/* Cart snapped next to Community */}
            <button className="relative">
              <ShoppingCart className="w-6 h-6 text-white hover:text-[#FBB01A] transition" />
              <span className="absolute -top-2 -right-2 bg-[#FBB01A] text-black font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full">
                3
              </span>
            </button>
          </div>

          {/* User profile + Logout */}
          <div className="flex items-center space-x-1">
            {user && (
              <div className="flex items-center  pl-4 gap-2">
                <img
                  src={user.avatarUrl || "https://i.pravatar.cc/100?img=3"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-[#FBB01A] object-cover"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="text-white text-sm font-semibold">
                    {user.name || user.username}
                  </span>
                  <span className="text-white/70 text-xs">{user.email}</span>
                </div>
                {/* Styled logout button */}
                <button
                  onClick={logout}
                  className="ml-3 px-4 py-1.5 rounded-full bg-[#FBB01A] text-black font-semibold hover:opacity-90 hover:-translate-y-0.5 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
