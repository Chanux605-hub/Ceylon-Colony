// src/Components/admin/modules/WorkshopScheduleManagement.jsx
import React, { useEffect, useState } from "react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// --- API helpers ---
async function jfetch(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
}
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

// --- Main component ---
export default function WorkshopScheduleManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
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

  // open create modal
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

  // open edit modal
  const openEdit = (row) => {
    setForm({ ...row });
    setEditingId(row.id);
    setModalMode("edit");
    setModalOpen(true);
  };

  // handle image upload (DataURL preview)
  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => u("coverUrl", reader.result);
    reader.readAsDataURL(file);
  };

  // submit
  const submitModal = async (e) => {
    e.preventDefault();
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

  // change status
  const changeStatus = async (id, status) => {
    try {
      const updated = await setWorkshopStatus(id, status);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...updated, id: updated._id } : r)));
    } catch (e) {
      alert(e.message || "Failed to update status");
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">Workshop Schedule</h2>

      <div className="mb-3 flex justify-between">
        <input
          placeholder="Search..."
          className="rounded-xl bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
          onChange={(e) =>
            setRows((prev) =>
              prev.filter((w) =>
                w.title.toLowerCase().includes(e.target.value.toLowerCase())
              )
            )
          }
        />
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
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((w) => (
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
                  <td className="px-3 py-2">{w.date}</td>
                  <td className="px-3 py-2">{w.level}</td>
                  <td className="px-3 py-2">{w.location}</td>
                  <td className="px-3 py-2">{w.price}</td>
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
              placeholder="e.g. Rs. 5000"
              value={form.price}
              onChange={(e) => u("price", e.target.value)}
              className="w-full rounded bg-neutral-800 px-3 py-2"
              required
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
