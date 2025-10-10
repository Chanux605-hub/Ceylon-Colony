import React, { useEffect, useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import UpdateHarvestForm from "./UpdateHarvestForm";

export default function HarvestHistory() {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHarvest, setEditingHarvest] = useState(null);

  // Fetch all harvests
  const fetchHarvests = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/harvests");
      const data = await res.json();
      if (data.success) setHarvests(data.harvests);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching harvests:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarvests();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this harvest?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/harvests/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Harvest deleted");
        setHarvests((prev) => prev.filter((h) => h._id !== id));
      } else {
        alert("❌ " + (data.message || "Failed to delete harvest"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Server error while deleting");
    }
  };

  return (
    <div className="p-6 bg-[#1a1a1a] rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-[#FBB01A] border-b border-gray-700 pb-2">
        Harvest History
      </h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : harvests.length === 0 ? (
        <p className="text-gray-400">No harvest records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#2a2a2a] text-gray-300 text-left">
                <th className="p-3">Farm</th>
                <th className="p-3">Hive</th>
                <th className="p-3">Quantity (kg)</th>
                <th className="p-3">Date</th>
                <th className="p-3">Quality</th>
                <th className="p-3">Notes</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {harvests.map((h, idx) => (
                <tr
                  key={h._id}
                  className={`transition ${
                    idx % 2 === 0 ? "bg-[#0B0B0B]" : "bg-[#111111]"
                  } hover:bg-[#2a2a2a]`}
                >
                  <td className="p-3">{h.farmName || h.farmId}</td>
                  <td className="p-3">{h.hiveName || h.hiveId}</td>
                  <td className="p-3">{h.quantity}</td>
                  <td className="p-3">
                    {new Date(h.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{h.quality}</td>
                  <td className="p-3">{h.notes}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => setEditingHarvest(h)}
                      className="flex items-center gap-1 px-3 py-1 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#059669] transition shadow"
                    >
                      <Edit3 className="w-4 h-4" /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(h._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-[#EF4444] text-white rounded-lg font-medium hover:bg-[#DC2626] transition shadow"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      {editingHarvest && (
        <UpdateHarvestForm
          harvest={editingHarvest}
          onClose={() => setEditingHarvest(null)}
          onSuccess={fetchHarvests}
        />
      )}
    </div>
  );
}
