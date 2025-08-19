// src/components/products/SkincareHowTo.jsx
import React, { useState } from "react";
import skincareBg from "../../assets/skin2.jpeg"; // <- replace with your bg image

// helper to resolve images in src/assets (this file is in src/components/products)
const asset = (file) => new URL(`../../assets/${file}`, import.meta.url).href;

// map each tab to a small product image
const IMAGES = {
  lip: asset("honey lip scrub.jpg"),   // rename to "honey-lip-scrub.jpg" if you can
  serum: asset("honeyserump2.jpeg"),
  mask: asset("jar.jpeg"),             // put your mask product image here when you have it
};

const TABS = [
  {
    key: "lip",
    title: "Honey Lip Scrub",
    blurb: "Gently smooth and hydrate dry lips with our honey sugar polish.",
    steps: [
      "On clean lips, apply a pea-sized amount.",
      "Massage in small circles for 30–60 seconds.",
      "Wipe off with a warm damp cloth.",
      "Finish with a balm to seal.",
    ],
  },
  {
    key: "serum",
    title: "Honey Glow Serum",
    blurb: "Daily booster for bounce and brightness with a light, non-sticky finish.",
    steps: [
      "After cleansing, pat skin slightly dry.",
      "Apply 3–4 drops across face and neck.",
      "Press in gently—don’t rub.",
      "AM: follow with moisturizer + SPF.",
    ],
  },
  {
    key: "mask",
    title: "Soothing Honey Mask",
    blurb: "Calm, soft, dewy skin in 10 minutes—great for sensitive days.",
    steps: [
      "On clean skin, spread a thin even layer.",
      "Leave on 10–15 minutes.",
      "Rinse with lukewarm water; pat dry.",
      "Use 2–3× per week.",
    ],
  },
];

export default function SkincareHowTo() {
  const [active, setActive] = useState(TABS[0].key);
  const current = TABS.find((t) => t.key === active) || TABS[0];
  const currentImg = IMAGES[current.key] || asset("jar.jpeg");

  return (
    <section className="relative overflow-hidden text-white">
      {/* blurred background */}
      <img
        src={skincareBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75 scale-105"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-12">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#FFD95B] bg-white/10 border border-white/10 rounded-full px-3 py-1">
            Skincare Guide
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">
            How to use our honey skincare
          </h2>
          <p className="mt-2 text-white/85">
            Honey is naturally humectant and soothing—here’s how to get the most from it.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={`rounded-full px-4 py-2 text-sm border transition ${
                active === t.key
                  ? "bg-[#FBB01A] text-black border-transparent"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/15"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="mt-6 rounded-2xl border border-white/15 overflow-hidden backdrop-blur-sm">
          <div className="bg-[#1A1A1A]/90 text-white px-6 py-5 flex items-center gap-3">
            {/* product thumbnail */}
            <img
              src={currentImg}
              alt={current.title}
              className="w-10 h-10 rounded-md object-cover ring-2 ring-white/20"
              loading="lazy"
            />
            <div className="font-semibold">{current.title}</div>
          </div>

          {/* light content for readability */}
          <div className="bg-white/95 px-6 py-6 text-[#1A1A1A]">
            <p className="text-[#1A1A1A]/85">{current.blurb}</p>

            {/* Steps */}
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {current.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-none w-7 h-7 rounded-full grid place-items-center text-sm font-bold text-black"
                    style={{ backgroundColor: "#FBB01A" }}
                  >
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            {/* Tips */}
            <div className="mt-6 rounded-xl bg-[#FFF8E7] border border-[#FBB01A]/30 p-4 text-sm">
              <strong className="text-[#F28C28]">Tips:</strong> Patch test first, avoid the eye area, and discontinue if irritation occurs.
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/products#skincare"
                className="inline-flex items-center rounded-full px-5 py-2.5 font-semibold bg-[#FBB01A] text-black hover:opacity-90 transition"
              >
                Shop Skincare
              </a>
              <a
                href="/workshops"
                className="inline-flex items-center rounded-full px-5 py-2.5 font-semibold border border-white/20 text-white bg-white/0 hover:bg-white/10"
              >
                Learn in a Workshop
              </a>
            </div>
          </div>
        </div>

        {/* Why honey works */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Humectant", "Attracts and locks in moisture for soft, bouncy skin."],
            ["Soothing", "Naturally calming—great for stressed, post-sun skin."],
            ["Purity", "Lab-tested batches; no parabens, SLS, or mineral oil."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/15 bg-white/95 p-5 text-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <span className="inline-grid place-items-center w-6 h-6 rounded-md" style={{ backgroundColor: "#FBB01A" }}>
                  ★
                </span>
                <h4 className="font-semibold">{title}</h4>
              </div>
              <p className="mt-2 text-sm text-[#1A1A1A]/75">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
