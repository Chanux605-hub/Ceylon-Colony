import React, { useEffect, useMemo, useState } from "react";
import {
  Plus, Search, Filter, Eye, Trash2,
  Heart, MessageCircle, PlayCircle, User, Tag as TagIcon, BarChart2,
  CheckCircle2, XCircle
} from "lucide-react";

/* =========================================================================================
   CONFIG & UTILS
   - API base
   - Lightweight fetch helper
   - UI helpers (date, assets)
========================================================================================= */

/** Backend base URL from env (fallback to localhost) */
const API = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");

/** Simple fetch wrapper that throws on non-2xx and returns JSON */
async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.text()) || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

/** Format ISO date to local datetime string (keeps UI consistent) */
const fmtDateTime = (iso) => {
  try { return new Date(iso).toLocaleString(); } catch { return ""; }
};

/** Load a sample asset from /src/assets (used by seed content only) */
const asset = (file) => new URL(`../../../assets/${file}`, import.meta.url).href;

/** Compare 2 dates for same calendar day (for KPI: Submissions Today) */
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/* =========================================================================================
   MOCK / SEED CONTENT (used for KPIs, charts, and Top5 cards to keep page rich)
   - Does not affect backend-connected “Pending” or “All Content” areas.
========================================================================================= */

const TAGS = ["skincare", "recipe", "health", "honey", "ceylon"];
const PRODUCTS = ["Wildflower Honey 500g", "Cinnamon Honey 250g", "Bee Pollen 100g"];
const USERS = [
  { id: "u1", name: "Amal Perera" },
  { id: "u2", name: "Kavindi Silva" },
  { id: "u3", name: "Ruwan Jayas" },
  { id: "u4", name: "Nuwan Kumara" },
];
const thumbs = ["thumb1.jpg", "thumb2.jpg", "thumb3.jpg", "thumb4.jpg", "thumb5.jpg"];

/** Create mock dataset once for demo stats/charts (unchanged behavior) */
function makeSeed() {
  const now = new Date();
  const daysAgoISO = (d) => {
    const x = new Date(now);
    x.setDate(x.getDate() - d);
    return x.toISOString();
  };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const items = [];

  for (let i = 0; i < 60; i++) {
    const type = Math.random() > 0.35 ? "video" : "image";
    const tags = [pick(TAGS)];
    if (Math.random() > 0.7) tags.push(pick(TAGS));
    const status = Math.random() > 0.25 ? "approved" : "pending";
    const likes = Math.floor(Math.random() * 600);
    const comments = Math.floor(Math.random() * 150);
    const views = type === "video" ? Math.floor(Math.random() * 12000) : Math.floor(Math.random() * 4000);

    items.push({
      id: `m_${i + 1}`,
      type,                         // "video" | "image" (for mock only)
      title: type === "video" ? `Short clip #${i + 1}` : `Image post #${i + 1}`,
      user: pick(USERS),
      tags,
      product: pick(PRODUCTS),
      status,
      createdAt: daysAgoISO(Math.floor(Math.random() * 45)),
      metrics: { likes, comments, views },
      thumb: asset(pick(thumbs)),
    });
  }
  return items;
}

/* =========================================================================================
   MAIN PAGE COMPONENT
========================================================================================= */

