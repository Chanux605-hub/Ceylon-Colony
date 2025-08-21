import React, { useMemo, useState } from "react";

// ---- MOCK DATA (hard-coded) ----
const TABS = ["All", "Announcements", "Discussions", "Tutorials", "Events", "Gallery"];
const POSTS = [
  {
    id: "p1",
    type: "Announcements",
    author: "Team Colony",
    avatar: "🧑‍🍳",
    title: "Welcome to the Colony Community!",
    body: "Share your honey creations, ask product questions, and meet fellow bee-lovers.",
    tags: ["welcome", "community"],
    likes: 46, comments: 12, time: "2h ago",
    image: null,
  },
  {
    id: "p2",
    type: "Discussions",
    author: "Nishan",
    avatar: "🐝",
    title: "Best pairing for Cinnamon Infused Honey?",
    body: "I tried it with yogurt + granola and it was 🔥. Any other ideas?",
    tags: ["cinnamon", "recipes", "breakfast"],
    likes: 23, comments: 9, time: "5h ago",
    image: null,
  },
  {
    id: "p3",
    type: "Tutorials",
    author: "Tharushi",
    avatar: "🍯",
    title: "How I make honey lip scrub (DIY)",
    body: "Simple 3-ingredient scrub: sugar + honey + coconut oil. Steps inside.",
    tags: ["skincare", "diy"],
    likes: 58, comments: 20, time: "1d ago",
    image: null,
  },
  {
    id: "p4",
    type: "Gallery",
    author: "Sameera",
    avatar: "📸",
    title: "My Raw Honey board",
    body: "Weekend farmers’ market vibes.",
    tags: ["gallery", "raw-honey"],
    likes: 17, comments: 4, time: "1d ago",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
  },
];

const EVENTS = [
  { id: "e1", when: "Aug 28, 5.30 PM", title: "Tasting: Multi‑Floral vs Forest Honey", where: "Colombo Flagship", spots: 8 },
  { id: "e2", when: "Sep 12, 6.00 PM", title: "DIY Skincare Night (Honey Serum)", where: "Online", spots: 20 },
];

const TAGS = ["raw-honey", "infused", "skincare", "sri-lankan", "recipes", "gifts", "beekeeping"];
const CONTRIBUTORS = [
  { name: "Nishan", points: 420 },
  { name: "Tharushi", points: 355 },
  { name: "Sameera", points: 290 },
  { name: "Ishara", points: 220 },
];

