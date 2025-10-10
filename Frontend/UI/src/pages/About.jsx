// src/pages/About.jsx
import React from "react";
import Navbar from "../Components/User/navbar";
import Footer from "../Components/User/Footer";
// Optional hero image (ensure this file exists: src/assets/about-hero.png)
import aboutHero from "../assets/about-hero2.jpg";
import storyImg from '../assets/about-1.jpg';
import storyImg2 from '../assets/about-2.jpg';
import storyImg3 from '../assets/about-3.jpg';
import team1 from '../assets/about-4.jpg';
import team2 from '../assets/about-5.jpg';
import team3 from '../assets/about-6.jpg';

export default function About() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Navbar */}
      <Navbar />

      {/* HERO (taller, text position unchanged) */}
      <section
        className="relative isolate"
        style={{
          // tweak these two to control hero height
          "--hero-h": "50vh",
          "--hero-min": "400px",
        }}
      >
        {/* Background image */}
        <img
          src={aboutHero}
          alt=""
          className="absolute inset-0 w-full h-[var(--hero-h)] min-h-[var(--hero-min)] object-cover object-center"
        />
        {/* Dark overlay + bottom gradient blending into WHITE */}
        <div className="absolute inset-0 bg-black/55" />
        

        {/* Content (remains centered regardless of hero height) */}
        <div className="relative mx-auto flex h-[var(--hero-h)] min-h-[var(--hero-min)] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              About <span className="text-amber-500">Ceylon Colony</span>
            </h1>
            <p className="mt-3 mx-auto max-w-2xl text-sm md:text-base text-white/85">
              Pure, ethical, and traceable honey — from our island hives to your table.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <a
                href="/shop"
                className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                Shop Honey
              </a>
              <a
                href="/workshops"
                className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                Explore Workshops
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8">

        {/* STATS (header + 4 cards, no icons) */}
        <section className="pt-3 pb-10 bg-neutral-50 mb-10">
        <div className="mx-auto max-w-7xl px-4">
            {/* Header */}
            <div className="text-center mb-4">
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 ring-1 ring-amber-500/20">
                Our Highlights
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-stone-900">
                Ceylon Colony at a Glance
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
                A quick snapshot of our scale and impact.
            </p>
            </div>

            {/* Cards */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
                { n: "01", v: "07+",  k: "Years Beekeeping",  d: "Hands-on work across Sri Lankan microclimates." },
                { n: "02", v: "100+", k: "Active Hives",      d: "Managed colonies with bee-first harvesting." },
                { n: "03", v: "12K+", k: "Bottles Shipped",   d: "Small-batch, moisture-checked, traceable." },
                { n: "04", v: "50+",  k: "Workshops Hosted",  d: "Community training & safety best practices." },
            ].map((s) => (
                <article
                key={s.k}
                className="relative overflow-hidden rounded-2xl bg-white p-5 text-left shadow-lg ring-1 ring-black/5 transition hover:shadow-xl"
                >
                {/* faint watermark number */}
                <div className="pointer-events-none absolute right-3 top-2 select-none text-4xl font-extrabold leading-none text-neutral-200/70">
                    {s.n}
                </div>

                <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-extrabold text-amber-500">{s.v}</div>
                    <h3 className="text-2xs font-semibold text-neutral-600">{s.k}</h3>
                </div>

                <p className="mt-3 text-sm text-neutral-600">{s.d}</p>
                <div className="mt-4 h-[3px] rounded-full bg-amber-500" />
                </article>
            ))}
            </div>
        </div>
        </section>


        

        {/* OUR STORY (light) — with image on the right */}
        <section className="mt-20 grid items-center gap-6 md:grid-cols-2">
        {/* Left: Story card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-amber-500">Our Story</h2>

            <p className="mt-3 text-stone-700">
                Ceylon Colony began with a simple idea:{" "}
                <span className="font-medium text-[#fbb01a]">treat bees and people fairly</span>. We work
                shoulder-to-shoulder with smallholder beekeepers across Sri Lanka—from wet-zone forests to
                dry-zone plains—sharing methods that protect pollinators and preserve the character of each
                bloom.
            </p>

            <p className="mt-4 text-stone-700">
                We invest in forage gardens and community education, reduce plastic in our supply chain, and
                encourage bee-safe practices around homes and farms. Our workshops help new keepers start safely,
                and our lab checks keep moisture, purity, and aroma true to Sri Lankan terroir.
            </p>

            {/* original bullet list retained */}
            <ul className="mt-4 space-y-2 text-stone-700">
                <li>• Island-grown floral profiles (coconut, cinnamon, wildflower)</li>
                <li>• Cold-filtered; no artificial additives</li>
                <li>• Third-party quality checks &amp; moisture testing</li>
                <li>• Bee-first harvesting (only capped honey; leave feed for colonies)</li>
                
            </ul>
        </div>


        {/* Right: Overlapped Images */}
        <figure className="relative overflow-visible">
        {/* large/back image */}
        <img
            src={storyImg2}   
            alt="Beekeeping family and apiary"
            className="w-full rounded-2xl object-cover aspect-[4/3] md:aspect-[16/12]
                    shadow-lg ring-1 ring-black/5 border border-neutral-200"
        />

        {/* small/front image overlapping bottom-right */}
        <img
            src={storyImg}  // import or /public path
            alt="Consultation with beekeepers"
            className="absolute -bottom-6 -right-6 w-[65%] md:w-[58%]
                    aspect-[4/3] rounded-xl object-cover
                    shadow-xl ring-2 ring-black/5 border border-neutral-200 bg-white"
        />
        </figure>

        </section>

      </main>

        {/* ---------- WORKSHOPS BAND ---------- */}
        <section
        className="relative isolate w-full mt-10"
        style={{
            // tweak these to taste
            "--band-h": "44vh",   
            "--band-min": "320px" 
        }}
        >
        {/* Background image with light blur */}
        <img
            src={storyImg3}
            alt="Beekeeping workshop background"
            className="absolute inset-0 h-[var(--band-h)] min-h-[var(--band-min)] w-full object-cover blur-[1px] brightness-75"
        />

        {/* Gentle overlay for readability */}
        <div className="absolute inset-0 h-[var(--band-h)] min-h-[var(--band-min)] bg-black/60" />

        

        {/* Content */}
        <div className="relative mx-auto flex h-[var(--band-h)] min-h-[var(--band-min)] max-w-7xl items-center justify-center px-4">
            <div className="text-center text-white max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                Our Workshops
            </span>

            <h2 className="mt-3 text-2xl md:text-4xl font-extrabold leading-tight">
                Learn, practice, and connect with
                <span className="text-[#fbb01a]"> beekeepers</span>
            </h2>

            <p className="mt-2 text-sm md:text-base text-white/85">
                Short, hands-on sessions covering hive setup, seasonal care, safe harvesting,
                and quality standards — ideal for beginners and curious enthusiasts.
            </p>

            <a
                href="/workshops"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#fbb01a] px-5 py-2 font-semibold text-black hover:brightness-95"
            >
                Learn more
            </a>
            </div>
        </div>
        </section>

        {/* TEAM (photos + centered heading, using imports) */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-8 mt-10">
        {/* Header */}
        <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-[#fbb01a]/10 px-3 py-1 text-xs font-semibold text-[#fbb01a] ring-1 ring-[#fbb01a]/20">
            Our Team
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-stone-900">Meet the Team</h2>
        </div>

        {/* Cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
            { name: "Amal Perera",        role: "Head Beekeeper",    img: team1,    alt: "Amal Perera portrait" },
            { name: "Kavindi Jayasuriya", role: "Quality & Training", img: team2, alt: "Kavindi Jayasuriya portrait" },
            { name: "Ruwan Senanayake",   role: "Operations",         img: team3,   alt: "Ruwan Senanayake portrait" },
            ].map((m) => (
            <article
                key={m.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                    src={m.img}
                    alt={m.alt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = placeholderImg; }}
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
                </div>

                {/* Text */}
                <div className="p-5 text-center">
                <h3 className="text-base font-semibold text-stone-900">{m.name}</h3>
                <p className="text-sm text-neutral-600">{m.role}</p>
                <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#fbb01a] transition-all duration-300 group-hover:w-20" />
                </div>
            </article>
            ))}
        </div>
        </section>

        {/* Footer */}
      <Footer />


    </div>
  );
}

/* ---------- tiny components (light) ---------- */
function ValueCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="inline-flex items-center gap-2 rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
        ● <span>{title}</span>
      </div>
      <p className="mt-2 text-sm text-stone-700">{desc}</p>
    </div>
  );
}
