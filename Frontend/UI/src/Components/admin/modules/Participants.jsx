import React, { useEffect, useState } from "react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ParticipantsCrud() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${BASE}/api/participants`);
      const data = await res.json();
      setRows(data);
      setLoading(false);
    })();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this participant?")) return;
    await fetch(`${BASE}/api/participants/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 overflow-x-auto">
      {loading ? <p>Loading…</p> : (
        <table className="w-full table-auto text-sm">
          <thead className="text-neutral-400">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Workshop</th>
              <th className="px-3 py-2 text-left">Seats</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id} className="border-t border-neutral-800">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.email}</td>
                <td className="px-3 py-2">{p.phone}</td>
                <td className="px-3 py-2">{p.workshopId?.title}</td>
                <td className="px-3 py-2">{p.seats}</td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2 text-right">
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
    </div>
  );
}
