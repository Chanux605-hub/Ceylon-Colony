// src/components/products/ProductsHero.jsx
import React from "react";
import bg from "../../assets/background102.jpeg"; // change if you prefer another image

export default function ProductsHero() {
  return (
    <section className="relative overflow-hidden">
      {/* bg image + overlay for contrast */}
      <img
        src={bg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover blur-[2px] brightness-75 scale-105"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 md:py-20 text-center text-white">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#FFD95B] bg-white/10 border border-white/10 rounded-full px-3 py-1">
          Shop the Collection
        </span>

        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
          Discover <span className="text-[#FBB01A]">Pure Sri Lankan Honey</span>
        </h1>

        <p className="mt-3 max-w-2xl mx-auto text-white/85">
          From raw, single-origin jars to infused blends, skincare, and gift sets —
          curated for flavor, quality, and wellness.
        </p>

        <a
          href="#catalogue"
          className="mt-7 inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold bg-[#FBB01A] text-black shadow-md transition hover:opacity-90 hover:-translate-y-0.5"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
