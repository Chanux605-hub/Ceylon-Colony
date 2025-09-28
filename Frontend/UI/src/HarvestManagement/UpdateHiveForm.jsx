import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function HiveUpdateForm() {
  const { hiveId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hiveName: "",
    hiveType: "",
    beeSpecies: "",
    colonyStrength: "",
    status: "",
    expectedYield: "",
    location: "",
    material: "",
    dateEstablished: "",
    queenId: "",
    flora: "",
    colonySource: "",
    lastInspection: "",
    nextInspection: "",
    notes: "",
  });

  useEffect(() => {
    const fetchHive = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/hives/${hiveId}`);
        const data = await res.json();

        if (data.success && data.hive) {
          setFormData({
            hiveName: data.hive.hiveName || "",
            hiveType: data.hive.hiveType || "",
            beeSpecies: data.hive.beeSpecies || "",
            colonyStrength: data.hive.colonyStrength || "",
            status: data.hive.status || "",
            expectedYield: data.hive.expectedYield || "",
            location: data.hive.location || "",
            material: data.hive.material || "",
            dateEstablished: data.hive.dateEstablished
              ? data.hive.dateEstablished.split("T")[0]
              : "",
            queenId: data.hive.queenId || "",
            flora: data.hive.flora || "",
            colonySource: Array.isArray(data.hive.colonySource)
              ? data.hive.colonySource.join(", ")
              : data.hive.colonySource || "",
            lastInspection: data.hive.lastInspection
              ? data.hive.lastInspection.split("T")[0]
              : "",
            nextInspection: data.hive.nextInspection
              ? data.hive.nextInspection.split("T")[0]
              : "",
            notes: data.hive.notes || "",
          });
        }
      } catch (err) {
        console.error("Error fetching hive:", err);
      }
    };

    fetchHive();
  }, [hiveId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/hives/${hiveId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Hive updated successfully!");
        navigate(-1);
      } else {
        alert("❌ Error updating hive: " + data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Failed to update hive");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-4 py-10">
      {/* 🔹 Back Button (outside form) */}
      <div className="w-full max-w-3xl mb-6 flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      {/* 🔹 Form */}
      <div className="w-full max-w-3xl bg-[#1a1a1a] p-8 rounded-2xl shadow-lg border border-[#FBB01A]/40">
        <h2 className="text-3xl font-bold text-center text-[#FBB01A] mb-6">
          🐝 Update Hive
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          {/* Hive Name */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Hive Name</label>
            <input
              type="text"
              name="hiveName"
              value={formData.hiveName}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
            />
          </div>

          {/* Hive Type */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Hive Type</label>
            <select
              name="hiveType"
              value={formData.hiveType}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
            >
              <option value="">Select type</option>
              <option value="Langstroth">Langstroth</option>
              <option value="Top-bar">Top-bar</option>
              <option value="Warre">Warre</option>
            </select>
          </div>

          {/* Bee Species */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Bee Species</label>
            <input
              type="text"
              name="beeSpecies"
              value={formData.beeSpecies}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
            />
          </div>

          {/* Colony Strength */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Colony Strength</label>
            <select
              name="colonyStrength"
              value={formData.colonyStrength}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
            >
              <option value="">Select strength</option>
              <option value="Strong">Strong</option>
              <option value="Medium">Medium</option>
              <option value="Weak">Weak</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
            />
          </div>

          {/* Material */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
            />
          </div>

          {/* Date Established */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Date Established</label>
            <input
              type="date"
              name="dateEstablished"
              value={formData.dateEstablished}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
            />
          </div>

          {/* Expected Yield */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Expected Yield (kg)</label>
            <input
              type="number"
              name="expectedYield"
              value={formData.expectedYield}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-1 text-[#FBB01A]">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-[#0B0B0B] text-white rounded px-3 py-2"
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/2 bg-gray-700 text-white py-2 rounded-lg font-medium hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-[#FBB01A] text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              Update Hive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
