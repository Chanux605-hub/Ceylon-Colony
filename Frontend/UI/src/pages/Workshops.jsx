// src/pages/Workshops.jsx
import React, { useMemo, useState } from "react";

import workshop1 from "../assets/workshop1.jpg";
import workshop2 from "../assets/workshop2.jpg";
import workshop3 from "../assets/workshop3.jpg";
import workshop4 from "../assets/workshop4.jpg";
import aboutHero from "../assets/about-hero2.jpg";

export default function Workshops() {
  // ---------- MOCK DATA (frontend only) ----------
  const data = useMemo(
    () => [
      {
        id: "w1",
        title: "Intro to Beekeeping",
        date: "2025-09-05",
        time: "9:00 AM – 12:00 PM",
        duration: "3h",
        level: "Beginner",
        location: "Kandy",
        price: 4000,
        capacity: 30,
        seatsTaken: 24,
        cover: workshop1,
        blurb:
          "Start safely: hive parts, protective gear, bee behavior, and seasonal care basics.",
      },
      {
        id: "w2",
        title: "Harvest Techniques",
        date: "2025-09-12",
        time: "10:00 AM – 1:30 PM",
        duration: "3.5h",
        level: "Intermediate",
        location: "Gampaha",
        price: 5500,
        capacity: 25,
        seatsTaken: 21,
        cover: workshop2,
        blurb:
          "Hands-on uncapping, extraction, filtering, moisture checks, and food safety tips.",
      },
      {
        id: "w3",
        title: "Quality & Safety",
        date: "2025-09-19",
        time: "2:00 PM – 5:00 PM",
        duration: "3h",
        level: "All Levels",
        location: "Matara",
        price: 4500,
        capacity: 20,
        seatsTaken: 16,
        cover: workshop3,
        blurb:
          "From hive to jar: hygiene, HACCP handling, labeling, and traceability best practices.",
      },
      {
        id: "w4",
        title: "Bee Garden Basics",
        date: "2025-10-03",
        time: "9:00 AM – 11:30 AM",
        duration: "2.5h",
        level: "Beginner",
        location: "Kurunegala",
        price: 3500,
        capacity: 28,
        seatsTaken: 12,
        cover: workshop4,
        blurb:
          "Planting for nectar flow, water access, and safe siting to keep happy, healthy colonies.",
      },
    ],
    []
  );

  // ---------- UI STATE ----------
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [location, setLocation] = useState("All");
  const [date, setDate] = useState("");

  const [openId, setOpenId] = useState(null);       // details modal
  const open = data.find((w) => w.id === openId) || null;

  const [booking, setBooking] = useState(null);     // booking modal (workshop object or null)

  // ---------- DERIVED LIST (simple filters) ----------
  const list = data.filter((w) => {
    const q = query.trim().toLowerCase();
    const passQ =
      !q ||
      w.title.toLowerCase().includes(q) ||
      w.blurb.toLowerCase().includes(q) ||
      w.location.toLowerCase().includes(q);
    const passL = level === "All" || w.level === level;
    const passLoc = location === "All" || w.location === location;
    const passDate = !date || w.date >= date; // naive filter: from selected date forward
    return passQ && passL && passLoc && passDate;
  });

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* ---------- HERO (screen-wide band) ---------- */}
      <section
        className="relative isolate w-full"
        style={{ "--band-h": "46vh", "--band-min": "340px" }}
      >
        <img
          src={aboutHero}
          alt="Beekeeping workshops"
          className="absolute inset-0 h-[var(--band-h)] min-h-[var(--band-min)] w-full object-cover brightness-75"
        />
        <div className="absolute inset-0 h-[var(--band-h)] min-h-[var(--band-min)] bg-black/45" />

        <div className="relative mx-auto flex h-[var(--band-h)] min-h-[var(--band-min)] max-w-7xl items-center justify-center px-4">
          <div className="text-center text-white max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              Ceylon Colony
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
              Beekeeping <span className="text-[#fbb01a]">Workshops</span>
            </h1>
            <p className="mt-3 text-white/85">
              Learn ethical, hands-on methods—hive setup, seasonal care, safe harvesting, and
              quality standards. Beginner-friendly and community-focused.
            </p>
            <a
              href="#workshops"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#fbb01a] px-6 py-3 font-semibold text-black hover:brightness-95"
            >
              View sessions
            </a>
          </div>
        </div>
      </section>

      <main id="workshops" className="mx-auto max-w-7xl px-4 pt-8 pb-16">
        {/* ---------- FILTERS (pure UI) ---------- */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
              <span aria-hidden>🔎</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title, location…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
            </div>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none"
            >
              <option>All</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>All Levels</option>
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none"
            >
              <option>All</option>
              <option>Kandy</option>
              <option>Gampaha</option>
              <option>Matara</option>
              <option>Kurunegala</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none"
            />
          </div>
        </section>

        {/* ---------- LIST (cards) ---------- */}
        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((w) => {
            const pct = Math.round((w.seatsTaken / w.capacity) * 100);
            const spotsLeft = w.capacity - w.seatsTaken;

            return (
              <article
                key={w.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Cover */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={w.cover}
                    alt={w.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/workshops/placeholder.jpg";
                    }}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold ring-1 ring-black/5">
                    {w.level}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-stone-900">{w.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{w.blurb}</p>

                  <div className="mt-3 grid gap-1 text-sm text-neutral-700">
                    <div>📅 {w.date} — {w.time} ({w.duration})</div>
                    <div>📍 {w.location}</div>
                    <div>
                      💰 {w.price.toLocaleString()} LKR{" "}
                      <span className="text-neutral-500">(per person)</span>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <span>Spots</span>
                      <span>{w.seatsTaken}/{w.capacity}</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-neutral-200">
                      <div
                        className="h-2 rounded-full bg-[#fbb01a]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-neutral-600">
                      {spotsLeft > 0 ? `${spotsLeft} seats left` : "Full — join waitlist"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setOpenId(w.id)}
                      className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setBooking(w)}
                      className="inline-flex items-center justify-center rounded-full bg-[#fbb01a] px-4 py-2 text-sm font-semibold text-black hover:brightness-95"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* ---------- EMPTY STATE ---------- */}
        {list.length === 0 && (
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-10 text-center text-neutral-600">
            No workshops match your filters. Try clearing the search or choosing a broader date.
          </div>
        )}
      </main>

      {/* ---------- DETAILS MODAL ---------- */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpenId(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] w-full">
              <img
                src={open.cover}
                alt={open.title}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setOpenId(null)}
                className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold ring-1 ring-black/5 hover:bg-white"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-stone-900">{open.title}</h3>
              <p className="mt-2 text-neutral-700">{open.blurb}</p>
              <div className="mt-4 grid gap-2 text-sm text-neutral-700">
                <div>📅 {open.date} — {open.time} ({open.duration})</div>
                <div>📍 {open.location}</div>
                <div>🎓 Level: {open.level}</div>
                <div>💰 {open.price.toLocaleString()} LKR per person</div>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => setBooking(open)}
                  className="inline-flex items-center justify-center rounded-full bg-[#fbb01a] px-5 py-2 font-semibold text-black hover:brightness-95"
                >
                  Book this workshop
                </button>
                <button
                  onClick={() => setOpenId(null)}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-2 font-semibold hover:bg-neutral-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- BOOKING MODAL (FORM UI) ---------- */}
      {booking && <BookingModal workshop={booking} onClose={() => setBooking(null)} />}
    </div>
  );
}

