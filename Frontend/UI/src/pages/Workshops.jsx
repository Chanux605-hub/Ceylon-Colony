// src/pages/Workshops.jsx
import React, { useMemo, useState } from "react";

/**
 * Public Workshops Page (UI only)
 * - No external libs beyond React + Tailwind
 * - Replace mock `workshops` with your API later
 */

export default function Workshops() {
  const workshops = useMemo(
    () => [
      {
        id: "WKP-101",
        slug: "intro-to-beekeeping-2025-09-05",
        title: "Intro to Beekeeping: Hive Basics",
        blurb: "Hands-on intro to hive safety, tools, and basic care.",
        date: "2025-09-05T09:00:00+05:30",
        durationMins: 150,
        mode: "On-site",
        venue: { name: "Colombo Workshop Space" },
        trainer: "Amal",
        priceLKR: 6500,
        seats: 20,
        filled: 16,
        level: "Beginner",
        syllabus: ["PPE & safety", "Hive anatomy", "Inspection basics"],
        bring: ["Long sleeves", "Closed shoes"],
        provided: ["Gloves", "Veil"],
      },
      {
        id: "WKP-104",
        slug: "harvesting-techniques-2025-09-12",
        title: "Sustainable Honey Harvesting Techniques",
        blurb: "How to harvest cleanly, quickly, and bee-first.",
        date: "2025-09-12T14:00:00+05:30",
        durationMins: 120,
        mode: "On-site",
        venue: { name: "Kandy Training Yard" },
        trainer: "Kavindi",
        priceLKR: 7800,
        seats: 25,
        filled: 21,
        level: "Intermediate",
        syllabus: ["Super selection", "Uncapping", "Extraction & filtering"],
        bring: ["Long sleeves", "Water bottle"],
        provided: ["Smoker", "Veil"],
      },
      {
        id: "WKP-103",
        slug: "honey-quality-and-safety-2025-09-19",
        title: "Honey Quality & Safety",
        blurb: "Moisture, hygiene, labeling and batch control.",
        date: "2025-09-19T10:00:00+05:30",
        durationMins: 120,
        mode: "Online",
        venue: null,
        trainer: "Ruwan",
        priceLKR: 5200,
        seats: 20,
        filled: 20,
        level: "Beginner",
        syllabus: ["Moisture testing", "Hygiene basics", "Labels & batch codes"],
        bring: ["Notebook"],
        provided: ["PDF handbook"],
      },
      {
        id: "WKP-107",
        slug: "queen-rearing-2025-09-26",
        title: "Queen Rearing Fundamentals",
        blurb: "Grafting, cell builders, and nucs.",
        date: "2025-09-26T09:30:00+05:30",
        durationMins: 180,
        mode: "On-site",
        venue: { name: "Galle Field Apiary" },
        trainer: "Amal",
        priceLKR: 9500,
        seats: 18,
        filled: 12,
        level: "Advanced",
        syllabus: ["Larvae selection", "Cell cups", "Nuc setup"],
        bring: ["Long sleeves", "Closed shoes"],
        provided: ["Queen cage", "Veil"],
      },
    ],
    []
  );

  // Filters
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All"); // All | Beginner | Intermediate | Advanced
  const [mode, setMode] = useState("All");   // All | On-site | Online

  // Drawer (details)
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workshops.filter((w) => {
      const matchesQuery =
        !q ||
        [w.title, w.blurb, w.trainer, w.venue?.name ?? "", w.level, w.mode]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesLevel = level === "All" || w.level === level;
      const matchesMode = mode === "All" || w.mode === mode;
      return matchesQuery && matchesLevel && matchesMode;
    });
  }, [workshops, query, level, mode]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* HERO */}
      <section className="border-b border-neutral-900 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Learn with <span className="text-yellow-400">Ceylon Colony</span>
          </h1>
          <p className="mt-2 max-w-2xl text-neutral-300">
            Small-group, hands-on workshops for beginners and hobbyists. Bee-first, practical, and fun.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Filters */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
          <div className="relative sm:col-span-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, trainer, venue…"
              className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 ring-1 ring-neutral-800 outline-none focus:ring-yellow-500/40"
              aria-label="Search workshops"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl bg-neutral-900 px-3 py-2 text-sm ring-1 ring-neutral-800 focus:ring-yellow-500/40"
            aria-label="Filter by level"
          >
            {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="rounded-xl bg-neutral-900 px-3 py-2 text-sm ring-1 ring-neutral-800 focus:ring-yellow-500/40"
            aria-label="Filter by mode"
          >
            {["All", "On-site", "Online"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((w) => (
              <WorkshopCard
                key={w.id}
                w={w}
                onDetails={() => {
                  setActive(w);
                  setOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Details Drawer */}
      {open && active && (
        <DetailsDrawer
          w={active}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

/* ---------- Cards & small components ---------- */

function WorkshopCard({ w, onDetails }) {
  const seatsLeft = w.seats - w.filled;
  const pct = Math.round((w.filled / w.seats) * 100);
  const soldOut = seatsLeft <= 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Badge>{w.level}</Badge>
        <span className="text-xs text-neutral-400">
          {w.mode === "Online" ? "Online" : w.venue?.name}
        </span>
      </div>

      <h3 className="line-clamp-2 text-base font-semibold">{w.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-neutral-300">{w.blurb}</p>

      <div className="mt-3 space-y-1 text-sm text-neutral-300">
        <Row label="Date & Time" value={formatDateTime(w.date)} />
        <Row
          label="Duration"
          value={`${Math.floor(w.durationMins / 60)}h${
            w.durationMins % 60 ? ` ${w.durationMins % 60}m` : ""
          }`}
        />
        <Row label="Trainer" value={w.trainer} />
        <Row label="Price" value={formatLKR(w.priceLKR)} />
      </div>

      <div className="mt-3">
        <SeatsBar percent={pct} label={`${w.filled}/${w.seats} seats`} />
        <div className="mt-1 text-xs text-neutral-400">
          {soldOut ? "Sold out" : `${seatsLeft} seats left`}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          className={`rounded-xl px-3 py-2 text-sm font-semibold ${
            soldOut
              ? "cursor-not-allowed bg-neutral-800 text-neutral-400"
              : "bg-yellow-400 text-black hover:brightness-95"
          }`}
          disabled={soldOut}
          // TODO: connect to checkout or waitlist
        >
          {soldOut ? "Join Waitlist" : "Register"}
        </button>

        <button
          onClick={onDetails}
          className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold ring-1 ring-neutral-700 hover:ring-yellow-500/40"
        >
          Details
        </button>

        <button
          onClick={() =>
            downloadICS({
              title: w.title,
              startISO: w.date,
              endISO: new Date(new Date(w.date).getTime() + w.durationMins * 60000).toISOString(),
              location: w.mode === "Online" ? "Online" : w.venue?.name,
              details: w.blurb,
              url: window.location.origin + "/workshops/" + w.slug,
            })
          }
          className="col-span-1 rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold ring-1 ring-neutral-700 hover:ring-yellow-500/40"
        >
          Add to Calendar
        </button>

        <ShareButton slug={w.slug} title={w.title} className="col-span-1" />
      </div>
    </div>
  );
}

function ShareButton({ slug, title, className = "" }) {
  const [copied, setCopied] = useState(false);
  const url = (typeof window !== "undefined" ? window.location.origin : "") + "/workshops/" + slug;

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: open whatsapp share
      window.open(`https://wa.me/?text=${encodeURIComponent(title + " - " + url)}`, "_blank");
    }
  };

  return (
    <button
      onClick={onShare}
      className={`rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold ring-1 ring-neutral-700 hover:ring-yellow-500/40 ${className}`}
      aria-live="polite"
    >
      {copied ? "Link Copied!" : "Share"}
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-neutral-400">{label}</span>
      <span className="text-neutral-200">{value}</span>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-yellow-400/10 px-2 py-0.5 text-xs font-semibold text-yellow-400 ring-1 ring-yellow-500/30">
      {children}
    </span>
  );
}

function SeatsBar({ percent, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full rounded-full bg-neutral-800">
        <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${percent}%` }} />
      </div>
      <span className="whitespace-nowrap text-xs text-neutral-400">{label}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-10 text-center">
      <div className="text-lg font-semibold">No workshops found</div>
      <p className="mt-1 text-neutral-400">Try changing filters, or subscribe to get notified.</p>
      <div className="mt-4 flex justify-center">
        <input
          placeholder="Email for next dates"
          className="w-72 rounded-l-xl bg-neutral-900 px-3 py-2 text-sm ring-1 ring-neutral-800 outline-none focus:ring-yellow-500/40"
        />
        <button className="rounded-r-xl bg-yellow-400 px-4 text-sm font-semibold text-black hover:brightness-95">
          Notify me
        </button>
      </div>
    </div>
  );
}

/* ---------- Details Drawer ---------- */

function DetailsDrawer({ w, onClose }) {
  const seatsLeft = w.seats - w.filled;
  const soldOut = seatsLeft <= 0;
  const pct = Math.round((w.filled / w.seats) * 100);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-neutral-800 bg-neutral-950 p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge>{w.level}</Badge>
              <span className="text-xs text-neutral-400">
                {w.mode === "Online" ? "Online" : w.venue?.name}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-semibold">{w.title}</h2>
            <p className="mt-1 text-sm text-neutral-300">{w.blurb}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-neutral-900 px-3 py-1.5 text-sm ring-1 ring-neutral-800 hover:ring-yellow-500/40"
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <Row label="Date & Time" value={formatDateTime(w.date)} />
          <Row
            label="Duration"
            value={`${Math.floor(w.durationMins / 60)}h${
              w.durationMins % 60 ? ` ${w.durationMins % 60}m` : ""
            }`}
          />
          <Row label="Trainer" value={w.trainer} />
          <Row label="Price" value={formatLKR(w.priceLKR)} />
          <div>
            <div className="text-neutral-400">Seats</div>
            <div className="mt-1">
              <SeatsBar percent={pct} label={`${w.filled}/${w.seats}`} />
              <div className="mt-1 text-xs text-neutral-400">
                {soldOut ? "Sold out" : `${seatsLeft} seats left`}
              </div>
            </div>
          </div>

          <Divider />

          <ListBlock title="What you’ll learn" items={w.syllabus} />
          <ListBlock title="What to bring" items={w.bring} />
          <ListBlock title="Provided by us" items={w.provided} />

          <Divider />

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() =>
                downloadICS({
                  title: w.title,
                  startISO: w.date,
                  endISO: new Date(new Date(w.date).getTime() + w.durationMins * 60000).toISOString(),
                  location: w.mode === "Online" ? "Online" : w.venue?.name,
                  details: w.blurb,
                  url: window.location.origin + "/workshops/" + w.slug,
                })
              }
              className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold ring-1 ring-neutral-700 hover:ring-yellow-500/40"
            >
              Add to Calendar
            </button>
            <ShareButton slug={w.slug} title={w.title} />
          </div>

          {/* Mini register form (UI only) */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <div className="text-sm font-semibold">Register your spot</div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              <input
                placeholder="Your name"
                className="rounded-lg bg-neutral-900 px-3 py-2 text-sm ring-1 ring-neutral-800 outline-none focus:ring-yellow-500/40"
              />
              <input
                placeholder="Email or WhatsApp"
                className="rounded-lg bg-neutral-900 px-3 py-2 text-sm ring-1 ring-neutral-800 outline-none focus:ring-yellow-500/40"
              />
              <select className="rounded-lg bg-neutral-900 px-3 py-2 text-sm ring-1 ring-neutral-800 focus:ring-yellow-500/40">
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} seat{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <button
                className={`mt-1 rounded-xl px-3 py-2 text-sm font-semibold ${
                  soldOut
                    ? "cursor-not-allowed bg-neutral-800 text-neutral-400"
                    : "bg-yellow-400 text-black hover:brightness-95"
                }`}
                disabled={soldOut}
              >
                {soldOut ? "Join Waitlist" : "Proceed to Payment"}
              </button>
              <p className="text-xs text-neutral-500">
                By registering you agree to our hygiene & safety policy. PPE is provided on-site.
              </p>
            </div>
          </div>
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-2 h-px bg-neutral-900" />;
}

function ListBlock({ title, items }) {
  return (
    <div>
      <div className="text-neutral-300">{title}</div>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-neutral-300">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- tiny utils ---------- */

function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
function formatLKR(amount) {
  try {
    return amount.toLocaleString("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    });
  } catch {
    return `LKR ${amount}`;
  }
}

/** Download a basic ICS calendar file for the workshop */
function downloadICS({ title, startISO, endISO, location, details, url }) {
  const dt = (s) =>
    new Date(s).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const esc = (s = "") =>
    s.replace(/\\n/g, "\\n").replace(/\n/g, "\\n").replace(/,/g, "\\,");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ceylon Colony//Workshops//EN",
    "BEGIN:VEVENT",
    `UID:${(crypto?.randomUUID?.() || Math.random().toString(36).slice(2))}@ceyloncolony`,
    `DTSTAMP:${dt(new Date().toISOString())}`,
    `DTSTART:${dt(startISO)}`,
    `DTEND:${dt(endISO)}`,
    `SUMMARY:${esc(title)}`,
    location ? `LOCATION:${esc(location)}` : "",
    `DESCRIPTION:${esc(details)}${url ? "\\n" + esc(url) : ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
