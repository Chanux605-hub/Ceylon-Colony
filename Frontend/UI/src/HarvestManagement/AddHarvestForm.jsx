import React, { useState } from "react";

export default function AddHarvestForm({ hive, onClose, onSuccess }) {
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quality, setQuality] = useState("High");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/harvests/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmId: hive.farmId,
          hiveId: hive._id || hive.hiveId,
          date,
          quantity,
          quality,
          notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Harvest recorded successfully!");
        onSuccess();
        onClose();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Error saving harvest:", err);
      alert("Server error while adding harvest");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Record Harvest – {hive.hiveName}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Date</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Quantity (kg)</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Quality</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold">Notes</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E6A500] text-black font-semibold hover:bg-yellow-600"
            >
              Save Harvest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
