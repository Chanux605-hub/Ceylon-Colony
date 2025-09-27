import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🐝 Update Hive
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hive Name */}
          <div>
            <label className="block font-medium">Hive Name</label>
            <input
              type="text"
              name="hiveName"
              value={formData.hiveName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Hive Type */}
          <div>
            <label className="block font-medium">Hive Type</label>
            <select
              name="hiveType"
              value={formData.hiveType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select type</option>
              <option value="Langstroth">Langstroth</option>
              <option value="Top-bar">Top-bar</option>
              <option value="Warre">Warre</option>
            </select>
          </div>

          {/* Bee Species */}
          <div>
            <label className="block font-medium">Bee Species</label>
            <input
              type="text"
              name="beeSpecies"
              value={formData.beeSpecies}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Colony Strength */}
          <div>
            <label className="block font-medium">Colony Strength</label>
            <select
              name="colonyStrength"
              value={formData.colonyStrength}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select strength</option>
              <option value="Strong">Strong</option>
              <option value="Medium">Medium</option>
              <option value="Weak">Weak</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Material */}
          <div>
            <label className="block font-medium">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Date Established */}
          <div>
            <label className="block font-medium">Date Established</label>
            <input
              type="date"
              name="dateEstablished"
              value={formData.dateEstablished}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Queen ID */}
          <div>
            <label className="block font-medium">Queen ID</label>
            <input
              type="text"
              name="queenId"
              value={formData.queenId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Flora */}
          <div>
            <label className="block font-medium">Flora</label>
            <input
              type="text"
              name="flora"
              value={formData.flora}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Colony Source */}
          <div>
            <label className="block font-medium">Colony Source</label>
            <input
              type="text"
              name="colonySource"
              value={formData.colonySource}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., Split from Hive A, Package Bees"
            />
          </div>

          {/* Last Inspection */}
          <div>
            <label className="block font-medium">Last Inspection</label>
            <input
              type="date"
              name="lastInspection"
              value={formData.lastInspection}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Next Inspection */}
          <div>
            <label className="block font-medium">Next Inspection</label>
            <input
              type="date"
              name="nextInspection"
              value={formData.nextInspection}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Expected Yield */}
          <div>
            <label className="block font-medium">Expected Yield (kg)</label>
            <input
              type="number"
              name="expectedYield"
              value={formData.expectedYield}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition"
          >
            Update Hive
          </button>
        </form>
      </div>
    </div>
  );
}
