import React from "react";
import Navbar from "../Components/User/navbar";
import ProductsHero from "../Components/User/ProductsHero";
import ProductCatalogue from "../Components/User/ProductCatalogue";
import PromoBanner from "../Components/User/PromoBanner";
import SkincareHowTo from "../Components/User/SkincareHowTo";
import Footer from "../Components/User/Footer";

export default function OurProducts() {
  return (
    <>
      <Navbar />
     <ProductsHero />
      <ProductCatalogue />
      <PromoBanner />
      <SkincareHowTo />
      <Footer />
    </>
  );
}
