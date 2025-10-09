import React, { useState } from "react";

export default function UpdateHarvestForm({ harvest, onClose, onSuccess }) {
  const [form, setForm] = useState({
    quantity: harvest.quantity || "",
    quality: harvest.quality || "",
    notes: harvest.notes || "",
    date: harvest.date ? harvest.date.split("T")[0] : "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation
  const validate = () => {
    const next = {};

    // Date
    if (!form.date) {
      next.date = "Date is required";
    } else {
      const d = new Date(form.date);
      if (d > new Date()) next.date = "Date cannot be in the future";
    }

    // Quantity
    if (!form.quantity) {
      next.quantity = "Quantity is required";
    } else if (Number(form.quantity) <= 0) {
      next.quantity = "Quantity must be greater than 0";
    } else if (Number(form.quantity) > 1000) {
      next.quantity = "Quantity cannot exceed 1000 kg";
    }

    // Quality
    if (!["High", "Medium", "Low"].includes(form.quality)) {
      next.quality = "Select a valid quality";
    }

    // Notes
    if (form.notes.length > 300) {
      next.notes = "Notes cannot exceed 300 characters";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/harvests/${harvest._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

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
            {errors.date && (
              <p className="text-red-400 text-xs">{errors.date}</p>
            )}
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
              step="0.1"
              min="0"
            />
            {errors.quantity && (
              <p className="text-red-400 text-xs">{errors.quantity}</p>
            )}
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
            {errors.quality && (
              <p className="text-red-400 text-xs">{errors.quality}</p>
            )}
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
            {errors.notes && (
              <p className="text-red-400 text-xs">{errors.notes}</p>
            )}
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