export default function Community() {
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = POSTS;
    if (tab !== "All") list = list.filter(p => p.type === tab);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(s) ||
        p.body.toLowerCase().includes(s) ||
        p.tags.join(" ").toLowerCase().includes(s)
      );
    }
    return list;
  }, [tab, q]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background:
                 "radial-gradient(900px 200px at 80% -10%, rgba(251,176,26,0.15), transparent 60%)",
             }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Community</h1>
              <p className="text-white/70 mt-1">
                Share tips, ask questions, join events — all things Ceylon Colony 🍯
              </p>
            </div>
            <button
              className="rounded-xl bg-[#FBB01A] text-black font-semibold px-4 py-2 shadow-neon hover:brightness-95"
              onClick={() => alert("Open create post modal (mock)")}
            >
              + Start a post
            </button>
          </div>
          {/* SEARCH + TABS */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search posts, tags, creators…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10
                           placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
              />
              <div className="absolute left-3 top-2.5 text-white/60">🔎</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-3.5 py-2 text-sm border transition
                    ${tab === t
                      ? "bg-[#FBB01A] text-black border-transparent"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT / FEED */}
          <div className="lg:col-span-8 space-y-6">
            {/* Composer (mock) */}
            <div className="rounded-2xl bg-black/50 border border-white/10 p-4 shadow-inset-neon">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full grid place-items-center bg-black/60 border border-white/10">
                  🐝
                </div>
                <input
                  placeholder="Share a tip, question, recipe…"
                  className="flex-1 rounded-xl px-3 py-2 bg-white/5 border border-white/10
                             placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
                />
                <button
                  onClick={() => alert("Post created (mock)")}
                  className="rounded-xl bg-[#FBB01A] text-black font-semibold px-4 py-2 hover:brightness-95"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts */}
            {filtered.map((p) => (
              <article key={p.id}
                className="rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-neon">
                <div className="p-4">
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <div className="h-9 w-9 rounded-full grid place-items-center bg-white/5 border border-white/10">
                      <span className="text-lg">{p.avatar}</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{p.author}</div>
                      <div className="text-white/50">{p.type} • {p.time}</div>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-amber-400/20 text-amber-300 border border-amber-200/30">
                      {p.type}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-white/80">{p.body}</p>

                  {p.image && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                      <img src={p.image} alt="" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {p.tags.map((t) => (
                      <span key={t}
                        className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 px-4 py-3 border-t border-white/10 text-sm">
                  <button className="hover:text-amber-300">👍 {p.likes}</button>
                  <button className="hover:text-amber-300">💬 {p.comments}</button>
                  <button className="ml-auto hover:text-amber-300">🔗 Share</button>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-2xl bg-black/50 border border-white/10 p-6 text-center text-white/60">
                No posts match your filter yet.
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => alert("Load more (mock)")}
                className="mt-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10"
              >
                Load more
              </button>
            </div>
          </div>

          {/* RIGHT / SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Events */}
            <div className="rounded-2xl bg-black/60 border border-white/10 p-4 shadow-inset-neon">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Upcoming events</h3>
                <a href="#" className="text-sm text-amber-300 hover:underline">View all</a>
              </div>
              <div className="mt-3 space-y-3">
                {EVENTS.map((e) => (
                  <div key={e.id}
                    className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="text-xs text-white/60">{e.when} • {e.where}</div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-xs text-white/60 mt-1">Spots left: <span className="text-amber-300">{e.spots}</span></div>
                    <button
                      onClick={() => alert("RSVP (mock)")}
                      className="mt-2 rounded-lg bg-[#FBB01A] text-black text-sm font-semibold px-3 py-1 hover:brightness-95"
                    >
                      RSVP
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending tags */}
            <div className="rounded-2xl bg-black/60 border border-white/10 p-4">
              <h3 className="font-semibold">Trending tags</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <button key={t}
                    onClick={() => setQ(t)}
                    className="px-3 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 hover:bg-white/10">
                    #{t}
                  </button>
                ))}
              </div>
            </div>

            {/* Top contributors */}
            <div className="rounded-2xl bg-black/60 border border-white/10 p-4">
              <h3 className="font-semibold">Top contributors</h3>
              <ul className="mt-3 space-y-2">
                {CONTRIBUTORS.map((c, i) => (
                  <li key={c.name} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full grid place-items-center bg-white/5 border border-white/10">
                      {["🥇","🥈","🥉","🏅"][i] || "🏅"}
                    </div>
                    <div className="flex-1">{c.name}</div>
                    <div className="text-amber-300 text-sm">{c.points} pts</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rules / Join newsletter */}
            <div className="rounded-2xl bg-black/60 border border-white/10 p-4">
              <h3 className="font-semibold">Community rules</h3>
              <ul className="mt-2 text-sm text-white/70 list-disc pl-5 space-y-1">
                <li>Be kind & helpful</li>
                <li>No spam or self‑promo</li>
                <li>Credit sources & photos</li>
              </ul>
              <div className="mt-4">
                <div className="text-sm text-white/70 mb-1">Get monthly tips & event updates</div>
                <div className="flex gap-2">
                  <input placeholder="you@email.com"
                         className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 placeholder:text-white/50" />
                  <button
                    onClick={() => alert("Subscribed (mock)")}
                    className="rounded-lg bg-[#FBB01A] text-black px-3 py-2 font-semibold"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
