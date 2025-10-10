// src/components/HeroBanner.jsx
import React, { useState } from "react";
// src/components/User/HeroBanner.jsx
import React from "react";
import herobanner from "../../assets/background102.jpeg";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// import the modals you created
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const HeroBanner = () => {
  const { user } = useAuth();  // ✅ auth state
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${herobanner})` }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col items-center text-center justify-center min-h-[60vh] sm:min-h-[70vh] py-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#FFD95B] bg-white/10 border border-white/10 rounded-full px-3 py-1">
            Pure • Local • Traceable
          </span>

          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white">
            Taste the <span className="text-[#FBB01A]">Quality</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/80">
            Premium Sri Lankan honey harvested with care and delivered fresh to your door.
          </p>

          {/* ✅ CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              // 🔹 Registered Customer
              <>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold bg-[#FBB01A] text-black shadow-md transition
                    hover:opacity-90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/60"
                >
                  Show Products
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold border border-white/20 text-white
                    bg-white/10 backdrop-blur-sm transition hover:bg-white/15 hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Learn More
                </Link>
              </>
            ) : (
              // 🔹 Visitor → trigger global modals
              <>
                <button
                  onClick={onLoginClick}   // ✅ use global login trigger
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold bg-[#FBB01A] text-black shadow-md transition
                    hover:opacity-90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/60"
                >
                  Login
                </button>

                <button
                  onClick={onSignupClick}   // ✅ still handled by Home.jsx
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold border border-white/20 text-white
                    bg-white/10 backdrop-blur-sm transition hover:bg-white/15 hover:-translate-y-0.5
                    focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Modals */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
    </section>
  );
};

export default HeroBanner;