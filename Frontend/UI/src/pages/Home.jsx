import React, { useState } from "react";
import Navbar from "../Components/User/navbar";
import HeroBanner from "../Components/User/HeroBanner";
import AboutBanner from "../Components/User/AboutBanner";        
import OurLatestProducts from "../Components/User/OurLatestProducts";
import WorkshopsBanner from "../Components/User/WorkshopsBanner";
import Footer from "../Components/User/Footer";

// ✅ Import modals
import LoginModal from "../Components/User/LoginModal";
import SignupModal from "../Components/User/SignupModal";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <Navbar />
      <HeroBanner onLoginClick={() => setShowLogin(true)} onSignupClick={() => setShowSignup(true)} />
      <AboutBanner />
      <OurLatestProducts />
      <WorkshopsBanner />
      <Footer />

      {/* ✅ Modals */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
    </>
  );
}