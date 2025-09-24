import React from "react";
import bg from "../../assets/BlogHero.jpg"; 

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image + overlay */}
      <img
        src={bg}
        alt="Blog Banner"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover blur-[2px] brightness-75 scale-105"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-22 md:py-30 text-center text-white">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#FFD95B] bg-white/10 border border-white/10 rounded-full px-3 py-1">
          Latest Insights
        </span>

        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          Explore Our <span className="text-[#FBB01A]">Bee Blog</span>
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-lg text-white/85">
          Stories, tips, and updates from the world of honey — from beekeeping
          practices to health benefits and upcoming workshops.
        </p>
      </div>
    </section>
  );
}