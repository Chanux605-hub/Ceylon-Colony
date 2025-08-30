// src/pages/Community.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../Components/User/navbar";
import Footer from "../Components/User/Footer";

/* ============================================
   CONFIG
============================================ */
const API = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");

/* ============================================
   UTILS
============================================ */
async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.text()) || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

/* ============================================
   STATICS YOU STILL USE
============================================ */
const TABS = ["All", "Discussions", "Gallery"]; // trimmed to your two real feeds
const EVENTS = [
  { id: "e1", when: "Aug 28, 5.30 PM", title: "Tasting: Multi‑Floral vs Forest Honey", where: "Colombo Flagship", spots: 8 },
  { id: "e2", when: "Sep 12, 6.00 PM", title: "DIY Skincare Night (Honey Serum)", where: "Online", spots: 20 },
];
const TAGS = ["raw-honey", "infused", "skincare", "sri-lankan", "recipes", "gifts", "beekeeping"];
// products (ids must match backend productId values)
const PRODUCTS = [
  { id: "raw", name: "Raw Honey" },
  { id: "cinnamon", name: "Cinnamon Infused" },
  { id: "wildflower", name: "Wildflower Honey" },
];

/* ============================================
   START POST FORM (modal)
============================================ */
function StartPostForm({ open, onClose, onCreated, currentUser }) {
  const [contentType, setContentType] = useState("short"); // short | image | review
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productId, setProductId] = useState("raw");
  const [tags, setTags] = useState(["skincare"]);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const toggleTag = (t) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("contentType", contentType);
      fd.append("title", title);
      fd.append("description", description);
      fd.append("productId", productId);
      fd.append("tags", JSON.stringify(tags));
      fd.append("userId", currentUser.userId);
      fd.append("username", currentUser.username);
      fd.append("avatarUrl", currentUser.avatarUrl || "");
      if (file) fd.append("media", file);

      const res = await fetch(`${API}/api/posts`, { method: "POST", body: fd });
      if (!res.ok) {
        let msg = `Failed to create post (HTTP ${res.status})`;
        try {
          const t = await res.text();
          if (t) msg = t;
        } catch {}
        throw new Error(msg);
      }
      await res.json();

      // reset + refresh
      setTitle(""); setDescription(""); setFile(null); setTags(["skincare"]); setProductId("raw"); setContentType("short");
      onCreated?.();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-[#111] border border-white/10 shadow-neon">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center">🐝</div>
            )}
            <div>
              <div className="font-semibold">{currentUser.username}</div>
              <div className="text-xs text-white/60">Create a post</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div className="flex gap-2">
            {["short","image","review"].map(t => (
              <button
                type="button"
                key={t}
                onClick={() => setContentType(t)}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  contentType === t ? "bg-[#FBB01A] text-black border-transparent" : "bg-white/5 text-white border-white/10"
                }`}
              >
                {t === "short" ? "Short video" : t === "image" ? "Image" : "Review"}
              </button>
            ))}
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title (optional)"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description..."
            rows={4}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
          />

          <div className="flex items-center gap-3">
            <label className="text-sm text-white/70">Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5"
            >
              {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <div className="text-sm text-white/70 mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {["skincare","recipie","health"].map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`px-3 py-1.5 rounded-full border text-xs ${
                    tags.includes(t) ? "bg-white text-black border-transparent" : "bg-white/5 text-white border-white/10"
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {contentType !== "review" && (
            <div>
              <div className="text-sm text-white/70 mb-2">Upload {contentType === "short" ? "video" : "image"}</div>
              <input
                type="file"
                accept={contentType === "short" ? "video/*" : "image/*"}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-3
                           file:rounded-md file:border-0 file:bg-[#FBB01A] file:text-black"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-white/10 border border-white/10">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-[#FBB01A] text-black font-semibold disabled:opacity-60">
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================
   SHORT VIDEOS ROW (unchanged)
============================================ */
function ShortVideosRow({ videos, products }) {
  const [mode, setMode] = useState("all");
  const [tag, setTag] = useState("#skincare");
  const [product, setProduct] = useState(products[0]?.id || "");
  const trackRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const filtered = useMemo(() => {
    let list = [...videos].sort((a, b) => (b.views || 0) - (a.views || 0));
    if (mode === "tag") {
      const t = tag.replace(/^#/, "").toLowerCase();
      list = list.filter(v => (v.tags || []).map(x => x.toLowerCase()).includes(t));
    } else if (mode === "product" && product) {
      list = list.filter(v => v.productId === product);
    }
    return list;
  }, [videos, mode, tag, product]);

  const onMouseDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.classList.add("cursor-grabbing");
  };
  const endDrag = () => {
    isDown.current = false;
    trackRef.current?.classList.remove("cursor-grabbing");
  };
  const onMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const el = trackRef.current;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.1;
    el.scrollLeft = scrollLeft.current - walk;
  };
  const onWheel = (e) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft += e.deltaY;
  };

  const addView = (id) => {
    fetch(`${API}/api/posts/${id}/view`, { method: "PATCH" }).catch(() => {});
  };

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Short videos</h2>
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setMode("all")}
              className={`px-3 py-1.5 rounded-full border ${mode === "all" ? "bg-[#FBB01A] text-black border-transparent" : "bg-white/5 text-white border-white/10"}`}
            >
              All
            </button>
            <button
              onClick={() => setMode("tag")}
              className={`px-3 py-1.5 rounded-full border ${mode === "tag" ? "bg-[#FBB01A] text-black border-transparent" : "bg-white/5 text-white border-white/10"}`}
            >
              Tag
            </button>
            <button
              onClick={() => setMode("product")}
              className={`px-3 py-1.5 rounded-full border ${mode === "product" ? "bg-[#FBB01A] text-black border-transparent" : "bg-white/5 text-white border-white/10"}`}
            >
              Product
            </button>

            {mode === "tag" && (
              <div className="ml-2 flex gap-2">
                {["#skincare", "#recipie", "#health"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`px-3 py-1.5 rounded-full border text-xs ${tag === t ? "bg-white text-black border-transparent" : "bg-white/5 text-white border-white/10"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {mode === "product" && (
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="ml-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div
          ref={trackRef}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseLeave={endDrag}
          onMouseUp={endDrag}
          onMouseMove={onMouseMove}
          className="mt-4 no-scrollbar overflow-x-auto select-none cursor-grab snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
          aria-label="Short videos"
        >
          <div className="flex gap-4 pr-4">
            {filtered.map((v) => (
              <div
                key={v.id}
                className="snap-start shrink-0 w-[180px] sm:w-[200px] md:w-[220px] rounded-2xl overflow-hidden bg-black/60 border border-white/10"
              >
                <div className="relative aspect-[9/16] bg-black">
                  <video
                    src={v.src}
                    poster={v.poster}
                    muted
                    loop
                    playsInline
                    autoPlay
                    onPlay={() => addView(v.id)}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="text-xs text-white/85">{v.title}</div>
                    <div className="text-[11px] text-amber-300">{(v.views ?? 0).toLocaleString()} views</div>
                  </div>
                </div>
                <div className="px-2 py-2 flex flex-wrap gap-1">
                  {(v.tags || []).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-white/60 py-10">No videos yet for this filter.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   PAGE
============================================ */
export default function Community() {
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");

  // short videos from backend (approved + public)
  const [shorts, setShorts] = useState([]);

  // FEED from backend (your two types merged): Discussions (reviews) + Gallery (images)
  const [posts, setPosts] = useState([]);

  // start-post modal
  const [openCreate, setOpenCreate] = useState(false);

  // Replace with your real logged-in user data
  const currentUser = {
    userId: "u001",
    username: "Nishan",
    avatarUrl: "https://i.pravatar.cc/100?img=5",
  };

  // Loaders
  const loadShorts = async () => {
    try {
      const data = await fetchJson(`${API}/api/shorts`);
      setShorts(data);
    } catch (err) {
      alert(`Failed to load shorts: ${err.message}`);
    }
  };

  const mapImageToPost = (p) => ({
    id: p._id,
    type: "Gallery",                // shows in the Gallery tab
    author: p.author?.username || "Unknown",
    avatar: "📸",
    title: p.title || "",
    body: p.description || "",
    tags: p.tags || [],
    likes: p.likes ?? 0,
    comments: p.commentsCount ?? 0,
    time: new Date(p.createdAt).toLocaleString(),
    image: p.mediaUrl || null,      // render the image in your existing card
  });

  const mapReviewToPost = (p) => ({
    id: p._id,
    type: "Discussions",            // shows in the Discussions tab
    author: p.author?.username || "Unknown",
    avatar: "📝",
    title: p.title || "Review",
    body: p.description || "",
    tags: p.tags || [],
    likes: p.likes ?? 0,
    comments: p.commentsCount ?? 0,
    time: new Date(p.createdAt).toLocaleString(),
    image: null,                    // reviews are text-only here
  });

  const loadFeed = async () => {
    try {
      // Get approved images
      const imgRes = await fetchJson(`${API}/api/admin/posts?contentType=image&status=approved&sortBy=createdAt&order=desc&limit=50`);
      const images = (imgRes.items || []).map(mapImageToPost);

      // Get approved reviews
      const revRes = await fetchJson(`${API}/api/admin/posts?contentType=review&status=approved&sortBy=createdAt&order=desc&limit=50`);
      const reviews = (revRes.items || []).map(mapReviewToPost);

      // Merge + sort by created time (desc)
      const merged = [...images, ...reviews].sort((a, b) => (new Date(b.time) - new Date(a.time)));
      setPosts(merged);
    } catch (err) {
      alert(`Failed to load feed: ${err.message}`);
    }
  };

  // Initial load
  useEffect(() => {
    (async () => {
      await Promise.all([loadShorts(), loadFeed()]);
    })();
  }, []);

  // Search + Tab filter applied to real posts
  const filtered = useMemo(() => {
    let list = posts;
    if (tab !== "All") list = list.filter(p => p.type === tab);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(p =>
        (p.title || "").toLowerCase().includes(s) ||
        (p.body || "").toLowerCase().includes(s) ||
        (p.tags || []).join(" ").toLowerCase().includes(s)
      );
    }
    return list;
  }, [posts, tab, q]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(900px 200px at 80% -10%, rgba(251,176,26,0.15), transparent 60%)" }}
        />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Community</h1>
              <p className="text-white/70 mt-1">Share tips, ask questions, join events — all things Ceylon Colony 🍯</p>
            </div>
            <button
              className="rounded-xl bg-[#FBB01A] text-black font-semibold px-4 py-2 shadow-neon hover:brightness-95"
              onClick={() => setOpenCreate(true)}
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
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
              />
              <div className="absolute left-3 top-2.5 text-white/60">🔎</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-3.5 py-2 text-sm border transition ${
                    tab === t ? "bg-[#FBB01A] text-black border-transparent" : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SHORT VIDEOS (from backend) */}
      <ShortVideosRow videos={shorts} products={PRODUCTS} />

      {/* BODY */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT / FEED */}
          <div className="lg:col-span-8 space-y-6">
            {/* Composer (mock) */}
            <div className="rounded-2xl bg-black/50 border border-white/10 p-4 shadow-inset-neon">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full grid place-items-center bg-black/60 border border-white/10">🐝</div>
                <input
                  placeholder="Share a tip, question, recipe…"
                  className="flex-1 rounded-xl px-3 py-2 bg-white/5 border border-white/10 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
                />
                <button
                  onClick={() => setOpenCreate(true)}
                  className="rounded-xl bg-[#FBB01A] text-black font-semibold px-4 py-2 hover:brightness-95"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts (REAL: Discussions + Gallery) */}
            {filtered.map((p) => (
              <article key={p.id} className="rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-neon">
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

                  {p.title && <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>}
                  {p.body && <p className="mt-1 text-white/80">{p.body}</p>}

                  {p.image && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                      <img src={p.image} alt="" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {(p.tags || []).map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">#{t}</span>
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
                  <div key={e.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
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
                  <button
                    key={t}
                    onClick={() => setQ(t)}
                    className="px-3 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 hover:bg-white/10"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>

            {/* Top contributors */}
            <div className="rounded-2xl bg-black/60 border border-white/10 p-4">
              <h3 className="font-semibold">Top contributors</h3>
              <ul className="mt-3 space-y-2">
                {[
                  { name: "Nishan", points: 420 },
                  { name: "Tharushi", points: 355 },
                  { name: "Sameera", points: 290 },
                  { name: "Ishara", points: 220 },
                ].map((c, i) => (
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

      <Footer />

      {/* Start Post modal */}
      <StartPostForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => { loadShorts(); loadFeed(); }}  // refresh both after posting
        currentUser={{ userId: "u001", username: "Nishan", avatarUrl: "https://i.pravatar.cc/100?img=5" }}
      />
    </div>
  );
}
