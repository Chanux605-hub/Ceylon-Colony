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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 w-full max-w-lg border border-[#FBB01A]/40">
        <h2 className="text-2xl font-bold mb-6 text-[#FBB01A] text-center">
          🌿 Record Harvest – {hive.hiveName}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-[#FBB01A]">
              Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-[#FBB01A]">
              Quantity (kg)
            </label>
            <input
              type="number"
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0"
              step="0.1"
            />
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-semibold text-[#FBB01A]">
              Quality
            </label>
            <select
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#FBB01A]">
              Notes
            </label>
            <textarea
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#FBB01A] text-black font-semibold hover:bg-yellow-500 transition"
            >
              Save Harvest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
