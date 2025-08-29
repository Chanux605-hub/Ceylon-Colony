import React, { useMemo, useState, useEffect } from "react";


export default function WorkshopScheduleManagement() {
  useEffect(() => {
    // Set browser tab title for clarity
    document.title = "Admin | Workshops";
  }, []);
  // --- Keep ONLY 3 workshops ---
  const data = [
    { id: "WKP-101", title: "Intro to Beekeeping: Hive Basics", date: "2025-09-05", seats: 30, filled: 24, trainer: "Amal",    status: "Published" },
    { id: "WKP-102", title: "Honeybee Biology & Behavior",      date: "2025-09-08", seats: 28, filled: 19, trainer: "Kavindi", status: "Draft" },
    { id: "WKP-103", title: "Safe Handling & PPE for Beekeepers", date: "2025-09-12", seats: 25, filled: 21, trainer: "Ruwan",  status: "Published" },
  ];

  // Search
  const [query, setQuery] = useState("");

  // Sorting (Title & Date are NOT sortable)
  const [sortBy, setSortBy] = useState(null); // null | "trainer" | "fill" | "status"
  const [sortDir, setSortDir] = useState("asc");

  // Bulk selection
  const [selected, setSelected] = useState(new Set());

  // Row actions menu
  const [openMenuId, setOpenMenuId] = useState(null);

  // Filtered
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((w) =>
      [w.id, w.title, w.trainer, w.status].join(" ").toLowerCase().includes(q)
    );
  }, [query, data]);

  // Sorted (only if a sortable column is chosen)
  const visibleRows = useMemo(() => {
    if (!sortBy) return filtered; // keep original order (no date ascending)
    const orderMap = { Draft: 1, Published: 2, Full: 3, Cancelled: 4, Completed: 5 };
    const arr = [...filtered];
    arr.sort((a, b) => {
      let A, B;
      switch (sortBy) {
        case "trainer": A = a.trainer.toLowerCase(); B = b.trainer.toLowerCase(); break;
        case "fill":    A = a.filled / a.seats;      B = b.filled / b.seats;      break;
        case "status":  A = orderMap[a.status] ?? 0; B = orderMap[b.status] ?? 0; break;
        default: A = 0; B = 0;
      }
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const allSelected = visibleRows.length > 0 && visibleRows.every(r => selected.has(r.id));
  const toggleAll = () =>
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) visibleRows.forEach(r => next.delete(r.id));
      else visibleRows.forEach(r => next.add(r.id));
      return next;
    });
  const toggleOne = (id) =>
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const onSort = (key) => {
    // Only called for trainer/fill/status
    setSortBy(prev => {
      if (prev === key) {
        setSortDir(d => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return key;
    });
  };

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">Workshop Schedule</h2>

      {/* Search + Buttons */}
      <div className="mb-3 grid grid-cols-1 items-center gap-2 sm:grid-cols-2">
        <div className="flex justify-start">
          <div className="relative w-64 md:w-72">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workshops..."
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
          <button className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-3 py-2 text-sm font-medium text-black hover:brightness-95">
            Create workshop
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-100 ring-1 ring-neutral-700 hover:ring-yellow-500/40">
            Export
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-100 ring-1 ring-neutral-700 hover:ring-yellow-500/40">
            Templates
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-neutral-900/70 px-3 py-2 ring-1 ring-white/10">
          <span className="text-sm text-neutral-300">{selected.size} selected</span>
          <button className="rounded-lg bg-neutral-800 px-2.5 py-1.5 text-sm ring-1 ring-neutral-700 hover:ring-yellow-500/40">Publish</button>
          <button className="rounded-lg bg-neutral-800 px-2.5 py-1.5 text-sm ring-1 ring-neutral-700 hover:ring-yellow-500/40">Cancel</button>
          <button className="rounded-lg bg-neutral-800 px-2.5 py-1.5 text-sm ring-1 ring-neutral-700 hover:ring-yellow-500/40">Export</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto rounded-lg bg-neutral-800 px-2.5 py-1.5 text-sm ring-1 ring-neutral-700 hover:ring-yellow-500/40">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10">
        <table className="w-full table-auto text-sm">
          <thead className="text-neutral-400">
            <tr>
              <th className="w-10 px-3 py-2.5 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 accent-yellow-400"
                />
              </th>

              {/* Title & Date are NOT sortable */}
              <th className="px-3 py-2.5 text-left font-medium w-[40%] min-w-[260px]">Title</th>
              <th className="w-28 px-3 py-2.5 text-left font-medium">Date</th>

              <SortableTh className="w-32 px-3 py-2.5 text-left font-medium" label="Trainer" sortKey="trainer" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <SortableTh className="w-[260px] px-3 py-2.5 text-left font-medium" label="Fill" sortKey="fill" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <SortableTh className="w-28 px-3 py-2.5 text-left font-medium" label="Status" sortKey="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              <th className="w-16 px-3 py-2.5 text-right font-medium">…</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {visibleRows.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-neutral-400" colSpan={7}>
                  No workshops found{query ? ` for “${query}”` : ""}.
                </td>
              </tr>
            ) : (
              visibleRows.map((w) => {
                const pct = Math.round((w.filled / w.seats) * 100);
                return (
                  <tr key={w.id} className="align-middle">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(w.id)}
                        onChange={() => toggleOne(w.id)}
                        className="h-4 w-4 accent-yellow-400"
                      />
                    </td>

                    <td className="px-3 py-3">
                      <div className="whitespace-normal break-words leading-snug">{w.title}</div>
                    </td>
                    <td className="px-3 py-3">{w.date}</td>

                    <td className="px-3 py-3">{w.trainer}</td>
                    <td className="px-3 py-3"><FillBar percent={pct} label={`${w.filled}/${w.seats}`} /></td>
                    <td className="px-3 py-3"><StatusBadge value={w.status} /></td>

                    <td className="px-3 py-3">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() => setOpenMenuId((cur) => (cur === w.id ? null : w.id))}
                          className="h-9 w-9 rounded-full bg-neutral-800 ring-1 ring-neutral-700 hover:ring-yellow-500/40"
                          aria-label="Row actions"
                        >
                          ⋮
                        </button>
                        {openMenuId === w.id && (
                          <div className="absolute right-0 top-10 z-10 w-44 rounded-xl border border-neutral-800 bg-neutral-900 p-1 shadow-xl" onMouseLeave={() => setOpenMenuId(null)}>
                            <MenuItem>Edit</MenuItem>
                            <MenuItem>Duplicate</MenuItem>
                            {w.status === "Published" ? <MenuItem>Unpublish</MenuItem> : <MenuItem>Publish</MenuItem>}
                            <MenuItem danger>Cancel</MenuItem>
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
function MenuItem({ children, danger }) {
  return (
    <button
      className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-800 ${
        danger ? "text-red-400" : "text-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}
