import React from 'react'
import { ShoppingCart, Menu } from 'lucide-react';
import { Link } from "react-router-dom";
import logo from "../../assets/logo (2).png";

const Navbar = () => {
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
            {/* keep wordmark if you want image + text */}
            <span className="hidden sm:inline text-2xl font-bold text-[#FBB01A]">
              Ceylon Colony
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex space-x-8 font-medium">
             <Link to="/home" className="text-white hover:text-[#FBB01A]">Home</Link>
                        <Link to="/products"
                          className="text-white hover:text-[#FBB01A] transition"
                        > Our Products </Link>
            <a href="#" className="text-white hover:text-[#FBB01A] transition">About Us</a>
            <a href="#" className="text-white hover:text-[#FBB01A] transition">Blog</a>
            <a href="#" className="text-white hover:text-[#FBB01A] transition">WorkShops</a>
            <Link to="/products" className="text-white hover:text-[#FBB01A] transition" > Our Products </Link>
          </div>

          {/* Search + Cart */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              className="hidden sm:block px-3 py-1 rounded-md border border-[#FBB01A] bg-black text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
            />
            <button className="relative">
              <ShoppingCart className="w-6 h-6 text-white hover:text-[#FBB01A] transition" />
              <span className="absolute -top-2 -right-2 bg-[#FBB01A] text-black font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full">
                3
              </span>
            </button>
            <button className="md:hidden">
              <Menu className="w-6 h-6 text-white hover:text-[#FBB01A] transition" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
