// src/Components/admin/modules/HarvestFarmManagement.jsx
import React, { useMemo, useState } from "react";

/**
 * Farm & Harvest Management (frontend-only demo)
 * - No APIs. Uses local state + image URLs.
 * - Includes: KPIs, farm gallery, filters, schedule table, inventory bars, tasks, and an add-harvest modal.
 */

const initialFarms = [
  {
    id: "F001",
    name: "Kandy Hills Farm",
    location: "Kandy, Central Province",
    hives: 42,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1600673443335-30e1e6d8d3b9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "F002",
    name: "Galle Coastal Farm",
    location: "Galle, Southern Province",
    hives: 28,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1585229259530-5d7b3d3e2b4a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "F003",
    name: "Kurunegala Grove",
    location: "Kurunegala, North Western",
    hives: 19,
    status: "Maintenance",
    image:
      "https://images.unsplash.com/photo-1587049352849-4d00b3f1a6ca?q=80&w=1200&auto=format&fit=crop",
  },
];

const initialHarvests = [
  {
    id: "H001",
    date: "2025-08-22",
    farmId: "F001",
    type: "Wildflower",
    expectedKg: 65,
    status: "Planned",
  },
  {
    id: "H002",
    date: "2025-09-02",
    farmId: "F002",
    type: "Coconut Blossom",
    expectedKg: 48,
    status: "Planned",
  },
  {
    id: "H003",
    date: "2025-08-10",
    farmId: "F003",
    type: "Linden",
    expectedKg: 22,
    status: "Completed",
  },
];

const initialTasks = [
  { id: "T1", text: "Inspect queen cells at Kandy Hills", done: false },
  { id: "T2", text: "Replace 10 frames at Galle Coastal", done: true },
  { id: "T3", text: "Clean extractors before next run", done: false },
];

