// src/pages/Workshops.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

import aboutHero from "../assets/about-hero2.jpg";
import Navbar from "../Components/User/navbar";
import Footer from "../Components/User/Footer";
import chatIcon from "../assets/chatbot01.png"; // chatbot button image

/* -------- tiny inline API helper -------- */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
async function jfetch(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
}
const listWorkshops = () => jfetch(`${BASE}/api/workshops`);
/* ---------------------------------------------------------------- */

export default function Workshops() {
  // ✅ renamed auth loading to avoid conflict
  const { user, loading } = useAuth();

  // ✅ separate local loading state for workshops
  const [data, setData] = React.useState([]);
  const [workshopLoading, setWorkshopLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  // ---------- UI STATE ----------
  const [query, setQuery] = React.useState("");
  const [level, setLevel] = React.useState("All");
  const [location, setLocation] = React.useState("All");
  const [date, setDate] = React.useState("");
  const [openId, setOpenId] = React.useState(null); // details modal

  React.useEffect(() => {
    (async () => {
      try {
        const rows = await listWorkshops();
        const published = rows.filter((w) => w.status === "Published");
        setData(published.map((w) => ({ ...w, id: w._id || w.id })));
        setError("");
      } catch (e) {
        setError(e?.message || "Could not load workshops");
      } finally {
        setWorkshopLoading(false);
      }
    })();
  }, []);

  // derive filter options
  const levelOptions = React.useMemo(() => {
    const s = new Set(data.map((d) => d.level).filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [data]);
  const locationOptions = React.useMemo(() => {
    const s = new Set(data.map((d) => d.location).filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [data]);

  // filtered list
  const list = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((w) => {
      const passQ =
        !q ||
        [w.title, w.blurb, w.location].filter(Boolean).join(" ").toLowerCase().includes(q);
      const passL = level === "All" || w.level === level;
      const passLoc = location === "All" || w.location === location;
      const passDate = !date || (w.date || "") >= date;
      return passQ && passL && passLoc && passDate;
    });
  }, [data, query, level, location, date]);

  const open = data.find((w) => w.id === openId) || null;

  // 🟡 AUTO-BOOK FUNCTION
    const handleBook = async (workshop) => {
    if (loading) {
      alert("⏳ Please wait, checking your login...");
      return;
    }

    if (!user) {
      alert("Please log in to book this workshop.");
      return;
    }

    try {
      if (workshop.seatsTaken >= workshop.capacity) {
        alert("Sorry, this workshop is already full.");
        return;
      }

      const res = await fetch(`${BASE}/api/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId: workshop._id || workshop.id,
          userId: user.userId,   // ✅ use userId
          fullName: user.name,
          email: user.email,
          phone: user.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      if (workshop.price > 0) {
        window.location.href = `/workshop-payment?participantId=${data._id}&workshopId=${workshop._id}`;
      } else {
        alert(`✅ Successfully booked "${workshop.title}"!`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.message);
    }
  };



  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

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

      {/* ---------- FILTERS ---------- */}
      <main id="workshops" className="mx-auto max-w-7xl px-4 pt-8 pb-16">
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
              {levelOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none"
            >
              {locationOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none"
            />
          </div>
        </section>

        {/* ---------- LIST ---------- */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workshopLoading ? (
            <div className="col-span-full text-neutral-600">Loading…</div>
          ) : list.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-neutral-200 bg-white p-10 text-center text-neutral-600">
              No workshops match your filters.{" "}
              {data.length === 0 ? "Check back soon!" : "Try clearing filters."}
            </div>
          ) : (
            list.map((w) => {
              const spotsLeft = w.capacity - (w.seatsTaken || 0);
              const pct = Math.min(100, (w.seatsTaken / w.capacity) * 100);

              return (
                <article
                  key={w.id}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {w.coverUrl ? (
                      <img
                        src={w.coverUrl}
                        alt={w.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
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
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-stone-900">{w.title}</h3>
                    {w.blurb && (
                      <p className="mt-1 text-sm text-neutral-600">{w.blurb}</p>
                    )}
                    <div className="mt-3 grid gap-1 text-sm text-neutral-700">
                      <div>
                        📅 {w.date ? new Date(w.date).toDateString() : ""} — {w.time}{" "}
                        {w.duration ? `(${w.duration})` : ""}
                      </div>
                      <div>📍 {w.location}</div>
                      <div>
                        💰{" "}
                        {w.price === 0 || w.price === "Free"
                          ? "Free"
                          : `Rs. ${w.price} per person`}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-neutral-600">
                        <span>Spots</span>
                        <span>{spotsLeft} seats left</span>
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

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => setOpenId(w.id)}
                        className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
                      >
                        Details
                      </button>
                      <button
                        disabled={loading}
                        onClick={() => handleBook(w)}
                        className="rounded-full bg-[#fbb01a] px-4 py-2 text-sm font-semibold text-black hover:brightness-95 disabled:opacity-60"
                      >
                        {loading
                          ? "Checking login..."
                          : w.price > 0
                          ? "Book & Pay"
                          : "Book Now"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>

      <Footer />
      <Chatbot workshops={list} />
    </div>
  );
}
/* ======================= Chatbot ======================= */
function Chatbot({ workshops }) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { from: "bot", text: "Hello! 🐝 Ask me anything about our workshops." },
  ]);
  const [input, setInput] = React.useState("");

  const getReply = (msg) => {
    const text = msg.toLowerCase();

    // greetings
    if (text.includes("hello") || text.includes("hi")) {
      return "Hello 👋! How can I help you with our workshops?";
    }

    // general info
    if (text.includes("workshop") || text.includes("information") || text.includes("details")) {
      return "📚 We offer beginner and intermediate workshops on beekeeping, hive care, and honey processing. You can view schedules above.";
    }

    // duration
    if (text.includes("duration") || text.includes("long") || text.includes("hours")) {
      return "⏳ Most workshops last between 2 to 4 hours depending on the topic.";
    }

    // trainers
    if (text.includes("trainer") || text.includes("instructor") || text.includes("teacher")) {
      return "👩‍🏫 Our workshops are led by certified beekeeping experts with hands-on experience.";
    }

    // booking
    if (
      text.includes("register") ||
      text.includes("enroll") ||
      text.includes("book") ||
      text.includes("join") ||
      text.includes("sign up")
    ) {
      return "✅ To register, click the 'Book' button under your chosen workshop card.";
    }

    // cancellation
    if (text.includes("cancel") || text.includes("withdraw")) {
      return "❌ You can cancel your registration from your account page or by contacting support.";
    }

    // payment
    if (text.includes("payment") || text.includes("pay") || text.includes("fees")) {
      return "💳 Payments are accepted online or at the venue. Most workshops are Rs. 2500, some are Free.";
    }

    // refund
    if (text.includes("refund") || text.includes("money back")) {
      return "↩️ Refunds are available if you cancel at least 48 hours before the workshop.";
    }

    // location
    if (text.includes("location") || text.includes("venue") || text.includes("where")) {
      return "📍 Workshops are held in Colombo, Kandy, and also Online.";
    }

    // timing
    if (text.includes("time") || text.includes("schedule") || text.includes("when")) {
      return "🗓️ You can check exact dates and times in the workshop list above.";
    }

    // try match by workshop title
    const match = workshops.find((w) => w.title.toLowerCase().includes(text));
    if (match) {
      return `📌 "${match.title}" is scheduled on ${match.date} at ${match.location}. Price: ${match.price}.`;
    }

    // fallback
    return "🤖 Sorry, I couldn’t find that. Try asking about workshop topics, time, price, or location.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    const reply = getReply(input);
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 400);
    setInput("");
  };

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg p-2 bg-white border-4 border-yellow-400 hover:scale-110 transition-transform duration-300"
      >
        <img src={chatIcon} alt="Chat" className="w-14 h-14 object-contain" />
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-[#fbb01a]">
          {/* Header */}
          <div className="bg-[#fbb01a] px-4 py-3 font-bold text-black flex justify-between items-center">
            🐝 Workshop Assistant
            <button onClick={() => setOpen(false)} className="font-bold">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 p-3 overflow-y-auto text-sm space-y-3 max-h-80"
            style={{
              backgroundImage:
                "linear-gradient(45deg, rgba(255,176,26,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,176,26,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,176,26,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,176,26,0.05) 75%)",
              backgroundSize: "20px 20px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.from === "bot" && (
                  <span className="mr-2 text-lg">🐝</span>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl relative max-w-[70%] ${
                    m.from === "user"
                      ? "bg-[#fbb01a] text-black rounded-br-none"
                      : "bg-neutral-800 text-white rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t border-neutral-700 bg-neutral-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about a workshop..."
              className="flex-1 px-3 py-2 text-sm outline-none bg-transparent text-white placeholder:text-neutral-400"
            />
            <button
              onClick={sendMessage}
              className="px-4 text-[#fbb01a] font-bold hover:text-white transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
