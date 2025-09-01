// src/Components/admin/modules/WorkshopScheduleManagement.jsx
import React, { useEffect, useMemo, useState } from "react";

/* -------- Inline API helpers (no separate api file needed) -------- */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
async function jfetch(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
}
const listWorkshops   = () => jfetch(`${BASE}/api/workshops`);
const createWorkshop  = (payload) =>
  jfetch(`${BASE}/api/workshops`, { method: "POST", body: JSON.stringify(payload) });
const updateWorkshop  = (id, payload) =>
  jfetch(`${BASE}/api/workshops/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
const setWorkshopStatus = (id, status) =>
  jfetch(`${BASE}/api/workshops/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
/* ------------------------------------------------------------------ */

export default function WorkshopScheduleManagement() {
  useEffect(() => { document.title = "Admin | Workshops"; }, []);

  // remote data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal (create/edit)
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    blurb: "",
    date: "",
    time: "",
    duration: "",
    level: "Beginner",
    location: "",
    price: 0,
    capacity: 30,
    seatsTaken: 0,
    coverUrl: "",
    status: "Draft",
  });
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // table ui
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState(null); // "level" | "location" | "price" | "fill" | "status"
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(new Set());
  const [openMenuId, setOpenMenuId] = useState(null);

  // load
  useEffect(() => {
    (async () => {
      try {
        const data = await listWorkshops();
        const normalized = (data || []).map((w) => ({ ...w, id: w._id || w.id }));
        setRows(normalized);
        setError("");
      } catch (e) {
        setError(e?.message || "Failed to load workshops");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((w) =>
      [w.title, w.blurb, w.status, w.location, w.level, w.date]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  // sort
  const visibleRows = useMemo(() => {
    if (!sortBy) return filtered;
    const orderMap = { Draft: 1, Published: 2, Full: 3, Cancelled: 4, Completed: 5 };
    const arr = [...filtered];
    arr.sort((a, b) => {
      let A, B;
      switch (sortBy) {
        case "level":    A = (a.level || "").toLowerCase();    B = (b.level || "").toLowerCase();    break;
        case "location": A = (a.location || "").toLowerCase(); B = (b.location || "").toLowerCase(); break;
        case "price":    A = Number(a.price) || 0;             B = Number(b.price) || 0;             break;
        case "fill": {
          const aFill = (a.seatsTaken ?? 0) / Math.max(a.capacity ?? 1, 1);
          const bFill = (b.seatsTaken ?? 0) / Math.max(b.capacity ?? 1, 1);
          A = aFill; B = bFill; break;
        }
        case "status":   A = orderMap[a.status] ?? 0;          B = orderMap[b.status] ?? 0;          break;
        default:         A = 0;                                 B = 0;
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const onSort = (key) => {
    setSortBy((prev) => {
      if (prev === key) { setSortDir((d) => (d === "asc" ? "desc" : "asc")); return prev; }
      setSortDir("asc"); return key;
    });
  };

  // selection
  const keyOf = (r) => r.id || r._id;
  const allSelected =
    visibleRows.length > 0 && visibleRows.every((r) => selected.has(keyOf(r)));
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) visibleRows.forEach((r) => next.delete(keyOf(r)));
      else visibleRows.forEach((r) => next.add(keyOf(r)));
      return next;
    });
  const toggleOne = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  // cover -> DataURL
  function onPickCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => u("coverUrl", reader.result || "");
    reader.readAsDataURL(file);
  }

  // open create
  const openCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setForm({
      title: "", blurb: "", date: "", time: "", duration: "",
      level: "Beginner", location: "", price: 0, capacity: 30,
      seatsTaken: 0, coverUrl: "", status: "Draft",
    });
    setModalOpen(true);
  };

  // open edit
  const openEdit = (row) => {
    setModalMode("edit");
    setEditingId(row.id || row._id);
    setForm({
      title: row.title || "",
      blurb: row.blurb || "",
      date: row.date || "",
      time: row.time || "",
      duration: row.duration || "",
      level: row.level || "Beginner",
      location: row.location || "",
      price: row.price ?? 0,
      capacity: row.capacity ?? 30,
      seatsTaken: row.seatsTaken ?? 0,
      coverUrl: row.coverUrl || "",
      status: row.status || "Draft",
    });
    setModalOpen(true);
  };

  // submit (create or edit)
  async function submitModal(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        capacity: Number(form.capacity),
        seatsTaken: Number(form.seatsTaken),
      };

      if (modalMode === "create") {
        const created = await createWorkshop(payload);
        const normalized = { ...created, id: created._id || created.id };
        setRows((prev) => [normalized, ...prev]);
      } else {
        const updated = await updateWorkshop(editingId, payload);
        const normalized = { ...updated, id: updated._id || updated.id };
        setRows((prev) => prev.map((r) => (keyOf(r) === editingId ? normalized : r)));
      }

      setModalOpen(false);
    } catch (err) {
      alert(err?.message || "Failed to save workshop");
    } finally {
      setSaving(false);
    }
  }

  // publish / unpublish / cancel
  async function changeStatus(id, status) {
    try {
      const updated = await setWorkshopStatus(id, status);
      const normalized = { ...updated, id: updated._id || updated.id };
      setRows((prev) => prev.map((r) => (keyOf(r) === id ? normalized : r)));
    } catch (e) {
      alert(e?.message || "Failed to update status");
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">Workshop Schedule</h2>

      {/* Search + Create button */}
      <div className="mb-3 grid grid-cols-1 items-center gap-2 sm:grid-cols-2">
        <div className="flex justify-start">
          <div className="relative w-64 md:w-72">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, location, level..."
              className="w-full rounded-xl bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none ring-1 ring-neutral-700 focus:ring-yellow-500/40"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 sm:justify-end">
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-3 py-2 text-sm font-medium text-black hover:brightness-95"
          >
            <span className="text-lg leading-none">＋</span>
            <span>Create workshop</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10">
        <table className="w-full table-auto text-sm">
          <thead className="text-neutral-400">
            <tr>
              <th className="w-10 px-3 py-2.5 text-left">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 accent-yellow-400" />
              </th>
              <th className="w-[36%] min-w-[280px] px-3 py-2.5 text-left font-medium">Workshop</th>
              <th className="w-40 px-3 py-2.5 text-left font-medium">Date & Time</th>
              <SortableTh className="w-28 px-3 py-2.5 text-left font-medium" label="Level" sortKey="level" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <SortableTh className="w-28 px-3 py-2.5 text-left font-medium" label="Location" sortKey="location" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <SortableTh className="w-28 px-3 py-2.5 text-left font-medium" label="Price (LKR)" sortKey="price" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <SortableTh className="w-[220px] px-3 py-2.5 text-left font-medium" label="Fill" sortKey="fill" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <SortableTh className="w-24 px-3 py-2.5 text-left font-medium" label="Status" sortKey="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <th className="w-12 px-3 py-2.5 text-right font-medium">…</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr><td className="px-3 py-6 text-neutral-400" colSpan={9}>Loading…</td></tr>
            ) : visibleRows.length === 0 ? (
              <tr><td className="px-3 py-6 text-neutral-400" colSpan={9}>No workshops found{query ? ` for “${query}”` : ""}.</td></tr>
            ) : (
              visibleRows.map((w) => {
                const id = keyOf(w);
                const seats = w.capacity ?? 1;
                const filled = w.seatsTaken ?? 0;
                const pct = Math.round((filled / Math.max(seats, 1)) * 100);
                const publishLabel = w.status === "Published" ? "Unpublish" : "Publish";
                const nextStatus = w.status === "Published" ? "Draft" : "Published";

                return (
                  <tr key={id} className="align-middle">
                    <td className="px-3 py-3">
                      <input type="checkbox" checked={selected.has(id)} onChange={() => toggleOne(id)} className="h-4 w-4 accent-yellow-400" />
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-20 overflow-hidden rounded-lg ring-1 ring-black/10">
                          {w.coverUrl ? (
                            <img src={w.coverUrl} alt={w.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full w-full place-items-center bg-neutral-800 text-xs text-neutral-400">No image</div>
                          )}
                          {w.level && (
                            <span className="absolute left-1 top-1 rounded bg-white/85 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                              {w.level}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-white">{w.title}</div>
                          <div className="truncate text-xs text-neutral-400">{w.blurb}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <div>{w.date || "-"}</div>
                      <div className="text-xs text-neutral-400">{w.time}{w.duration ? ` (${w.duration})` : ""}</div>
                    </td>

                    <td className="px-3 py-3">{w.level || "-"}</td>
                    <td className="px-3 py-3">{w.location || "-"}</td>
                    <td className="px-3 py-3">{Number(w.price || 0).toLocaleString()}</td>

                    <td className="px-3 py-3">
                      <FillBar percent={pct} label={`${filled}/${seats}`} />
                    </td>

                    <td className="px-3 py-3"><StatusBadge value={w.status || "Draft"} /></td>

                    <td className="px-3 py-3">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() => setOpenMenuId((cur) => (cur === id ? null : id))}
                          className="h-9 w-9 rounded-full bg-neutral-800 ring-1 ring-neutral-700 hover:ring-yellow-500/40"
                          aria-label="Row actions"
                        >
                          ⋮
                        </button>
                        {openMenuId === id && (
                          <div
                            className="absolute right-0 top-10 z-10 w-44 rounded-xl border border-neutral-800 bg-neutral-900 p-1 shadow-xl"
                            onMouseLeave={() => setOpenMenuId(null)}
                          >
                            <MenuItem onClick={() => openEdit(w)}>Edit</MenuItem>
                            <MenuItem onClick={() => changeStatus(id, nextStatus)}>{publishLabel}</MenuItem>
                            <MenuItem danger onClick={() => changeStatus(id, "Cancelled")}>Cancel</MenuItem>
                            <div className="my-1 h-px bg-neutral-800" />
                            <MenuItem>View registrations</MenuItem>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- CREATE/EDIT MODAL ---------- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-neutral-900 text-neutral-100 shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
              <h3 className="text-lg font-semibold">
                {modalMode === "create" ? "Add Workshop" : "Edit Workshop"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                aria-label="Close"
              >✕</button>
            </div>

            {/* Body */}
            <form onSubmit={submitModal} className="grid gap-4 px-5 py-5">
              {/* Cover uploader + preview */}
              <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                <div>
                  <div className="relative h-28 w-full overflow-hidden rounded-xl ring-1 ring-black/10">
                    {form.coverUrl ? (
                      <img src={form.coverUrl} alt="Cover preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-neutral-800 text-xs text-neutral-400">
                        Cover preview
                      </div>
                    )}
                  </div>
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-800 px-3 py-2 text-xs ring-1 ring-neutral-700 hover:bg-neutral-700">
                    <input type="file" accept="image/*" onChange={onPickCover} className="hidden" />
                    <span>Choose image</span>
                  </label>
                </div>

                <div className="grid gap-3">
                  <input
                    className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700 placeholder:text-neutral-500"
                    placeholder="Title (e.g., Intro to Beekeeping)"
                    required
                    value={form.title}
                    onChange={(e) => u("title", e.target.value)}
                  />
                  <textarea
                    rows={3}
                    className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700 placeholder:text-neutral-500"
                    placeholder="Short blurb..."
                    value={form.blurb}
                    onChange={(e) => u("blurb", e.target.value)}
                  />
                </div>
              </div>

              {/* Date / Time / Duration */}
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => u("date", e.target.value)}
                  className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700"
                />
                <input
                  placeholder="Time (e.g., 9:00 AM – 12:00 PM)"
                  required
                  value={form.time}
                  onChange={(e) => u("time", e.target.value)}
                  className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700"
                />
                <input
                  placeholder="Duration (e.g., 3h)"
                  required
                  value={form.duration}
                  onChange={(e) => u("duration", e.target.value)}
                  className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700"
                />
              </div>

              {/* Level / Location / Price */}
              <div className="grid gap-3 sm:grid-cols-3">
                <select
                  value={form.level}
                  onChange={(e) => u("level", e.target.value)}
                  className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>All Levels</option>
                </select>
                <input
                  placeholder="Location (e.g., Kandy)"
                  required
                  value={form.location}
                  onChange={(e) => u("location", e.target.value)}
                  className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700"
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Price LKR (e.g., 4000)"
                  required
                  value={form.price}
                  onChange={(e) => u("price", Number(e.target.value))}
                  className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700"
                />
              </div>

              {/* Capacity / Seats / Status */}
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="number"
                  min={1}
                  placeholder="Capacity (e.g., 30)"
                  required
                  value={form.capacity}
                  onChange={(e) => u("capacity", Number(e.target.value))}
                  className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700"
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Seats taken (e.g., 24)"
                  value={form.seatsTaken}
                  onChange={(e) => u("seatsTaken", Number(e.target.value))}
                  className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700"
                />
                <select
                  value={form.status}
                  onChange={(e) => u("status", e.target.value)}
                  className="rounded-xl bg-neutral-800 px-3 py-2 text-sm ring-1 ring-neutral-700"
                >
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Cancelled</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* Footer */}
              <div className="mt-1 flex items-center justify-end gap-2 border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl bg-neutral-800 px-4 py-2 text-sm text-neutral-100 ring-1 ring-neutral-700 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  className="rounded-xl bg-yellow-400 px-5 py-2 text-sm font-semibold text-black hover:brightness-95 disabled:opacity-60"
                >
                  {saving ? "Saving…" : modalMode === "create" ? "Save" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */
function SortableTh({ label, sortKey, sortBy, sortDir, onSort, className = "" }) {
  const active = sortBy === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`cursor-pointer select-none ${className}`}
      title={`Sort by ${label}`}
    >
      <span className={active ? "text-neutral-200" : ""}>{label}</span>{" "}
      <span className="text-neutral-500">{active ? (sortDir === "asc" ? "▲" : "▼") : ""}</span>
    </th>
  );
}
function FillBar({ percent, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full rounded-full bg-neutral-800">
        <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${percent}%` }} />
      </div>
      <span className="whitespace-nowrap text-neutral-400">{label}</span>
    </div>
  );
}
function StatusBadge({ value }) {
  const styles = {
    Draft: "bg-neutral-800 text-neutral-300 ring-neutral-700",
    Published: "bg-yellow-400/10 text-yellow-400 ring-yellow-500/30",
    Full: "bg-green-400/10 text-green-400 ring-green-500/30",
    Cancelled: "bg-red-400/10 text-red-400 ring-red-500/30",
    Completed: "bg-blue-400/10 text-blue-400 ring-blue-500/30",
  };
  const cls = styles[value] || styles.Draft;
  return <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ring-1 ${cls}`}>{value}</span>;
}
function MenuItem({ children, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-800 ${
        danger ? "text-red-400" : "text-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}
