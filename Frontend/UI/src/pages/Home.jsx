import React from "react";
import Navbar from "../Components/User/navbar";
import HeroBanner from "../Components/User/HeroBanner";
import AboutBanner from "../Components/User/AboutBanner";        
import OurLatestProducts from "../Components/User/OurLatestProducts";
import WorkshopsBanner from "../Components/User/WorkshopsBanner";
import Footer from "../Components/User/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <AboutBanner />
      <OurLatestProducts />
      <WorkshopsBanner />
      <Footer />
    </>
  );
}
