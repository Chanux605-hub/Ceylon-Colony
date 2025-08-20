import React, { useEffect, useMemo, useState } from "react";
import {
  Plus, Search, Filter, Eye, Trash2,
  Heart, MessageCircle, PlayCircle, User, Tag as TagIcon, BarChart2
} from "lucide-react";

/* -------------------------------------------------------
   Helpers (same vibe as your Products page)
------------------------------------------------------- */

// Resolve sample assets from /src/assets
const asset = (file) => new URL(`../../../assets/${file}`, import.meta.url).href;

// Date helpers
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/* -------------------------------------------------------
   Seed dataset (mock) — backend will replace later
   Keep this shape for easy swap-in.
------------------------------------------------------- */
const TAGS = ["skincare", "recipe", "health", "honey", "ceylon"];
const PRODUCTS = ["Wildflower Honey 500g", "Cinnamon Honey 250g", "Bee Pollen 100g"];
const USERS = [
  { id: "u1", name: "Amal Perera" },
  { id: "u2", name: "Kavindi Silva" },
  { id: "u3", name: "Ruwan Jayas" },
  { id: "u4", name: "Nuwan Kumara" },
];
const thumbs = ["thumb1.jpg", "thumb2.jpg", "thumb3.jpg", "thumb4.jpg", "thumb5.jpg"]; // put these in /src/assets or replace names

function makeSeed() {
  const now = new Date();
  const daysAgoISO = (d) => {
    const x = new Date(now);
    x.setDate(x.getDate() - d);
    return x.toISOString();
  };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const contents = [];
  for (let i = 0; i < 60; i++) {
    const type = Math.random() > 0.35 ? "video" : "image";
    const tags = [pick(TAGS)];
    if (Math.random() > 0.7) tags.push(pick(TAGS));
    const status = Math.random() > 0.25 ? "approved" : "pending";
    const likes = Math.floor(Math.random() * 600);
    const comments = Math.floor(Math.random() * 150);
    const views = type === "video" ? Math.floor(Math.random() * 12000) : Math.floor(Math.random() * 4000);
    contents.push({
      id: `m_${i + 1}`,
      type,
      title: type === "video" ? `Short clip #${i + 1}` : `Image post #${i + 1}`,
      user: pick(USERS),
      tags,
      product: pick(PRODUCTS),
      status,
      createdAt: daysAgoISO(Math.floor(Math.random() * 45)),
      metrics: { likes, comments, views },
      thumb: asset(pick(thumbs)), // supply your files in /assets
    });
  }
  return contents;
}

