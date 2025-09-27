import React, { useState } from "react";

export default function UpdateHarvestForm({ harvest, onClose, onSuccess }) {
  const [form, setForm] = useState({
    quantity: harvest.quantity || "",
    quality: harvest.quality || "",
    notes: harvest.notes || "",
    date: harvest.date ? harvest.date.split("T")[0] : "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/harvests/${harvest._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Harvest updated successfully!");
        onSuccess();
        onClose();
      } else {
        alert("❌ Failed to update harvest: " + data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Server error while updating harvest");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] text-white rounded-xl shadow-2xl w-full max-w-md p-6 relative border border-[#2a2a2a]">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-[#FBB01A]">
          Update Harvest
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2 focus:ring-2 focus:ring-[#FBB01A] focus:outline-none"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Quantity (kg)
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2 focus:ring-2 focus:ring-[#FBB01A] focus:outline-none"
              required
            />
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Quality
            </label>
            <select
              name="quality"
              value={form.quality}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2 focus:ring-2 focus:ring-[#FBB01A] focus:outline-none"
              required
            >
              <option value="">Select Quality</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2 focus:ring-2 focus:ring-[#FBB01A] focus:outline-none"
              rows="3"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition shadow"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