export default function HarvestFarmManagement() {
  const [farms, setFarms] = useState(initialFarms);
  const [harvests, setHarvests] = useState(initialHarvests);
  const [tasks, setTasks] = useState(initialTasks);

  const [selectedFarmId, setSelectedFarmId] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const farmsById = useMemo(
    () => Object.fromEntries(farms.map((f) => [f.id, f])),
    [farms]
  );

  const kpis = useMemo(() => {
    const totalHives = farms.reduce((sum, f) => sum + f.hives, 0);
    const activeFarms = farms.filter((f) => f.status === "Active").length;
    const upcoming = harvests
      .filter((h) => h.status !== "Completed")
      .reduce((sum, h) => sum + h.expectedKg, 0);
    const nextDate = harvests
      .filter((h) => h.status !== "Completed")
      .map((h) => new Date(h.date))
      .sort((a, b) => a - b)[0];
    return {
      totalHives,
      activeFarms,
      upcomingKg: upcoming,
      nextWindow: nextDate ? nextDate.toISOString().slice(0, 10) : "—",
    };
  }, [farms, harvests]);

  const visibleHarvests = useMemo(() => {
    return harvests
      .filter((h) => (selectedFarmId === "ALL" ? true : h.farmId === selectedFarmId))
      .filter((h) => (statusFilter === "ALL" ? true : h.status === statusFilter))
      .filter((h) => {
        const farmName = farmsById[h.farmId]?.name?.toLowerCase() || "";
        return (
          farmName.includes(query.toLowerCase()) ||
          h.type.toLowerCase().includes(query.toLowerCase())
        );
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [harvests, selectedFarmId, statusFilter, query, farmsById]);

  const completeHarvest = (id) => {
    setHarvests((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: "Completed" } : h))
    );
  };

  const addHarvest = (newHarvest) => {
    setHarvests((prev) => [{ ...newHarvest }, ...prev]);
  };

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="hf-container">
      <style>{styles}</style>

      {/* Header */}
      <div className="hf-header">
        <div>
          <h1>Farm & Harvest Management</h1>
          <p className="hf-sub">
            Plan harvests, monitor farms, and keep operations on track — no backend required.
          </p>
        </div>
        <button className="hf-btn primary" onClick={() => setIsModalOpen(true)}>
          ➕ Add Harvest
        </button>
      </div>

      {/* KPI Cards */}
      <section className="hf-grid kpi">
        <KpiCard label="Total Hives" value={kpis.totalHives} emoji="🐝" />
        <KpiCard label="Active Farms" value={kpis.activeFarms} emoji="🏡" />
        <KpiCard label="Upcoming Yield (kg)" value={kpis.upcomingKg} emoji="🍯" />
        <KpiCard label="Next Harvest Window" value={kpis.nextWindow} emoji="📅" />
      </section>

      {/* Farm Gallery */}
      <section className="hf-section">
        <div className="hf-section-head">
          <h2>Farms</h2>
          <div className="hf-filters">
            <label className="hf-input">
              🔎
              <input
                placeholder="Search farm or honey type…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              className="hf-select"
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
            >
              <option value="ALL">All farms</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <select
              className="hf-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="Planned">Planned</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="hf-gallery">
          {[{ id: "ALL", name: "All Farms", image: coverImage }, ...farms].map((f) => (
            <button
              key={f.id}
              className={`hf-farm-card ${selectedFarmId === f.id ? "active" : ""}`}
              onClick={() => setSelectedFarmId(f.id)}
            >
              <img src={f.image || coverImage} alt={f.name} />
              <div className="hf-farm-meta">
                <h3>{f.name}</h3>
                {f.id !== "ALL" && (
                  <p>
                    {f.location} • {f.hives} hives • {f.status}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Split: Schedule + Side Widgets */}
      <section className="hf-split">
        {/* Schedule */}
        <div className="hf-card">
          <div className="hf-card-head">
            <h2>Harvest Schedule</h2>
          </div>

          <div className="hf-table-wrap">
            <table className="hf-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Farm</th>
                  <th>Type</th>
                  <th>Est. Yield (kg)</th>
                  <th>Status</th>
                  <th aria-label="actions" />
                </tr>
              </thead>
              <tbody>
                {visibleHarvests.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                      No harvests match your filters.
                    </td>
                  </tr>
                )}
                {visibleHarvests.map((h) => (
                  <tr key={h.id}>
                    <td>{h.date}</td>
                    <td>{farmsById[h.farmId]?.name || "—"}</td>
                    <td>{h.type}</td>
                    <td>{h.expectedKg}</td>
                    <td>
                      <span className={`hf-badge ${h.status.toLowerCase()}`}>{h.status}</span>
                    </td>
                    <td className="hf-row-actions">
                      {h.status !== "Completed" && (
                        <button className="hf-btn ghost" onClick={() => completeHarvest(h.id)}>
                          ✅ Mark done
                        </button>
                      )}
                      <button className="hf-btn ghost">👁️ View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right widgets */}
        <div className="hf-stack">
          {/* Inventory */}
          <div className="hf-card">
            <div className="hf-card-head">
              <h3>Inventory Snapshot</h3>
              <span className="hf-muted">Demo values</span>
            </div>
            <InventoryBar label="Wildflower" current={180} max={300} />
            <InventoryBar label="Coconut Blossom" current={120} max={250} />
            <InventoryBar label="Linden" current={45} max={200} />
          </div>

          {/* Tasks */}
          <div className="hf-card">
            <div className="hf-card-head">
              <h3>Tasks</h3>
            </div>
            <ul className="hf-tasks">
              {tasks.map((t) => (
                <li key={t.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                    />
                    <span className={t.done ? "done" : ""}>{t.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Weather (static) */}
          <div className="hf-card">
            <div className="hf-card-head">
              <h3>Weather (Kandy)</h3>
              <span className="hf-muted">Static demo</span>
            </div>
            <div className="hf-weather">
              <div className="hf-weather-today">🌤️ 29°C</div>
              <div className="hf-weather-days">
                <div>Fri • 30°C</div>
                <div>Sat • 28°C</div>
                <div>Sun • 27°C</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <AddHarvestModal
          farms={farms}
          onClose={() => setIsModalOpen(false)}
          onSave={(payload) => {
            addHarvest(payload);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function KpiCard({ label, value, emoji }) {
  return (
    <div className="hf-card kpi-card">
      <div className="kpi-emoji">{emoji}</div>
      <div className="kpi-info">
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
      </div>
    </div>
  );
}

function InventoryBar({ label, current, max }) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div className="hf-inv">
      <div className="hf-inv-head">
        <span>{label}</span>
        <span className="hf-muted">
          {current} / {max} kg
        </span>
      </div>
      <div className="hf-inv-bar">
        <div className="hf-inv-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AddHarvestModal({ farms, onClose, onSave }) {
  const [form, setForm] = useState({
    date: "",
    farmId: farms[0]?.id || "",
    type: "Wildflower",
    expectedKg: 0,
  });

  const canSave = form.date && form.farmId && form.type && Number(form.expectedKg) > 0;

  return (
    <div className="hf-modal-backdrop" role="dialog" aria-modal="true">
      <div className="hf-modal">
        <div className="hf-modal-head">
          <h3>Add Harvest</h3>
          <button className="hf-btn ghost" onClick={onClose} aria-label="Close">
            ✖
          </button>
        </div>
        <div className="hf-modal-body">
          <label className="hf-field">
            <span>Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </label>

          <label className="hf-field">
            <span>Farm</span>
            <select
              value={form.farmId}
              onChange={(e) => setForm((f) => ({ ...f, farmId: e.target.value }))}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>

          <label className="hf-field">
            <span>Honey Type</span>
            <input
              placeholder="e.g., Wildflower"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            />
          </label>

          <label className="hf-field">
            <span>Estimated Yield (kg)</span>
            <input
              type="number"
              min="1"
              value={form.expectedKg}
              onChange={(e) =>
                setForm((f) => ({ ...f, expectedKg: Number(e.target.value) }))
              }
            />
          </label>
        </div>

        <div className="hf-modal-foot">
          <button className="hf-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="hf-btn primary"
            disabled={!canSave}
            onClick={() =>
              onSave({
                id: `H${Date.now()}`,
                ...form,
                status: "Planned",
              })
            }
          >
            Save Harvest
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Styling (scoped to this component via class names) ---
const coverImage =
  "https://images.unsplash.com/photo-1560692830-1e2d9f3a9f68?q=80&w=1200&auto=format&fit=crop";

const styles = `
.hf-container { padding: 24px; color: #e9eef4; background: #0b0f14; min-height: 100%; }
.hf-header { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom: 18px; }
.hf-sub { color:#9fb2c8; margin-top:4px; }
.hf-btn { border:1px solid #2a3441; background:#121821; color:#e9eef4; padding:8px 12px; border-radius:10px; cursor:pointer; transition:0.2s; }
.hf-btn:hover { background:#182231; }
.hf-btn.primary { background:linear-gradient(135deg,#f7b733,#fc4a1a); color:#121212; border:none; }
.hf-btn.ghost { background:transparent; border:1px dashed #334355; }
.hf-muted { color:#9fb2c8; font-size:12px; }

.hf-grid.kpi { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:14px; margin-bottom: 18px; }
.hf-card { background:#0f141b; border:1px solid #202b38; border-radius:16px; padding:14px; box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
.kpi-card { display:flex; align-items:center; gap:12px; }
.kpi-emoji { font-size:28px; }
.kpi-value { font-size:28px; font-weight:700; line-height:1; }
.kpi-label { color:#9fb2c8; }

.hf-section { margin-top: 8px; }
.hf-section-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom: 10px; }
.hf-filters { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.hf-input { display:flex; align-items:center; gap:8px; padding:8px 10px; border:1px solid #2a3441; border-radius:10px; background:#0c1117; }
.hf-input input { background:transparent; outline:none; border:none; color:#e9eef4; width:220px; }
.hf-select { padding:8px 10px; border-radius:10px; border:1px solid #2a3441; background:#0c1117; color:#e9eef4; }

.hf-gallery { display:grid; grid-auto-flow:column; grid-auto-columns: minmax(220px, 1fr); gap:12px; overflow-x:auto; padding-bottom:6px; }
.hf-farm-card { display:flex; flex-direction:column; align-items:flex-start; border:1px solid #202b38; background:#0f141b; border-radius:16px; cursor:pointer; transition:0.25s; text-align:left; padding:0; }
.hf-farm-card img { width:100%; height:140px; object-fit:cover; border-top-left-radius:16px; border-top-right-radius:16px; }
.hf-farm-meta { padding:10px; }
.hf-farm-card.active, .hf-farm-card:hover { outline:2px solid #f7b73344; transform: translateY(-2px); }

.hf-split { display:grid; grid-template-columns: 1.6fr 1fr; gap:12px; margin-top: 14px; }
.hf-card-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }

.hf-table-wrap { overflow:auto; }
.hf-table { width:100%; border-collapse: collapse; }
.hf-table th, .hf-table td { padding:10px; border-bottom:1px solid #1d2733; }
.hf-table th { text-align:left; color:#9fb2c8; font-weight:600; font-size:13px; }
.hf-badge { padding:4px 8px; border-radius:999px; font-size:12px; border:1px solid #334355; }
.hf-badge.planned { background:#1a222e; }
.hf-badge.completed { background:#11301c; border-color:#1a5330; color:#a6f3c1; }
.hf-row-actions { display:flex; gap:8px; justify-content:flex-end; }

.hf-stack { display:flex; flex-direction:column; gap:12px; }
.hf-inv { margin-bottom:12px; }
.hf-inv-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.hf-inv-bar { height:10px; background:#11161d; border-radius:999px; overflow:hidden; border:1px solid #283445; }
.hf-inv-fill { height:100%; background: linear-gradient(90deg, #f7b733, #fc4a1a); }

.hf-tasks { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }
.hf-tasks input { margin-right:8px; }
.hf-tasks .done { text-decoration: line-through; color:#8ea5bb; }

.hf-weather { display:flex; gap:10px; align-items:center; }
.hf-weather-today { font-size:22px; font-weight:700; }
.hf-weather-days { display:flex; gap:12px; color:#9fb2c8; font-size:13px; }

.hf-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; padding:16px; z-index:50; }
.hf-modal { width:100%; max-width:520px; background:#0f141b; border:1px solid #243142; border-radius:16px; overflow:hidden; }
.hf-modal-head { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid #1d2733; }
.hf-modal-body { display:grid; gap:10px; padding:14px; }
.hf-modal-foot { display:flex; justify-content:flex-end; gap:8px; padding:12px 14px; border-top:1px solid #1d2733; }
.hf-field { display:flex; flex-direction:column; gap:6px; }
.hf-field input, .hf-field select { padding:10px; border-radius:10px; border:1px solid #2a3441; background:#0c1117; color:#e9eef4; }

@media (max-width: 980px) {
  .hf-grid.kpi { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .hf-split { grid-template-columns: 1fr; }
}
`;

