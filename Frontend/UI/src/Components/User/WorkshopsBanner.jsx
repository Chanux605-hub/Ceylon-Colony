// src/components/WorkshopsBanner.jsx
import React from "react";
import workshopsBg from "../../assets/harvest.jpeg"; 
// ↑ Replace with your actual file (e.g. "../../assets/background102.jpeg")
// If this file is at src/components/WorkshopsBanner.jsx, "../../assets/..." is correct.
// If it's at src/components/navbar/WorkshopsBanner.jsx, use "../../../assets/...".

const WorkshopsBanner = () => {
  return (
    <section className="relative overflow-hidden text-white">
      {/* Background image with blur + dim */}
      <img
        src={workshopsBg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75 scale-105"
      />
      {/* Dark overlay for extra contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 flex flex-col items-center text-center">
        {/* Tag */}
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#FFD95B] bg-white/10 border border-white/10 rounded-full px-3 py-1">
          Workshops
        </span>

        {/* Heading */}
        <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
          Join Our <span className="text-[#FBB01A]">Beekeeping Workshops</span>
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/85">
          We run <strong>online sessions</strong> and <strong>farm-visit classes</strong> for beginners and aspiring
          entrepreneurs. Learn bee biology, hive setup, harvesting, safety, and how to launch a honey business.
        </p>

        {/* Two simple cards */}
        <div className="mt-8 grid gap-4 w-full sm:grid-cols-2">
          <InfoCard
            title="Online Workshops"
            desc="Live Zoom classes with Q&A, slides, and recordings."
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-5 3V5z"/>
              </svg>
            }
          />
          <InfoCard
            title="Farm-Visit Workshops"
            desc="Hands-on hive handling, tools, and harvesting techniques."
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l7 6v12a2 2 0 0 1-2 2h-3v-6H10v6H7a2 2 0 0 1-2-2V8l7-6z"/>
              </svg>
            }
          />
        </div>

        {/* Outcomes bullets */}
        <ul className="mt-6 grid gap-3 sm:grid-cols-3 text-sm text-white/85">
          {[
            "Beginner to business roadmap",
            "Certificate of completion",
            "Starter toolkit checklist",
          ].map((t) => (
            <li key={t} className="flex items-center justify-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FBB01A]" />
              {t}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/workshops"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold bg-[#FBB01A] text-black shadow-md transition
                       hover:opacity-90 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/60"
          >
            Join Workshop
          </a>
          <a
            href="/workshops/schedule"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold border border-white/20 text-white
                       bg-white/10 backdrop-blur-sm transition hover:bg-white/15 hover:-translate-y-0.5
                       focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            View Schedule
          </a>
        </div>
      </div>
    </section>
  );
};

function InfoCard({ title, desc, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111]/80 backdrop-blur p-5 text-left">
      <div
        className="mb-3 inline-grid place-items-center w-10 h-10 rounded-xl border border-[#FBB01A]/30"
        style={{ backgroundColor: "#FFF8E7", color: "#FBB01A" }}
      >
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-white/80 text-sm">{desc}</p>
    </div>
  );
}

export default WorkshopsBanner;
