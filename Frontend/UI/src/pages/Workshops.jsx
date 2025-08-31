// src/pages/Workshops.jsx
import React from "react";
import aboutHero from "../assets/about-hero2.jpg";

/* -------- tiny inline API helper (no api/ folder needed) -------- */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
async function listWorkshops() {
  const res = await fetch(`${BASE}/api/workshops`);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw new Error(data?.error || `Failed to load workshops`);
  return data;
}
/* ---------------------------------------------------------------- */

export default function Workshops() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  // ---------- UI STATE ----------
  const [query, setQuery] = React.useState("");
  const [level, setLevel] = React.useState("All");
  const [location, setLocation] = React.useState("All");
  const [date, setDate] = React.useState("");

  const [openId, setOpenId] = React.useState(null);      // details modal
  const [booking, setBooking] = React.useState(null);    // booking modal

  React.useEffect(() => {
    (async () => {
      try {
        const rows = await listWorkshops();
        // normalize id shape for React keys
        setData(rows.map(w => ({ ...w, id: w._id || w.id })));
        setError("");
      } catch (e) {
        setError(e?.message || "Could not load workshops");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // derive distinct filter options from data
  const levelOptions = React.useMemo(() => {
    const s = new Set(data.map(d => d.level).filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [data]);
  const locationOptions = React.useMemo(() => {
    const s = new Set(data.map(d => d.location).filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [data]);

  // ---------- DERIVED LIST (filters) ----------
  const list = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((w) => {
      const passQ =
        !q ||
        [w.title, w.blurb, w.location].filter(Boolean).join(" ").toLowerCase().includes(q);
      const passL = level === "All" || w.level === level;
      const passLoc = location === "All" || w.location === location;
      const passDate = !date || (w.date || "") >= date; // naive compare on YYYY-MM-DD
      return passQ && passL && passLoc && passDate;
    });
  }, [data, query, level, location, date]);

  const open = data.find((w) => w.id === openId) || null;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* ---------- HERO ---------- */}
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
        {/* ---------- FILTERS ---------- */}
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
              {levelOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none"
            >
              {locationOptions.map(opt => <option key={opt}>{opt}</option>)}
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
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-neutral-600">Loading…</div>
          ) : list.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-neutral-200 bg-white p-10 text-center text-neutral-600">
              No workshops match your filters. {data.length === 0 ? "Check back soon!" : "Try clearing filters."}
            </div>
          ) : (
            list.map((w) => {
              const pct = Math.round((Number(w.seatsTaken || 0) / Math.max(Number(w.capacity || 1), 1)) * 100);
              const spotsLeft = Math.max(Number(w.capacity || 0) - Number(w.seatsTaken || 0), 0);

              return (
                <article
                  key={w.id}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Cover */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {w.coverUrl ? (
                      <img
                        src={w.coverUrl}
                        alt={w.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200" />
                    )}
                    {w.level && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold ring-1 ring-black/5">
                        {w.level}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-stone-900">{w.title}</h3>
                    {w.blurb && <p className="mt-1 text-sm text-neutral-600">{w.blurb}</p>}

                    <div className="mt-3 grid gap-1 text-sm text-neutral-700">
                      <div>📅 {w.date} — {w.time}{w.duration ? ` (${w.duration})` : ""}</div>
                      <div>📍 {w.location}</div>
                      <div>
                        💰 {Number(w.price || 0).toLocaleString()} LKR{" "}
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
                        <div className="h-2 rounded-full bg-[#fbb01a]" style={{ width: `${pct}%` }} />
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
            })
          )}
        </section>
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
              {open.coverUrl ? (
                <img src={open.coverUrl} alt={open.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-neutral-200" />
              )}
              <button
                onClick={() => setOpenId(null)}
                className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold ring-1 ring-black/5 hover:bg-white"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-stone-900">{open.title}</h3>
              {open.blurb && <p className="mt-2 text-neutral-700">{open.blurb}</p>}
              <div className="mt-4 grid gap-2 text-sm text-neutral-700">
                <div>📅 {open.date} — {open.time}{open.duration ? ` (${open.duration})` : ""}</div>
                <div>📍 {open.location}</div>
                <div>🎓 Level: {open.level}</div>
                <div>💰 {Number(open.price || 0).toLocaleString()} LKR per person</div>
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

      {/* ---------- BOOKING MODAL (same UI as before) ---------- */}
      {booking && <BookingModal workshop={booking} onClose={() => setBooking(null)} />}
    </div>
  );
}

/* ======================= Booking Modal ======================= */
function BookingModal({ workshop, onClose }) {
  const spotsLeft = Math.max((workshop.capacity || 0) - (workshop.seatsTaken || 0), 0);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    seats: 1,
    notes: "",
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
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-900">Register for {workshop.title}</h3>
            <button onClick={onClose} className="rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100">
              Close
            </button>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            📅 {workshop.date} • {workshop.time} • {workshop.location} • {workshop.level}
          </p>
        </div>

        <div className="p-5">
          {submitted ? (
            <div className="rounded-xl bg-green-50 p-5 text-green-700">
              <div className="text-lg font-semibold">Thanks! 🎉</div>
              <p className="mt-1 text-sm">
                We’ve received your registration request for <strong>{workshop.title}</strong>. We’ll email you
                confirmation shortly.
              </p>
              <button onClick={onClose} className="mt-4 inline-flex items-center justify-center rounded-full bg-[#fbb01a] px-5 py-2 font-semibold text-black hover:brightness-95">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  Full name
                  <input value={form.name} onChange={(e) => update("name", e.target.value)} required className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40" />
                </label>
                <label className="grid gap-1 text-sm">
                  Phone
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)} required className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40" />
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                Email
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40" />
              </label>

              <label className="grid gap-1 text-sm">
                Address
                <input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Street, city, district" className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40" />
              </label>

              <label className="grid gap-1 text-sm">
                Seats
                <input type="number" min={1} max={Math.max(spotsLeft, 1)} value={form.seats} onChange={(e) => update("seats", Number(e.target.value))} required className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40" />
                <span className="text-xs text-neutral-500">
                  {spotsLeft > 0 ? `${spotsLeft} seats available` : "Currently full — we’ll add you to the waitlist"}
                </span>
              </label>

              <label className="grid gap-1 text-sm">
                Notes (optional)
                <textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} className="rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#fbb01a]/40" placeholder="Allergies, accessibility, etc." />
              </label>

              <label className="mt-1 flex items-start gap-2 text-sm">
                <input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} required className="mt-0.5" />
                I agree to the event guidelines and consent to be contacted about my registration.
              </label>

              <div className="mt-2 flex items-center gap-2">
                <button type="submit" className="inline-flex items-center justify-center rounded-full bg-[#fbb01a] px-5 py-2 font-semibold text-black hover:brightness-95">
                  Submit registration
                </button>
                <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-2 font-semibold hover:bg-neutral-50">
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
