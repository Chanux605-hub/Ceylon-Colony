import React, { useEffect, useState } from "react";
import { Edit3, Trash2 } from "lucide-react";

export default function HarvestHistory() {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);

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
      if (data.success) {
        alert("✅ Harvest deleted");
        fetchHarvests();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Harvest History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : harvests.length === 0 ? (
        <p>No harvest records found</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Farm</th>
              <th className="p-3 border">Hive</th>
              <th className="p-3 border">Quantity (kg)</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {harvests.map((h) => (
              <tr key={h._id} className="hover:bg-gray-50">
                <td className="p-3 border">{h.farmName || h.farmId}</td>
                <td className="p-3 border">{h.hiveName || h.hiveId}</td>
                <td className="p-3 border">{h.quantity}</td>
                <td className="p-3 border">
                  {new Date(h.date).toLocaleDateString()}
                </td>
                <td className="p-3 border flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                    <Edit3 className="w-4 h-4" /> Update
                  </button>
                  <button
                    onClick={() => handleDelete(h._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
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