/* ======================= Booking Modal ======================= */
function BookingModal({ workshop, onClose }) {
  const spotsLeft = Math.max(workshop.capacity - workshop.seatsTaken, 0);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",   // NEW
    seats: 1,
    notes: "",     // stays, but UI moved below
    agree: false,
  });
  const [submitted, setSubmitted] = React.useState(false);
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.agree) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-900">Register for {workshop.title}</h3>
            <button
              onClick={onClose}
              className="rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100"
            >
              Close
            </button>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            📅 {workshop.date} • {workshop.time} • {workshop.location} • {workshop.level}
          </p>
        </div>

        {/* Body */}
        <div className="p-5">
          {submitted ? (
            <div className="rounded-xl bg-green-50 p-5 text-green-700">
              <div className="text-lg font-semibold">Thanks! 🎉</div>
              <p className="mt-1 text-sm">
                We’ve received your registration request for <strong>{workshop.title}</strong>. We’ll email you
                confirmation shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#fbb01a] px-5 py-2 font-semibold text-black hover:brightness-95"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-3">
              {/* Name + Phone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  Full name
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Phone
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    required
                    className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40"
                  />
                </label>
              </div>

              {/* Email */}
              <label className="grid gap-1 text-sm">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40"
                />
              </label>

              {/* NEW: Address */}
              <label className="grid gap-1 text-sm">
                Address
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Street, city, district"
                  className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40"
                />
              </label>

              {/* Seats */}
              <label className="grid gap-1 text-sm">
                Seats
                <input
                  type="number"
                  min={1}
                  max={Math.max(spotsLeft, 1)}
                  value={form.seats}
                  onChange={(e) => update("seats", Number(e.target.value))}
                  required
                  className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40"
                />
                <span className="text-xs text-neutral-500">
                  {spotsLeft > 0 ? `${spotsLeft} seats available` : "Currently full — we’ll add you to the waitlist"}
                </span>
              </label>

              {/* Notes moved below (full width) */}
              <label className="grid gap-1 text-sm">
                Notes (optional)
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40"
                  placeholder="Allergies, accessibility, etc."
                />
              </label>

              {/* Consent */}
              <label className="mt-1 flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => update("agree", e.target.checked)}
                  required
                  className="mt-0.5"
                />
                I agree to the event guidelines and consent to be contacted about my registration.
              </label>

              {/* Buttons */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#fbb01a] px-5 py-2 font-semibold text-black hover:brightness-95"
                >
                  Submit registration
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-2 font-semibold hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

}
