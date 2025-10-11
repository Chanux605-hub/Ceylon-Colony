// src/Components/admin/modules/WorkshopScheduleManagement.jsx
import React, { useEffect, useState } from "react";
import { Users, Calendar, ClipboardList, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

/* -------- Inline API helpers -------- */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
async function jfetch(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
}

// workshop endpoints
const listWorkshops = () => jfetch(`${BASE}/api/workshops`);
const createWorkshop = (payload) =>
  jfetch(`${BASE}/api/workshops`, { method: "POST", body: JSON.stringify(payload) });
const updateWorkshop = (id, payload) =>
  jfetch(`${BASE}/api/workshops/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
const setWorkshopStatus = (id, status) =>
  jfetch(`${BASE}/api/workshops/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// ✅ participant endpoints (with token)
const listParticipants = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/api/participants`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
};
const deleteParticipant = (id) =>
  jfetch(`${BASE}/api/participants/${id}`, { method: "DELETE" });

/* --- Main Component --- */
export default function WorkshopScheduleManagement() {
  const [tab, setTab] = useState("workshops"); // workshops | participants | calendar | analytics
  const [workshops, setWorkshops] = useState([]);

  // ✅ Shared refresh function
  const refreshWorkshops = async () => {
    const data = await listWorkshops();
    setWorkshops(data || []);
  };

  // Load once when component mounts
  useEffect(() => {
    refreshWorkshops();
  }, []);

  const tabs = [
    { key: "workshops", label: "Workshops", icon: <ClipboardList size={16} /> },
    { key: "participants", label: "Participants", icon: <Users size={16} /> },
    { key: "calendar", label: "Calendar", icon: <Calendar size={16} /> },
    { key: "analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
  ];

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">Workshop Management</h2>
      <p className="mb-10 text-sm text-neutral-400">
        Manage workshops, participants, and view the calendar of upcoming sessions.
      </p>

      {/* Top Tabs */}
      <div className="mb-6 flex space-x-6 border-b border-neutral-700">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 pb-2 text-sm font-medium transition ${
              tab === t.key
                ? "border-b-2 border-yellow-400 text-yellow-400"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ✅ Pass shared state + refresh function */}
      {tab === "workshops" && (
        <WorkshopsTab workshops={workshops} refreshWorkshops={refreshWorkshops} />
      )}
      {tab === "participants" && (
        <ParticipantsTab refreshWorkshops={refreshWorkshops} />
      )}
      {tab === "calendar" && (
        <CalendarTab workshops={workshops} refreshWorkshops={refreshWorkshops} />
      )}
      {tab === "analytics" && (
        <AnalyticsTab workshops={workshops} refreshWorkshops={refreshWorkshops} />
      )}
    </div>
  );
}


/* --- Workshops Tab (your existing CRUD) --- */
function WorkshopsTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // form state
  const [form, setForm] = useState({
    title: "",
    blurb: "",
    date: "",
    time: "",
    duration: "",
    level: "Beginner",
    location: "",
    price: "",
    capacity: 30,
    seatsTaken: 0,
    coverUrl: "",
    status: "Draft",
  });
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // load workshops
  useEffect(() => {
    (async () => {
      try {
        const data = await listWorkshops();
        setRows((data || []).map((w) => ({ ...w, id: w._id || w.id })));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // modal open handlers
  const openCreate = () => {
    setForm({
      title: "",
      blurb: "",
      date: "",
      time: "",
      duration: "",
      level: "Beginner",
      location: "",
      price: "",
      capacity: 30,
      seatsTaken: 0,
      coverUrl: "",
      status: "Draft",
    });
    setEditingId(null);
    setModalMode("create");
    setModalOpen(true);
  };
  const openEdit = (row) => {
  setForm({
    ...row,
    date: row.date ? new Date(row.date).toISOString().split("T")[0] : "",
  });
  setEditingId(row.id);
  setModalMode("edit");
  setModalOpen(true);
  };


  // image picker
  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => u("coverUrl", reader.result);
    reader.readAsDataURL(file);
  };

  // save
  const submitModal = async (e) => {
    e.preventDefault();
    // ---- price validation ----
    if (form.price === "" || form.price === null || isNaN(form.price)) {
      alert("Please enter a price (use 0 for free).");
      return;
    }

    if (form.price < 0) {
      alert("Price must be 0 (for free) or a positive number.");
      return;
    }
    // ---- end validation ----

    setSaving(true);
    try {
      let saved;
      if (modalMode === "create") {
        saved = await createWorkshop(form);
        setRows((prev) => [{ ...saved, id: saved._id }, ...prev]);
      } else {
        saved = await updateWorkshop(editingId, form);
        setRows((prev) =>
          prev.map((r) => (r.id === editingId ? { ...saved, id: saved._id } : r))
        );
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to save workshop");
    } finally {
      setSaving(false);
    }
  };

  // status change
  const changeStatus = async (id, status) => {
    try {
      const updated = await setWorkshopStatus(id, status);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...updated, id: updated._id } : r)));
    } catch (e) {
      alert(e.message || "Failed to update status");
    }
  };

  const filteredRows = rows.filter((w) =>
    w.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-3 flex justify-between">
        {/* Search with clear button */}
        <div className="relative w-64">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-xl bg-neutral-800 px-3 py-2 pr-8 text-sm text-neutral-100 placeholder:text-neutral-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-yellow-400 px-3 py-2 text-sm font-semibold text-black hover:brightness-95"
        >
          ＋ Create Workshop
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="text-neutral-400">
              <tr>
                <th className="px-3 py-2 text-left">Image</th>
                <th className="px-3 py-2 text-left">Workshop</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Level</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Price</th>
                <th className="px-3 py-2 text-left">Seats</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((w) => (
                <tr key={w.id} className="border-t border-neutral-800">
                  <td className="px-3 py-2">
                    {w.coverUrl ? (
                      <img
                        src={w.coverUrl}
                        alt={w.title}
                        className="h-10 w-14 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-neutral-500">No image</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{w.title}</td>
                  <td className="px-3 py-2">
                    {w.date
                      ? new Date(w.date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : ""}
                  </td>
                  <td className="px-3 py-2">{w.level}</td>
                  <td className="px-3 py-2">{w.location}</td>
                  <td className="px-3 py-2">
                    {w.price === 0 || w.price === "Free" ? "Free" : `Rs. ${w.price}`}
                  </td>
                  <td className="px-3 py-2">{w.seatsTaken || 0} / {w.capacity}</td>
                  <td className="px-3 py-2">{w.status}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => openEdit(w)}
                      className="mr-2 rounded bg-blue-500 px-2 py-1 text-xs text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        changeStatus(w.id, w.status === "Published" ? "Draft" : "Published")
                      }
                      className="mr-2 rounded bg-yellow-400 px-2 py-1 text-xs text-black"
                    >
                      {w.status === "Published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => changeStatus(w.id, "Cancelled")}
                      className="rounded bg-red-500 px-2 py-1 text-xs text-white"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto">
          <div className="w-full max-w-3xl my-10 rounded-xl bg-neutral-900 p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">
              {modalMode === "create" ? "Add Workshop" : "Edit Workshop"}
            </h3>
            <form onSubmit={submitModal} className="grid gap-4">
              {/* Image upload */}
              <div>
                <label className="text-sm">Image</label>
                <div className="mt-1 flex items-center gap-3">
                  {form.coverUrl ? (
                    <img
                      src={form.coverUrl}
                      alt="Preview"
                      className="h-20 w-28 object-cover rounded"
                    />
                  ) : (
                    <div className="h-20 w-28 bg-neutral-700 rounded flex items-center justify-center text-xs text-neutral-400">
                      No image
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={onPickImage} />
                </div>
              </div>

              {/* fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  Title
                  <input
                    placeholder="Workshop title"
                    value={form.title}
                    onChange={(e) => u("title", e.target.value)}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                    required
                  />
                </label>
                <label className="text-sm">
                  Blurb
                  <input
                    placeholder="Short description"
                    value={form.blurb}
                    onChange={(e) => u("blurb", e.target.value)}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm">
                  Date
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => u("date", e.target.value)}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                    required
                  />
                </label>
                <label className="text-sm">
                  Time
                  <input
                    placeholder="e.g. 10:00 AM"
                    value={form.time}
                    onChange={(e) => u("time", e.target.value)}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                    required
                  />
                </label>
                <label className="text-sm">
                  Duration
                  <input
                    placeholder="e.g. 2 hours"
                    value={form.duration}
                    onChange={(e) => u("duration", e.target.value)}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm">
                  Level
                  <select
                    value={form.level}
                    onChange={(e) => u("level", e.target.value)}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>All Levels</option>
                  </select>
                </label>
                <label className="text-sm">
                  Location
                  <input
                    placeholder="e.g. Colombo Training Center"
                    value={form.location}
                    onChange={(e) => u("location", e.target.value)}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                    required
                  />
                </label>
                <label className="text-sm">
                  Price
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5000 (0 for free)"
                    value={form.price ?? 0}   
                    onChange={(e) => {
                      const val = e.target.value;
                      u("price", val === "" ? 0 : Number(val)); //empty = 0 (Free)
                    }}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Price must be 0 (Free) or a positive number.")
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                  />
                </label>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  Capacity
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => u("capacity", e.target.value)}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                    required
                  />
                </label>
                <label className="text-sm">
                  Status
                  <select
                    value={form.status}
                    onChange={(e) => u("status", e.target.value)}
                    className="w-full rounded bg-neutral-800 px-3 py-2"
                  >
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Cancelled</option>
                    <option>Completed</option>
                  </select>
                </label>
              </div>

              {/* Footer */}
              <div className="mt-2 flex justify-end gap-2 border-t border-neutral-800 pt-4">
                
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded bg-neutral-700 px-4 py-2 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-yellow-400 px-4 py-2 font-semibold text-black disabled:opacity-50"
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

function ParticipantsTab({ refreshWorkshops }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ status: "Registered" });
  const [modalOpen, setModalOpen] = useState(false);

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const data = await listParticipants();
        setRows(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this participant?")) return;
    await deleteParticipant(id);
    setRows((prev) => prev.filter((r) => r._id !== id));

    // ✅ refresh seats in workshops
    await refreshWorkshops();
  };

  const update = async () => {
    try {
      const res = await fetch(`${BASE}/api/participants/${editing._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.status }),
      });
      if (!res.ok) throw new Error("Failed to update participant");
      const updated = await res.json();

      setRows((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));

      setModalOpen(false);
      setEditing(null);

      // ✅ refresh seats in workshops
      await refreshWorkshops();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 overflow-x-auto">
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="w-full table-auto text-sm">
          <thead className="text-neutral-400">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Workshop</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Attendance</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id} className="border-t border-neutral-800">
                <td className="px-3 py-2">{p.fullName}</td>
                <td className="px-3 py-2">{p.email}</td>
                <td className="px-3 py-2">{p.phone}</td>
                <td className="px-3 py-2">{p.workshopId?.title}</td>
                <td className="px-3 py-2">{p.status}</td>

                <td className="px-3 py-2">
                  <select
                    value={p.attendance || "Pending"}
                    onChange={async (e) => {
                      const attendance = e.target.value;
                      const res = await fetch(`${BASE}/api/participants/${p._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ attendance }),
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setRows((prev) =>
                          prev.map((r) => (r._id === updated._id ? updated : r))
                        );
                      }
                    }}
                    className={`rounded px-2 py-1 text-sm ${
                      p.attendance === "Present"
                        ? "bg-green-600 text-white"
                        : p.attendance === "Absent"
                        ? "bg-red-600 text-white"
                        : "bg-neutral-700 text-neutral-200"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>

                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => {
                      setEditing(p);
                      setForm({ status: p.status });
                      setModalOpen(true);
                    }}
                    className="mr-2 rounded bg-blue-500 px-2 py-1 text-xs text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p._id)}
                    className="rounded bg-red-500 px-2 py-1 text-xs text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* modal code same as before */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-white">Update Status</h3>
            <label className="text-sm text-neutral-300">
              Status
              <select
                value={form.status}
                onChange={(e) => u("status", e.target.value)}
                className="w-full mt-1 rounded bg-neutral-800 px-3 py-2 text-white"
              >
                <option>Registered</option>
                <option>Paid</option>
                <option>Cancelled</option>
              </select>
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded bg-neutral-700 px-4 py-2 text-white"
              >
                Cancel
              </button>
              <button
                onClick={update}
                className="rounded bg-yellow-400 px-4 py-2 font-semibold text-black"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* --- Calendar Tab --- */
function CalendarTab() {
  const [workshops, setWorkshops] = useState([]);
  const [monthDays, setMonthDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const data = await listWorkshops();
        setWorkshops(data || []);
      } catch (e) {
        console.error("Failed to load workshops", e);
      }
    })();

    generateMonthDays(currentMonth);
  }, [currentMonth]);

  // Generate month days (local only)
  const generateMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // empty slots for alignment
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // push all days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ year, month, day: d });
    }

    setMonthDays(days);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published": return "bg-green-600 hover:bg-green-700";
      case "Cancelled": return "bg-red-600 hover:bg-red-700";
      case "Completed": return "bg-blue-600 hover:bg-blue-700";
      case "Draft": return "bg-gray-500 hover:bg-gray-600";
      default: return "bg-neutral-700";
    }
  };

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-lg bg-neutral-700 px-3 py-1 text-white hover:bg-neutral-600"
        >
          ⬅ Prev
        </button>
        <h3 className="text-2xl font-bold text-yellow-400">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="rounded-lg bg-neutral-700 px-3 py-1 text-white hover:bg-neutral-600"
        >
          Next ➡
        </button>
      </div>

      {/* Week headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-neutral-400 mb-2">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((d, idx) => {
          if (!d) {
            return <div key={`empty-${idx}`} className="rounded-lg bg-neutral-900/40 min-h-[120px]" />;
          }

          const dayStr = `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
          const dayWorkshops = workshops.filter((w) => {
            const d = new Date(w.date);
            const isoDay = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            return isoDay === dayStr;
          });

          return (
            <div
              key={dayStr}
              className="min-h-[140px] rounded-lg border border-neutral-700 bg-neutral-800 p-2 flex flex-col text-sm"
            >
              <div className="mb-1 text-xs font-semibold text-neutral-300">{d.day}</div>

              <div className="flex flex-col gap-1 overflow-y-auto">
                {dayWorkshops.map((w) => (
                  <div
                    key={w._id}
                    className={`rounded px-2 py-1 text-xs text-white cursor-pointer ${getStatusColor(w.status)}`}
                  >
                    <div className="font-semibold">{w.title}</div>
                    <div className="text-[10px] opacity-80">
                    {new Date(w.date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- Analytics Tab --- */
function AnalyticsTab() {
  const [workshops, setWorkshops] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    (async () => {
      setWorkshops(await listWorkshops());
      setParticipants(await listParticipants());
    })();
  }, []);

  // Workshops per month
  const workshopsPerMonth = workshops.reduce((acc, w) => {
    const month = new Date(w.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const workshopsData = Object.entries(workshopsPerMonth).map(([m, count]) => ({ month: m, count }));

  // By location
  const locationData = workshops.reduce((acc, w) => {
    acc[w.location] = (acc[w.location] || 0) + 1;
    return acc;
  }, {});
  const locationChart = Object.entries(locationData).map(([loc, value]) => ({ name: loc, value }));

  // Registration trend
  const registrationsTrend = workshops.map((w) => ({
    date: w.date,
    participants: participants.filter((p) => p.workshopId?._id === w._id).length,
  }));

  const COLORS = ["#fbb01a", "#b06ab8ff", "#82ca9d", "#ffc658"];

  // Summary numbers
  const totalWorkshops = workshops.length;
  const published = workshops.filter((w) => w.status === "Published").length;
  const cancelled = workshops.filter((w) => w.status === "Cancelled").length;
  const draft = workshops.filter((w) => w.status === "Draft").length;

  return (
    <div className="grid gap-6">
      {/* Summary Cards */}
        <div className="flex gap-6">
          <div className="flex-1 bg-neutral-900 px-6 py-4 h-28 rounded-lg text-center">
            <h4 className="text-sm text-neutral-400">Total Workshops</h4>
            <p className="text-2xl font-bold text-yellow-400">{totalWorkshops}</p>
          </div>
          <div className="flex-1 bg-neutral-900 px-6 py-4 h-28 rounded-lg text-center">
            <h4 className="text-sm text-neutral-400">Published</h4>
            <p className="text-2xl font-bold text-green-500">{published}</p>
          </div>
          <div className="flex-1 bg-neutral-900 px-6 py-4 h-28 rounded-lg text-center">
            <h4 className="text-sm text-neutral-400">Cancelled</h4>
            <p className="text-2xl font-bold text-red-500">{cancelled}</p>
          </div>
          <div className="flex-1 bg-neutral-900 px-6 py-4 h-28 rounded-lg text-center">
            <h4 className="text-sm text-neutral-400">Draft</h4>
            <p className="text-2xl font-bold text-blue-400">{draft}</p>
          </div>
        </div>

      {/* Workshops per Month */}
      <div className="bg-neutral-900 p-4 rounded-xl mt-4 col-span-full">
        <h3 className="text-yellow-400 mb-2 font-semibold">Workshops per Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={workshopsData}>
            <XAxis dataKey="month" stroke="#aaa" />
            <YAxis stroke="#aaa" allowDecimals={false} />
            <Bar dataKey="count" fill="#fbb01a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Workshops by Location */}
      <div className="bg-neutral-900 p-4 rounded-xl">
        <h3 className="text-yellow-400 mb-2 font-semibold">Workshops by Location</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart width={300} height={250}>
            <Pie
              data={locationChart}
              dataKey="value"
              nameKey="name"
              outerRadius={70}   // smaller so labels don’t cut
              label={({ name, value }) => `${name}: ${value}`}
            >
              {locationChart.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Registrations Trend */}
      <div className="bg-neutral-900 p-4 rounded-xl md:col-span-2">
        <h3 className="text-yellow-400 mb-2 font-semibold">Registrations Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={registrationsTrend}>
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" allowDecimals={false} />
            <Line type="monotone" dataKey="participants" stroke="#fbb01a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}



