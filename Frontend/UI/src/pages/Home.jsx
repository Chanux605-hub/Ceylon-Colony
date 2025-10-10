// src/pages/Home.jsx
import React, { useState } from "react";
import Navbar from "../Components/User/navbar";
import HeroBanner from "../Components/User/HeroBanner";
import AboutBanner from "../Components/User/AboutBanner";        
import OurLatestProducts from "../Components/User/OurLatestProducts";
import WorkshopsBanner from "../Components/User/WorkshopsBanner";
import Footer from "../Components/User/Footer";
import ColonyChatWidget from "../Components/User/chatbot";

// ✅ Import modals
import SignupModal from "../Components/User/SignupModal";
import LoginModal from "../Components/User/LoginModal";

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Navbar />
      <HeroBanner onLoginClick={() => setShowLogin(true)} onSignupClick={() => setShowSignup(true)} />
      <AboutBanner />
      <OurLatestProducts />
      <WorkshopsBanner />
      <ColonyChatWidget />
      <Footer />

      {/* ✅ Signup modal still local to Home */}
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
        <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}