export default function CustomerMediaManagement() {
  /* ---------------------------------------------
     LOCAL MOCK STATE (for KPIs/charts/top videos)
     - Kept as-is; persists to localStorage
  ---------------------------------------------- */
  const [contents, setContents] = useState(() => {
    const saved = localStorage.getItem("admin_media_contents");
    return saved ? JSON.parse(saved) : makeSeed();
  });
  useEffect(() => {
    localStorage.setItem("admin_media_contents", JSON.stringify(contents));
  }, [contents]);

  /* ---------------------------------------------
     GLOBAL CONTROLS (search + filters)
  ---------------------------------------------- */
  const [q, setQ] = useState("");            // global search
  const [range, setRange] = useState("7d");  // 7d | 30d | all
  const [filterTag, setFilterTag] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [videoSort, setVideoSort] = useState("likes"); // likes | comments | views
  const [videoProduct, setVideoProduct] = useState("all");

  /* ---------------------------------------------
     SELECT OPTIONS derived from mock content
  ---------------------------------------------- */
  const tagOptions = useMemo(
    () => ["all", ...Array.from(new Set(contents.flatMap((c) => c.tags)))],
    [contents]
  );
  const productOptions = useMemo(
    () => ["all", ...Array.from(new Set(contents.map((c) => c.product)))],
    [contents]
  );

  /* ---------------------------------------------
     KPIs from mock content
  ---------------------------------------------- */
  const today = new Date();
  const submissionsToday = useMemo(
    () => contents.filter((c) => isSameDay(new Date(c.createdAt), today)).length,
    [contents]
  );

  const topContributor = useMemo(() => {
    const byUser = new Map();
    contents.forEach((c) => {
      const key = c.user.name;
      if (!byUser.has(key)) byUser.set(key, { name: c.user.name, count: 0, tagFreq: new Map() });
      const entry = byUser.get(key);
      entry.count += 1;
      c.tags.forEach((t) => entry.tagFreq.set(t, (entry.tagFreq.get(t) || 0) + 1));
    });
    const arr = [...byUser.values()].sort((a, b) => b.count - a.count);
    if (!arr.length) return null;
    const chosen = arr[0];
    const topTag = [...chosen.tagFreq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    return { name: chosen.name, tag: topTag };
  }, [contents]);

  const topTagUniqueUsers = useMemo(() => {
    const m = new Map(); // tag -> Set(userId)
    contents.forEach((c) =>
      c.tags.forEach((t) => {
        if (!m.has(t)) m.set(t, new Set());
        m.get(t).add(c.user.id);
      })
    );
    const list = [...m.entries()].map(([tag, set]) => ({ tag, users: set.size }));
    list.sort((a, b) => b.users - a.users);
    return list[0] || null;
  }, [contents]);

  /* ---------------------------------------------
     CHART DATA from mock content
  ---------------------------------------------- */
  const yearsAvailable = useMemo(
    () => [...new Set(contents.map((c) => new Date(c.createdAt).getFullYear()))].sort((a, b) => b - a),
    [contents]
  );
  const [year, setYear] = useState(() => yearsAvailable[0] || new Date().getFullYear());
  useEffect(() => {
    if (yearsAvailable.length && !yearsAvailable.includes(year)) setYear(yearsAvailable[0]);
  }, [yearsAvailable, year]);

  const monthlyByYear = useMemo(() => {
    const map = new Map();
    contents.forEach((c) => {
      const d = new Date(c.createdAt);
      const y = d.getFullYear();
      if (!map.has(y)) map.set(y, Array(12).fill(0));
      map.get(y)[d.getMonth()] += 1;
    });
    return map;
  }, [contents]);

  const submissionsByMonth = useMemo(
    () => monthlyByYear.get(year) ?? Array(12).fill(0),
    [monthlyByYear, year]
  );

  const monthlyAverage = useMemo(() => {
    const years = [...monthlyByYear.values()];
    if (years.length === 0) return Array(12).fill(0);
    const sums = Array(12).fill(0);
    years.forEach((arr) => arr.forEach((v, i) => (sums[i] += v)));
    return sums.map((v) => Math.round(v / years.length));
  }, [monthlyByYear]);

  /* ---------------------------------------------
     PIE (Tag-wise uploads) from mock content
  ---------------------------------------------- */
  const [pieRange, setPieRange] = useState("7d"); // "7d" | "30d"
  const pieRows = useMemo(() => {
    const now = new Date();
    const days = pieRange === "7d" ? 7 : 30;
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - days);
    return contents.filter((c) => new Date(c.createdAt) >= cutoff);
  }, [contents, pieRange]);

  const PIE_COLORS = ["#FBB01A", "#F59E0B", "#EAB308", "#D97706", "#A3E635", "#34D399", "#60A5FA"];
  const pieCounts = useMemo(() => {
    const m = new Map(); // tag -> count
    pieRows.forEach((c) => c.tags.forEach((t) => m.set(t, (m.get(t) || 0) + 1)));
    const arr = [...m.entries()].map(([label, value]) => ({ label, value }));
    arr.sort((a, b) => b.value - a.value);
    if (arr.length > 6) {
      const top = arr.slice(0, 6);
      const other = arr.slice(6).reduce((s, r) => s + r.value, 0);
      top.push({ label: "other", value: other });
      return top;
    }
    return arr;
  }, [pieRows]);

  /* ---------------------------------------------
     TOP 5 short videos (mock content)
  ---------------------------------------------- */
  const top5Videos = useMemo(() => {
    let vids = contents.filter((c) => c.type === "video");
    if (videoProduct !== "all") vids = vids.filter((v) => v.product === videoProduct);
    vids.sort((a, b) => (b.metrics[videoSort] || 0) - (a.metrics[videoSort] || 0));
    return vids.slice(0, 5);
  }, [contents, videoSort, videoProduct]);

  /* ---------------------------------------------
     BACKEND — Pending uploads (image/short only)
     - Load list
     - Approve / Reject / Delete
     - Small "review" modal with actions
  ---------------------------------------------- */
  const [pendingUploads, setPendingUploads] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [selected, setSelected] = useState(null);  // item selected for the (pending) review modal
  const [acting, setActing] = useState(false);     // disable action buttons while calling API

  /** Fetch pending uploads from backend (status=pending) */
  const loadPending = async () => {
    try {
      setPendingLoading(true);
      const data = await fetchJson(`${API}/api/admin/posts?status=pending&sortBy=createdAt&order=desc&limit=200`);
      const items = Array.isArray(data?.items) ? data.items : [];

      // Only "image" or "short" content types (your requirement)
      const shaped = items
        .filter((p) => p?.contentType === "image" || p?.contentType === "short")
        .map((p) => ({
          id: p._id,
          title: p.title || (p.contentType === "image" ? "Image post" : "Short clip"),
          description: p.description || "",
          tags: Array.isArray(p.tags) ? p.tags : [],
          product: p.productId || "",
          status: p.status || "pending",
          type: p.contentType,                 // "image" | "short"
          createdAt: p.createdAt,
          author: p.author?.username || "Unknown",
          avatarUrl: p.author?.avatarUrl || "",
          mediaUrl: p.mediaUrl || "",
          posterUrl: p.posterUrl || "",
          views: p.views ?? 0,
          likes: p.likes ?? 0,
          comments: p.commentsCount ?? 0,
        }));

      setPendingUploads(shaped);
    } catch (err) {
      alert(`Failed to load pending uploads: ${err.message}`);
    } finally {
      setPendingLoading(false);
    }
  };
  useEffect(() => { loadPending(); }, []);

  /** Approve or reject a pending row, then refresh "All Content" */
  const approveReject = async (row, status) => {
    if (!row?.id) return;
    try {
      setActing(true);
      await fetchJson(`${API}/api/admin/posts/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      // Remove from pending immediately
      setPendingUploads((list) => list.filter((c) => c.id !== row.id));
      if (selected?.id === row.id) setSelected(null);
      // Refresh "All Content" list to reflect new status
      loadAllContent();
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setActing(false);
    }
  };

  /** Delete a pending row, then refresh "All Content" */
  const deletePending = async (row) => {
    if (!row?.id) return;
    if (!confirm("Delete this media item?")) return;
    try {
      setActing(true);
      await fetchJson(`${API}/api/admin/posts/${row.id}`, { method: "DELETE" });
      setPendingUploads((list) => list.filter((c) => c.id !== row.id));
      if (selected?.id === row.id) setSelected(null);
      loadAllContent();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setActing(false);
    }
  };

  /** Filter pending list by global search (kept as-is) */
  const pendingFiltered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return pendingUploads;
    return pendingUploads.filter((row) =>
      (row.title || "").toLowerCase().includes(s) ||
      (row.author || "").toLowerCase().includes(s) ||
      (row.product || "").toLowerCase().includes(s) ||
      row.tags.join(" ").toLowerCase().includes(s)
    );
  }, [pendingUploads, q]);

  /* ---------------------------------------------
     BACKEND — All Content (approved/rejected only)
     - Read-only "review" modal for any row
  ---------------------------------------------- */
  const [allContent, setAllContent] = useState([]);
  const [allLoading, setAllLoading] = useState(true);
  const [selectedReviewed, setSelectedReviewed] = useState(null); // read-only modal item

  /** Fetch all content, keep only approved/rejected image/short */
  const loadAllContent = async () => {
    try {
      setAllLoading(true);
      const data = await fetchJson(`${API}/api/admin/posts?sortBy=createdAt&order=desc&limit=500`);
      const items = Array.isArray(data?.items) ? data.items : [];

      const filtered = items
        .filter(
          (p) =>
            (p.status === "approved" || p.status === "rejected") &&
            (p.contentType === "image" || p.contentType === "short")
        )
        .map((p) => ({
          id: p._id,
          title: p.title || (p.contentType === "short" ? "Short clip" : "Image post"),
          type: p.contentType === "short" ? "Video" : "Image", // display string for the table
          typeInternal: p.contentType,                          // "short" | "image" (for modal)
          tags: Array.isArray(p.tags) ? p.tags : [],
          product: p.productId || "",
          status: p.status,
          metrics: {
            likes: p.likes ?? 0,
            comments: p.commentsCount ?? 0,
            views: p.views ?? 0,
          },
          createdAt: p.createdAt,
          mediaUrl: p.mediaUrl || "",
          posterUrl: p.posterUrl || "",
          description: p.description || "",
          author: p.author?.username || "Unknown",
          avatarUrl: p.author?.avatarUrl || "",
        }));

      setAllContent(filtered);
    } catch (err) {
      alert(`Failed to load all content: ${err.message}`);
    } finally {
      setAllLoading(false);
    }
  };
  useEffect(() => { loadAllContent(); }, []);

  /** Compose filters over backend-provided "All Content" for the table */
  const allContentFilteredBackend = useMemo(() => {
    const s = q.trim().toLowerCase();
    const now = new Date();
    let rows = allContent.slice();

    // Time range filter
    if (range !== "all") {
      const days = range === "7d" ? 7 : 30;
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - days);
      rows = rows.filter((c) => new Date(c.createdAt) >= cutoff);
    }
    // Tag filter
    if (filterTag !== "all") rows = rows.filter((c) => c.tags.includes(filterTag));
    // Product filter
    if (filterProduct !== "all") rows = rows.filter((c) => c.product === filterProduct);
    // Text search
    if (s) {
      rows = rows.filter(
        (c) =>
          (c.title || "").toLowerCase().includes(s) ||
          (c.author || "").toLowerCase().includes(s) ||
          c.tags.join(",").toLowerCase().includes(s) ||
          (c.product || "").toLowerCase().includes(s)
      );
    }

    rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return rows;
  }, [allContent, q, range, filterTag, filterProduct]);

  /* ---------------------------------------------
     (Legacy) mock "All Content" derivation (unchanged)
     - Left intact for your existing widgets
  ---------------------------------------------- */
  const allContentFiltered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const now = new Date();
    let rows = contents.slice();

    if (range !== "all") {
      const days = range === "7d" ? 7 : 30;
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - days);
      rows = rows.filter((c) => new Date(c.createdAt) >= cutoff);
    }
    if (filterTag !== "all") rows = rows.filter((c) => c.tags.includes(filterTag));
    if (filterProduct !== "all") rows = rows.filter((c) => c.product === filterProduct);
    if (s)
      rows = rows.filter(
        (c) =>
          c.title.toLowerCase().includes(s) ||
          c.user.name.toLowerCase().includes(s) ||
          c.tags.join(",").toLowerCase().includes(s) ||
          c.product.toLowerCase().includes(s)
      );

    rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return rows;
  }, [contents, q, range, filterTag, filterProduct]);

  /* ---------------------------------------------
     Misc handlers preserved (used in legacy UI)
  ---------------------------------------------- */
  const reviewItem = (row) => alert(`Review ${row.id} — open your review UI here.`);
  const deleteItem = (row) => {
    if (!confirm("Delete this media item?")) return;
    setContents((list) => list.filter((c) => c.id !== row.id));
  };

  /* =========================================================================================
     RENDER
  ========================================================================================= */
  return (
    <div className="space-y-6 text-white">
      {/* ===== Header + Global controls ===== */}
      <HeaderControls
        q={q}
        setQ={setQ}
        range={range}
        setRange={setRange}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        filterProduct={filterProduct}
        setFilterProduct={setFilterProduct}
        tagOptions={tagOptions}
        productOptions={productOptions}
      />

      {/* ===== KPIs ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Kpi title="Submissions Today" icon={<BarChart2 className="h-4 w-4" />} value={submissionsToday} />
        <Kpi
          title="Top Contributor"
          icon={<User className="h-4 w-4" />}
          value={topContributor ? `${topContributor.name} — #${topContributor.tag}` : "—"}
        />
        <Kpi
          title="Top Tag (Users)"
          icon={<TagIcon className="h-4 w-4" />}
          value={topTagUniqueUsers ? `#${topTagUniqueUsers.tag} — ${topTagUniqueUsers.users}` : "—"}
        />
      </div>

      {/* ===== Charts row: Pie + Bars ===== */}
      <div className="grid md:grid-cols-2 gap-4">
        <PiePanel
          pieRange={pieRange}
          setPieRange={setPieRange}
          pieCounts={pieCounts}
          PIE_COLORS={PIE_COLORS}
        />
        <BarsPanel
          yearsAvailable={yearsAvailable}
          year={year}
          setYear={setYear}
          submissionsByMonth={submissionsByMonth}
          monthlyAverage={monthlyAverage}
        />
      </div>

      {/* ===== Top 5 Short Videos (mock) ===== */}
      <Top5Videos
        top5Videos={top5Videos}
        videoSort={videoSort}
        setVideoSort={setVideoSort}
        videoProduct={videoProduct}
        setVideoProduct={setVideoProduct}
        productOptions={productOptions}
      />

      {/* ===== Pending uploads (backend) ===== */}
      <PendingUploadsTable
        rows={pendingFiltered}
        loading={pendingLoading}
        onReview={setSelected}
        onDelete={deletePending}
      />

      {/* ===== All Content (backend) ===== */}
      <AllContentTable
        rows={allContentFilteredBackend}
        loading={allLoading}
        onReview={setSelectedReviewed}
      />

      {/* ===== Modals ===== */}
      <PendingReviewModal
        item={selected}
        onClose={() => setSelected(null)}
        onApprove={(row) => approveReject(row, "approved")}
        onReject={(row) => approveReject(row, "rejected")}
        onDelete={(row) => deletePending(row)}
        acting={acting}
      />

      <ReviewedReadOnlyModal
        item={selectedReviewed}
        onClose={() => setSelectedReviewed(null)}
      />
    </div>
  );
}

/* =========================================================================================
   PRESENTATION COMPONENTS (unchanged styles/behavior, added small comments)
========================================================================================= */

/** Header + global filters/search */
function HeaderControls({
  q, setQ, range, setRange,
  filterTag, setFilterTag,
  filterProduct, setFilterProduct,
  tagOptions, productOptions
}) {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-semibold">Customer Media &amp; Engagement</div>
          <p className="text-white/70 text-sm">Moderate content, track submissions, and review top videos.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-12">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, user, tag, product…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
          />
        </div>

        {/* Range */}
        <div className="md:col-span-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/60" />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
            >
              <option value="7d" className="bg-[#121212]">Last 7 days</option>
              <option value="30d" className="bg-[#121212]">Last 30 days</option>
              <option value="all" className="bg-[#121212]">All time</option>
            </select>
          </div>
        </div>

        {/* Tag */}
        <div className="md:col-span-2">
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
          >
            {tagOptions.map((t) => (
              <option key={t} value={t} className="bg-[#121212]">
                {t === "all" ? "All tags" : `#${t}`}
              </option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div className="md:col-span-2">
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
          >
            {productOptions.map((p) => (
              <option key={p} value={p} className="bg-[#121212]">
                {p === "all" ? "All products" : p}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

/** KPI card (reused) */
function Kpi({ title, icon, value }) {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/60">{title}</div>
        <div className="text-white/70">{icon}</div>
      </div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

/** Left panel: tag-wise uploads pie */
function PiePanel({ pieRange, setPieRange, pieCounts, PIE_COLORS }) {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        {/* range selector */}
        <div className="flex items-center gap-2">
          <select
            className="bg-white/5 border border-white/10 text-white rounded-md text-sm px-2 py-1"
            value={pieRange}
            onChange={(e) => setPieRange(e.target.value)}
            title="Range"
          >
            <option value="7d" className="bg-[#121212]">Week</option>
            <option value="30d" className="bg-[#121212]">Month</option>
          </select>
        </div>
        <div className="text-sm font-semibold">Tag-wise Uploads</div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* donut */}
        <div className="flex-1 min-w-[220px]">
          <PieDonut
            data={pieCounts.map((d, i) => ({ ...d, color: PIE_COLORS[i % PIE_COLORS.length] }))}
            size={200}
            strokeWidth={22}
          />
        </div>

        {/* legend */}
        <div className="sm:w-56 grid grid-cols-1 gap-2">
          {pieCounts.length === 0 ? (
            <div className="text-white/60 text-sm">No uploads in this range.</div>
          ) : (
            pieCounts.map((s, i) => (
              <div key={s.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="truncate">#{s.label}</span>
                </div>
                <span className="text-white/70">{s.value}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/** Right panel: submissions by month bars + average line */
function BarsPanel({ yearsAvailable, year, setYear, submissionsByMonth, monthlyAverage }) {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Submissions by Month</div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/60">Year</label>
          <select
            className="bg-white/5 border border-white/10 text-white rounded-md text-sm px-2 py-1"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
          >
            {yearsAvailable.map((y) => (
              <option key={y} value={y} className="bg-[#121212]">
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BarsWithAverage
        labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}
        data={submissionsByMonth}
        avg={monthlyAverage}
      />
    </div>
  );
}

/** Top-5 videos card grid (mock data) */
function Top5Videos({ top5Videos, videoSort, setVideoSort, videoProduct, setVideoProduct, productOptions }) {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Top 5 Short Videos</div>
        <div className="flex items-center gap-2">
          <select
            className="bg-white/5 border border-white/10 text-white rounded-md text-sm px-2 py-1"
            value={videoSort}
            onChange={(e) => setVideoSort(e.target.value)}
            title="Sort by"
          >
            <option value="likes" className="bg-[#121212]">Most likes</option>
            <option value="comments" className="bg-[#121212]">Most comments</option>
            <option value="views" className="bg-[#121212]">Most views</option>
          </select>
          <select
            className="bg-white/5 border border-white/10 text-white rounded-md text-sm px-2 py-1"
            value={videoProduct}
            onChange={(e) => setVideoProduct(e.target.value)}
            title="Filter by product"
          >
            {productOptions.map((p) => (
              <option key={p} value={p} className="bg-[#121212]">
                {p === "all" ? "All products" : p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {top5Videos.map((v) => (
          <div key={v.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="aspect-video rounded-md overflow-hidden bg-black/30 mb-2">
              <img src={v.thumb} alt={v.title} className="h-full w-full object-cover opacity-90" />
            </div>
            <div className="text-sm font-medium truncate" title={v.title}>{v.title}</div>
            <div className="text-xs text-white/60 mt-1 truncate">#{v.tags[0]} · {v.product}</div>
            <div className="text-[11px] text-white/50 mt-1">by {v.user.name}</div>
            <div className="flex gap-3 text-[11px] text-white/70 mt-2">
              <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {v.metrics.likes}</span>
              <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {v.metrics.comments}</span>
              <span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" /> {v.metrics.views}</span>
            </div>
          </div>
        ))}
        {top5Videos.length === 0 && (
          <div className="col-span-full text-center text-white/60 py-6">No videos match these filters.</div>
        )}
      </div>
    </div>
  );
}

/** Pending uploads (backend table) */
function PendingUploadsTable({ rows, loading, onReview, onDelete }) {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
      <div className="px-5 py-3 border-b border-white/10 text-sm font-semibold">
        New Uploads (Pending){loading ? " — Loading…" : ` — ${rows.length}`}
      </div>

      <div className="overflow-x-auto">
        {/* Columns requested: Type | Author | Tags | Product | Created | Status | Action */}
        <table className="min-w-[860px] w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr className="text-left">
              <th className="py-3 pl-5 pr-4">Type</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Tag(s)</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right pr-5">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10 text-white">
            {/* Loading state */}
            {loading && (
              <tr><td colSpan="7" className="py-10 text-center text-white/60">Loading…</td></tr>
            )}

            {/* Rows */}
            {!loading && rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/5">
                <td className="py-3 pl-5 pr-4 capitalize">{row.type}</td>
                <td className="py-3 px-4">{row.author}</td>
                <td className="py-3 px-4">{row.tags.map((t) => `#${t}`).join(", ") || "—"}</td>
                <td className="py-3 px-4">{row.product || "—"}</td>
                <td className="py-3 px-4 whitespace-nowrap">{fmtDateTime(row.createdAt)}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-300">
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2 pr-1">
                    <button
                      onClick={() => onReview(row)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10"
                      title="Review"
                    >
                      <Eye size={16} /> Review
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-red-300"
                      title="Delete"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {!loading && rows.length === 0 && (
              <tr><td colSpan="7" className="py-10 text-center text-white/60">Nothing pending.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** All content table (backend data only) with read-only review action */
function AllContentTable({ rows, loading, onReview }) {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">All Content</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr className="text-left">
              <th className="py-3 pl-5 pr-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Tag(s)</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Likes</th>
              <th className="py-3 px-4">Comments</th>
              <th className="py-3 px-4">Views</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right pr-5">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10 text-white">
            {/* Loading */}
            {loading && (
              <tr><td colSpan="11" className="py-10 text-center text-white/60">Loading…</td></tr>
            )}

            {/* Rows */}
            {!loading && rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/5">
                <td className="py-3 pl-5 pr-4">{row.id}</td>
                <td className="py-3 px-4">{row.title}</td>
                <td className="py-3 px-4">{row.type}</td>
                <td className="py-3 px-4">{row.tags.map((t) => `#${t}`).join(", ")}</td>
                <td className="py-3 px-4">{row.product || "—"}</td>
                <td className="py-3 px-4 capitalize">{row.status}</td>
                <td className="py-3 px-4">{row.metrics.likes}</td>
                <td className="py-3 px-4">{row.metrics.comments}</td>
                <td className="py-3 px-4">{row.metrics.views}</td>
                <td className="py-3 px-4 whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end pr-1">
                    <button
                      onClick={() => onReview(row)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10"
                      title="Review"
                    >
                      <Eye size={16} /> Review
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty */}
            {!loading && rows.length === 0 && (
              <tr><td colSpan="11" className="py-10 text-center text-white/60">No content for these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Modal for reviewing PENDING items (approve/reject/delete) */
function PendingReviewModal({ item, onClose, onApprove, onReject, onDelete, acting }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-[#111] border border-white/10 shadow-neon overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center">
                {item.type === "short" ? "🎬" : "🖼️"}
              </div>
            )}
            <div>
              <div className="font-semibold">{item.author}</div>
              <div className="text-xs text-white/60">
                {item.type === "short" ? "Short video" : "Image"} • {fmtDateTime(item.createdAt)}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white" title="Close">✕</button>
        </div>

        {/* Body */}
        <div className="p-4">
          {item.title && <h3 className="text-lg font-semibold">{item.title}</h3>}
          {item.description && <p className="mt-1 text-white/80">{item.description}</p>}

          <div className="mt-3 rounded-xl overflow-hidden border border-white/10 bg-black">
            {item.type === "short" ? (
              <video
                src={item.mediaUrl}
                poster={item.posterUrl}
                className="w-full h-full object-cover"
                controls
                playsInline
              />
            ) : (
              <img src={item.mediaUrl} alt="" className="w-full h-auto object-cover" />
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(item.tags || []).map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">#{t}</span>
            ))}
            {item.product && (
              <span className="text-xs px-2 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-200/30">
                {item.product}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-white/10 flex flex-wrap items-center gap-2 justify-end">
          <button
            disabled={acting}
            onClick={() => onApprove(item)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-green-500/20 border border-green-400/30 hover:bg-green-500/30 text-green-300 disabled:opacity-60"
          >
            <CheckCircle2 size={18} /> Approve
          </button>
          <button
            disabled={acting}
            onClick={() => onReject(item)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 text-red-300 disabled:opacity-60"
          >
            <XCircle size={18} /> Reject
          </button>
          <button
            disabled={acting}
            onClick={() => onDelete(item)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-red-300 disabled:opacity-60"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/** Modal for reviewed items (approved/rejected) — READ ONLY */
function ReviewedReadOnlyModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-[#111] border border-white/10 shadow-neon overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center">
                {item.typeInternal === "short" ? "🎬" : "🖼️"}
              </div>
            )}
            <div>
              <div className="font-semibold">{item.author || "User"}</div>
              <div className="text-xs text-white/60">
                {item.type} • {fmtDateTime(item.createdAt)}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white" title="Close">✕</button>
        </div>

        {/* Body */}
        <div className="p-4">
          {item.title && <h3 className="text-lg font-semibold">{item.title}</h3>}
          {item.description && <p className="mt-1 text-white/80">{item.description}</p>}

          <div className="mt-3 rounded-xl overflow-hidden border border-white/10 bg-black">
            {item.typeInternal === "short" ? (
              <video
                src={item.mediaUrl}
                poster={item.posterUrl}
                className="w-full h-full object-cover"
                controls
                playsInline
              />
            ) : (
              <img src={item.mediaUrl} alt="" className="w-full h-auto object-cover" />
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(item.tags || []).map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">#{t}</span>
            ))}
            {item.product && (
              <span className="text-xs px-2 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-200/30">
                {item.product}
              </span>
            )}
            <span className="ml-auto text-xs px-2 py-1 rounded bg-white/5 border border-white/10 capitalize">
              {item.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="rounded-lg px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================================
   CHART PRIMITIVES (unchanged UI)
========================================================================================= */

/** Simple bars with average guideline (SVG) */
function BarsWithAverage({ labels = [], data = [], avg = [], height = 200, pad = 28 }) {
  const max = Math.max(1, ...data, ...avg);
  const W = Math.max(360, labels.length * 42);
  const H = height;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;
  const slot = innerW / labels.length;
  const barW = Math.max(12, slot * 0.5);

  const y = (v) => pad + innerH - (v / max) * innerH;
  const x = (i) => pad + i * slot + (slot - barW) / 2;

  const avgPath = avg.map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * slot + slot / 2} ${y(v)}`).join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg width={W} height={H} className="block">
        {/* Axes */}
        <line x1={pad} y1={pad + innerH} x2={pad + innerW} y2={pad + innerH} stroke="currentColor" className="text-white/15" />
        <line x1={pad} y1={pad} x2={pad} y2={pad + innerH} stroke="currentColor" className="text-white/15" />

        {/* Bars */}
        {data.map((v, i) => {
          const bx = x(i);
          const by = y(v);
          const h = pad + innerH - by;
          return (
            <g key={i}>
              <rect x={bx} y={by} width={barW} height={h} fill="#FBB01A" opacity="0.95">
                <title>{`${labels[i]} — ${v}`}</title>
              </rect>
              <text x={bx + barW / 2} y={by - 6} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.8)">
                {v}
              </text>
            </g>
          );
        })}

        {/* Average line & points */}
        <path d={avgPath} fill="none" stroke="rgba(255,255,255,0.6)" strokeDasharray="4 3" strokeWidth="1.5" />
        {avg.map((v, i) => (
          <circle key={i} cx={pad + i * slot + slot / 2} cy={y(v)} r={2.5} fill="rgba(255,255,255,0.7)" />
        ))}

        {/* X labels */}
        {labels.map((lab, i) => (
          <text key={lab} x={pad + i * slot + slot / 2} y={pad + innerH + 14} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)">
            {lab}
          </text>
        ))}

        {/* Legend */}
        <g transform={`translate(${pad}, ${pad - 10})`}>
          <rect x="0" y="-8" width="10" height="10" rx="2" fill="#FBB01A" />
          <text x="14" y="0" fontSize="11" fill="rgba(255,255,255,0.8)">Selected year</text>
          <line x1="110" y1="-3" x2="130" y2="-3" stroke="rgba(255,255,255,0.7)" strokeDasharray="4 3" strokeWidth="1.5" />
          <text x="136" y="0" fontSize="11" fill="rgba(255,255,255,0.8)">Average</text>
        </g>
      </svg>
    </div>
  );
}

/** Donut (pie) chart (SVG) */
function PieDonut({ data = [], size = 200, strokeWidth = 20 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - strokeWidth) / 2;
  const C = 2 * Math.PI * r;

  let acc = 0;
  const slices = data.map((d) => {
    const frac = total ? d.value / total : 0;
    const len = frac * C;
    const slice = { color: d.color, len, off: acc, label: d.label, value: d.value };
    acc += len;
    return slice;
  });

  return (
    <svg width={size} height={size} className="block">
      <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
        <circle r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
        {slices.map((s, i) => (
          <circle
            key={i}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${s.len} ${C - s.len}`}
            strokeDashoffset={-s.off}
            strokeLinecap="butt"
          >
            <title>#{s.label}: {s.value}</title>
          </circle>
        ))}
      </g>

      {/* Center label */}
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <text x="0" y="-2" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.9)" className="font-semibold">
          {total}
        </text>
        <text x="0" y="14" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)">
          uploads
        </text>
      </g>
    </svg>
  );
}