/* -------------------------------------------------------
   Main component
------------------------------------------------------- */
export default function CustomerMediaManagement() {
  // Data (mock persisted to localStorage)
  const [contents, setContents] = useState(() => {
    const saved = localStorage.getItem("admin_media_contents");
    return saved ? JSON.parse(saved) : makeSeed();
  });
  useEffect(() => {
    localStorage.setItem("admin_media_contents", JSON.stringify(contents));
  }, [contents]);

  // TODO (backend): replace the above with a real fetch and set state:
  // useEffect(() => {
  //   (async () => {
  //     const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/media/overview`, { credentials: "include" });
  //     const json = await res.json(); // ensure it returns an array like `contents`
  //     setContents(json.contents);
  //   })();
  // }, []);

  // Controls
  const [q, setQ] = useState("");
  const [range, setRange] = useState("7d"); // 7d | 30d | all
  const [filterTag, setFilterTag] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [videoSort, setVideoSort] = useState("likes"); // likes | comments | views
  const [videoProduct, setVideoProduct] = useState("all");

  // Derived options
  const tagOptions = useMemo(() => ["all", ...Array.from(new Set(contents.flatMap((c) => c.tags)))], [contents]);
  const productOptions = useMemo(() => ["all", ...Array.from(new Set(contents.map((c) => c.product)))], [contents]);

  // === KPIs ===
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

  // === Submissions by month (bar chart + average line) ===
  const yearsAvailable = useMemo(
    () => [...new Set(contents.map((c) => new Date(c.createdAt).getFullYear()))].sort((a, b) => b - a),
    [contents]
  );

  const [year, setYear] = useState(() => yearsAvailable[0] || new Date().getFullYear());
  useEffect(() => {
    if (yearsAvailable.length && !yearsAvailable.includes(year)) setYear(yearsAvailable[0]);
  }, [yearsAvailable, year]);

  // Build a year -> [12 months] map once
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

  // Bars for the selected year
  const submissionsByMonth = useMemo(
    () => monthlyByYear.get(year) ?? Array(12).fill(0),
    [monthlyByYear, year]
  );

  // Average across all available years (rounded)
  const monthlyAverage = useMemo(() => {
    const years = [...monthlyByYear.values()];
    if (years.length === 0) return Array(12).fill(0);
    const sums = Array(12).fill(0);
    years.forEach((arr) => arr.forEach((v, i) => (sums[i] += v)));
    return sums.map((v) => Math.round(v / years.length));
  }, [monthlyByYear]);

  // === PIE (Tag-wise uploads) ===
  const [pieRange, setPieRange] = useState("7d"); // "7d" | "30d"

  const pieRows = useMemo(() => {
    const now = new Date();
    const days = pieRange === "7d" ? 7 : 30;
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - days);
    return contents.filter((c) => new Date(c.createdAt) >= cutoff);
  }, [contents, pieRange]);

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

  const PIE_COLORS = ["#FBB01A", "#F59E0B", "#EAB308", "#D97706", "#A3E635", "#34D399", "#60A5FA"];

  // === Cards row: Top 5 short videos with filters ===
  const top5Videos = useMemo(() => {
    let vids = contents.filter((c) => c.type === "video");
    if (videoProduct !== "all") vids = vids.filter((v) => v.product === videoProduct);
    vids.sort((a, b) => (b.metrics[videoSort] || 0) - (a.metrics[videoSort] || 0));
    return vids.slice(0, 5);
  }, [contents, videoSort, videoProduct]);

  // === New uploads (pending) ===
  const newUploads = useMemo(
    () => contents.filter((c) => c.status === "pending").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [contents]
  );

  // === All content table (composable filters) ===
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

  // === Actions (UI only) ===
  const reviewItem = (row) => {
    // TODO (backend): navigate to /admin/media/:id or open drawer; PATCH on approve/reject
    alert(`Review ${row.id} — open your review UI here.`);
  };
  const deleteItem = (row) => {
    if (!confirm("Delete this media item?")) return;
    // TODO (backend): DELETE /admin/media/:id then refetch
    setContents((list) => list.filter((c) => c.id !== row.id));
  };

  return (
    <div className="space-y-6 text-white">
      {/* ===== Header card ===== */}
      <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold">Customer Media &amp; Engagement</div>
            <p className="text-white/70 text-sm">Moderate content, track submissions, and review top videos.</p>
          </div>
        </div>

        {/* Controls row (global search + basic filters for the big table) */}
        <div className="mt-4 grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, user, tag, product…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
            />
          </div>
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

      {/* ===== Top KPIs ===== */}
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

      {/* ===== Row: Pie (left) + Bars (right) ===== */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* LEFT — Tag-wise uploads (Pie) */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            {/* dropdown on the LEFT */}
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
            {/* Pie */}
            <div className="flex-1 min-w-[220px]">
              <PieDonut
                data={pieCounts.map((d, i) => ({ ...d, color: PIE_COLORS[i % PIE_COLORS.length] }))}
                size={200}
                strokeWidth={22}
              />
            </div>

            {/* Legend */}
            <div className="sm:w-56 grid grid-cols-1 gap-2">
              {pieCounts.length === 0 ? (
                <div className="text-white/60 text-sm">No uploads in this range.</div>
              ) : (
                pieCounts.map((s, i) => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded"
                        style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="truncate">#{s.label}</span>
                    </div>
                    <span className="text-white/70">{s.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — Submissions by Month (Bars) */}
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
      </div>

      {/* ===== Cards row: Top 5 short videos ===== */}
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

      {/* ===== Ops Table: New Uploads (Pending) ===== */}
      <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 text-sm font-semibold">New Uploads (Pending)</div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr className="text-left">
                <th className="py-3 pl-5 pr-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Tag</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {newUploads.map((row) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="py-3 pl-5 pr-4">{row.id}</td>
                  <td className="py-3 px-4">{row.title}</td>
                  <td className="py-3 px-4">#{row.tags[0]}</td>
                  <td className="py-3 px-4">{row.product}</td>
                  <td className="py-3 px-4 capitalize">
                    <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-300">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2 pr-1">
                      <button
                        onClick={() => reviewItem(row)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10"
                        title="Review"
                      >
                        <Eye size={16} /> Review
                      </button>
                      <button
                        onClick={() => deleteItem(row)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-red-300"
                        title="Delete"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {newUploads.length === 0 && (
                <tr><td colSpan="6" className="py-10 text-center text-white/60">Nothing pending.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Ops Table: All Content (independent filters that compose) ===== */}
      <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">All Content</div>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              className="bg-white/5 border border-white/10 text-white rounded-md text-sm px-2 py-1"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="7d" className="bg-[#121212]">Last 7 days</option>
              <option value="30d" className="bg-[#121212]">Last 30 days</option>
              <option value="all" className="bg-[#121212]">All time</option>
            </select>
            <select
              className="bg-white/5 border border-white/10 text-white rounded-md text-sm px-2 py-1"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            >
              {tagOptions.map((t) => (
                <option key={t} value={t} className="bg-[#121212]">
                  {t === "all" ? "All tags" : `#${t}`}
                </option>
              ))}
            </select>
            <select
              className="bg-white/5 border border-white/10 text-white rounded-md text-sm px-2 py-1"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
            >
              {productOptions.map((p) => (
                <option key={p} value={p} className="bg-[#121212]">
                  {p === "all" ? "All products" : p}
                </option>
              ))}
            </select>
          </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {allContentFiltered.map((row) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="py-3 pl-5 pr-4">{row.id}</td>
                  <td className="py-3 px-4">{row.title}</td>
                  <td className="py-3 px-4 capitalize">{row.type}</td>
                  <td className="py-3 px-4">{row.tags.map((t) => `#${t}`).join(", ")}</td>
                  <td className="py-3 px-4">{row.product}</td>
                  <td className="py-3 px-4 capitalize">{row.status}</td>
                  <td className="py-3 px-4">{row.metrics.likes}</td>
                  <td className="py-3 px-4">{row.metrics.comments}</td>
                  <td className="py-3 px-4">{row.metrics.views}</td>
                  <td className="py-3 px-4">{new Date(row.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {allContentFiltered.length === 0 && (
                <tr><td colSpan="10" className="py-10 text-center text-white/60">No content for these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Small UI bits for this page (no external chart libs)
------------------------------------------------------- */

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

function BarsWithAverage({ labels = [], data = [], avg = [], height = 200, pad = 28 }) {
  // scale
  const max = Math.max(1, ...data, ...avg);
  const W = Math.max(360, labels.length * 42); // responsive width
  const H = height;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;
  const slot = innerW / labels.length;
  const barW = Math.max(12, slot * 0.5);

  const y = (v) => pad + innerH - (v / max) * innerH;
  const x = (i) => pad + i * slot + (slot - barW) / 2;

  // Build average polyline
  const avgPath = avg
    .map((v, i) => `${i === 0 ? "M" : "L"} ${pad + i * slot + slot / 2} ${y(v)}`)
    .join(" ");

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
              <rect
                x={bx}
                y={by}
                width={barW}
                height={h}
                fill="#FBB01A"
                opacity="0.95"
              >
                <title>{`${labels[i]} — ${v}`}</title>
              </rect>
              <text
                x={bx + barW / 2}
                y={by - 6}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(255,255,255,0.8)"
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Average line (across all years) */}
        <path d={avgPath} fill="none" stroke="rgba(255,255,255,0.6)" strokeDasharray="4 3" strokeWidth="1.5">
          <title>Average across years</title>
        </path>

        {/* Average points */}
        {avg.map((v, i) => (
          <circle
            key={i}
            cx={pad + i * slot + slot / 2}
            cy={y(v)}
            r={2.5}
            fill="rgba(255,255,255,0.7)"
          >
            <title>{`Avg ${labels[i]} — ${v}`}</title>
          </circle>
        ))}

        {/* X labels */}
        {labels.map((lab, i) => (
          <text
            key={lab}
            x={pad + i * slot + slot / 2}
            y={pad + innerH + 14}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(255,255,255,0.6)"
          >
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

function PieDonut({ data = [], size = 200, strokeWidth = 20 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - strokeWidth) / 2;
  const C = 2 * Math.PI * r;

  // Build cumulative offsets
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
        {/* background ring */}
        <circle
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* slices */}
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
      {/* center label */}
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <text
          x="0"
          y="-2"
          textAnchor="middle"
          fontSize="14"
          fill="rgba(255,255,255,0.9)"
          className="font-semibold"
        >
          {total}
        </text>
        <text
          x="0"
          y="14"
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.6)"
        >
          uploads
        </text>
      </g>
    </svg>
  );
}
