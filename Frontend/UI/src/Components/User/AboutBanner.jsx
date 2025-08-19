// src/components/AboutBannerSimple.jsx
import React from "react";

// images from src/assets (filenames must match exactly)
import imgBee from "../../assets/bee101.jpeg";
import imgComb from "../../assets/comb.jpeg";
import imgDownload9 from "../../assets/download (9).jpeg"; // if possible, rename to download-9.jpeg
import imgJar from "../../assets/jar.jpeg";

const AboutBanner = () => {
  const images = [imgBee, imgComb, imgDownload9, imgJar];

  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 flex flex-col items-center text-center">
        {/* Tag */}
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#F28C28] bg-[#FFF8E7] border border-[#FBB01A]/30 rounded-full px-3 py-1">
          About Us
        </span>

        {/* Heading */}
        <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[#1A1A1A]">
          Natural Honey, Crafted with Care
        </h2>

        {/* Paragraph */}
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-[#1A1A1A]/80">
          From ethical beekeeping to gentle extraction, we deliver pure, traceable
          honey with full flavor and nutrition — straight from hive to jar.
        </p>

        {/* 4-image grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {images.map((src, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition"
            >
              <img
                src={src}
                alt={`About Ceylon Colony ${i + 1}`}
                className="w-full h-40 md:h-48 object-cover hover:scale-105 transition"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-12 grid sm:grid-cols-3 gap-8 w-full">
          <Feature title="Pure & Lab-tested" desc="Every batch is quality checked." />
          <Feature title="Sustainable Beekeeping" desc="We protect local bee habitats." />
          <Feature title="No Additives" desc="Just 100% natural honey." />
        </div>
      </div>
    </section>
  );
};

function Feature({ title, desc }) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* simple inline hex icon (no library) */}
      <div
        className="w-12 h-12 grid place-items-center rounded-xl border border-[#FBB01A]/30"
        style={{ backgroundColor: "#FFF8E7", color: "#FBB01A" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7.5 3.5L3 9l4.5 5.5h9L21 9l-4.5-5.5h-9z" />
        </svg>
      </div>
      <h4 className="mt-3 font-semibold text-[#1A1A1A]">{title}</h4>
      <p className="text-sm text-[#1A1A1A]/70">{desc}</p>
    </div>
  );
}

export default AboutBanner;
