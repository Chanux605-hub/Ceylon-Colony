// src/pages/About.jsx
import React from "react";
// Optional hero image (ensure this file exists: src/assets/about-hero.png)
import aboutHero from "../assets/about-hero1.png";

export default function About() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* HERO */}
      <section className="relative isolate">
        {/* Background image (optional) */}
        <img
          src={aboutHero}
          alt=""
          className="absolute inset-0 h-[42vh] w-full object-cover object-center opacity-80"
        />
        {/* Dark overlay + bottom gradient */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-950/95 to-transparent" />

        <div className="relative mx-auto flex h-[42vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              About <span className="text-yellow-400">Ceylon Colony</span>
            </h1>
            <p className="mt-3 mx-auto max-w-2xl text-sm md:text-base text-neutral-300">
              Pure, ethical, and traceable honey — from our island hives to your table.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <a
                href="/shop"
                className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-black hover:brightness-95"
              >
                Shop Honey
              </a>
              <a
                href="/workshops"
                className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold ring-1 ring-neutral-700 hover:ring-yellow-500/40"
              >
                Explore Workshops
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8">
        {/* QUICK STATS */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { k: "Years Beekeeping", v: "07+" },
            { k: "Active Hives", v: "100+" },
            { k: "Bottles Shipped", v: "12K+" },
            { k: "Workshops Hosted", v: "50+" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-center"
            >
              <div className="text-2xl font-bold text-yellow-400">{s.v}</div>
              <div className="mt-1 text-xs text-neutral-400">{s.k}</div>
            </div>
          ))}
        </section>

        {/* OUR STORY */}
        <section className="mt-10 grid items-center gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
            <h2 className="text-xl font-semibold">Our Story</h2>
            <p className="mt-3 text-neutral-300">
              Ceylon Colony began with a simple idea:{" "}
              <span className="text-yellow-300">treat bees and people fairly</span>. We partner with
              smallholder beekeepers across Sri Lanka, training them on safe, sustainable practices and
              guaranteeing a fair price for every harvest.
            </p>
            <p className="mt-3 text-neutral-300">
              Every batch is gently filtered, never over-processed, and fully traceable. Scan any jar to
              see its farm, flora, and harvest date.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>• Island-grown floral profiles (coconut, cinnamon, wildflower)</li>
              <li>• Cold-filtered; no artificial additives</li>
              <li>• Third-party quality checks & moisture testing</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
            <h3 className="text-sm font-semibold text-neutral-300">What we stand for</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ValueCard title="Pure & Raw" desc="Unheated, unblended, and true to source." />
              <ValueCard title="Sustainable" desc="Bee-first practices and local biodiversity." />
              <ValueCard title="Fair to Farmers" desc="Training + guaranteed pricing for partners." />
              <ValueCard title="Quality & Safety" desc="Batch testing, HACCP handling, clear labeling." />
            </div>
          </div>
        </section>

        {/* WORKSHOPS CALLOUT */}
        <section className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Community & Workshops</h2>
              <p className="mt-2 max-w-2xl text-neutral-300">
                Learn beekeeping basics, harvesting techniques, and quality standards. Our trainers are
                experienced apiarists hosting sessions monthly.
              </p>
            </div>
            <a
              href="/workshops"
              className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:brightness-95"
            >
              View Schedule
            </a>
          </div>

          {/* Mini list to mirror your admin style */}
          <div className="mt-5 overflow-hidden rounded-xl border border-neutral-800">
            <table className="w-full table-auto text-sm">
              <thead className="bg-neutral-900/70 text-neutral-400">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Title</th>
                  <th className="px-3 py-2 text-left font-medium">Next Date</th>
                  <th className="px-3 py-2 text-left font-medium">Trainer</th>
                  <th className="px-3 py-2 text-left font-medium">Fill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {[
                  { t: "Intro to Beekeeping", d: "2025-09-05", tr: "Amal", f: "24/30", pct: 80 },
                  { t: "Harvest Techniques", d: "2025-09-12", tr: "Kavindi", f: "21/25", pct: 84 },
                  { t: "Quality & Safety", d: "2025-09-19", tr: "Ruwan", f: "16/20", pct: 80 },
                ].map((w) => (
                  <tr key={w.t}>
                    <td className="px-3 py-2">{w.t}</td>
                    <td className="px-3 py-2">{w.d}</td>
                    <td className="px-3 py-2">{w.tr}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-40 rounded-full bg-neutral-800">
                          <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${w.pct}%` }} />
                        </div>
                        <span className="text-neutral-400">{w.f}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* TEAM */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Meet the Team</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { name: "Amal Perera", role: "Head Beekeeper" },
              { name: "Kavindi Jayasuriya", role: "Quality & Training" },
              { name: "Ruwan Senanayake", role: "Operations" },
            ].map((m) => (
              <div
                key={m.name}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-800 ring-1 ring-neutral-700">
                    <span className="text-yellow-400">{m.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-sm text-neutral-400">{m.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 to-neutral-900/60 p-6">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Have questions or wholesale inquiries?</h2>
              <p className="mt-1 text-neutral-300">
                We’d love to collaborate with cafes, retailers, and communities.
              </p>
            </div>
            <a
              href="/contact"
              className="rounded-full bg-yellow-400 px-6 py-2 text-sm font-semibold text-black hover:brightness-95"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- tiny components ---------- */
function ValueCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="inline-flex items-center gap-2 rounded-lg bg-yellow-400/10 px-2 py-1 text-xs font-semibold text-yellow-400 ring-1 ring-yellow-500/20">
        ● <span>{title}</span>
      </div>
      <p className="mt-2 text-sm text-neutral-300">{desc}</p>
    </div>
  );
}
