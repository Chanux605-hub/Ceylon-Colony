// src/components/PromoBanner.jsx
import React, { useState } from "react";

export default function PromoBanner() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send to your API / email service
    console.log("Newsletter signup:", email);
    setEmail("");
    alert("Thanks! Your welcome voucher is on the way 🐝");
  };

  return (
    <section className="bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-[#FBB01A] p-8 md:p-10">
          {/* honeycomb texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(circle at 10px 10px, rgba(0,0,0,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          {/* decorative corners */}
          <div
            className="pointer-events-none absolute -left-10 bottom-0 w-48 h-48 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12px 12px, rgba(0,0,0,0.35) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              borderRadius: "32px",
            }}
          />
          <div
            className="pointer-events-none absolute -right-10 top-0 w-48 h-48 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12px 12px, rgba(0,0,0,0.35) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              borderRadius: "32px",
            }}
          />

          {/* content */}
          <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-black/70">
                Newsletter
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-black leading-snug">
                Get <span className="underline decoration-[#1A1A1A] decoration-4 underline-offset-4">20% off</span> your first order
              </h3>
              <p className="mt-2 text-black/80">
                Join our hive for seasonal drops, workshop dates, and exclusive tastings.
                No spam—unsubscribe anytime.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full md:justify-end">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-0 rounded-l-xl px-4 py-3 bg-white text-[#1A1A1A] placeholder:text-[#1A1A1A]/60 border border-black/20 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/40"
              />
              <button
                type="submit"
                className="rounded-r-xl px-5 py-3 font-semibold bg-[#1A1A1A] text-white hover:opacity-90 transition"
                aria-label="Subscribe"
              >
                Subscribe
              </button>
            </form>

            <p className="md:col-span-2 text-xs text-black/70">
              * Voucher applies to orders over Rs 2,500. One use per customer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
