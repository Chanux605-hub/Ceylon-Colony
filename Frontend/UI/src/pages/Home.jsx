// src/pages/Home.jsx
import React, { useState } from "react";
import Navbar from "../Components/User/navbar";
import HeroBanner from "../Components/User/HeroBanner";
import AboutBanner from "../Components/User/AboutBanner";        
import OurLatestProducts from "../Components/User/OurLatestProducts";
import WorkshopsBanner from "../Components/User/WorkshopsBanner";
import Footer from "../Components/User/Footer";

// ✅ Import modals
import SignupModal from "../Components/User/SignupModal";

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <Navbar />
      <HeroBanner onSignupClick={() => setShowSignup(true)} />
      <AboutBanner />
      <OurLatestProducts />
      <WorkshopsBanner />
      <Footer />

      {/* ✅ Signup modal still local to Home */}
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
    </>
  );
}
