import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Hexagon,
  Leaf,
  Edit3,
  Trash2,
  ArrowLeft,
  PlusCircle,
  History,
} from "lucide-react";
import farmBanner from "../assets/farm-banner.jpg";
import AddHarvestForm from "./AddHarvestForm"; // ✅ import modal

export default function FarmDetails() {
  const { farmId } = useParams();
  const [farm, setFarm] = useState(null);
  const [hives, setHives] = useState([]);
  const [harvests, setHarvests] = useState([]); // ✅ new
  const [deletingId, setDeletingId] = useState(null);
  const [showHarvestForm, setShowHarvestForm] = useState(null); // ✅ modal state
  const navigate = useNavigate();

  // Fetch farm details
  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/farms/${farmId}`);
        const data = await res.json();
        if (data.success) setFarm(data.farm);
      } catch (err) {
        console.error("Error fetching farm:", err);
      }
    };
    fetchFarm();
  }, [farmId]);

  // Fetch hives
  const fetchHives = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/hives/farm/${farmId}`
      );
      const data = await res.json();
      if (data.success) setHives(data.hives);
    } catch (err) {
      console.error("Error fetching hives:", err);
    }
  };

  // Fetch harvests
  const fetchHarvests = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/harvests/farm/${farmId}`);
      const data = await res.json();
      if (data.success) setHarvests(data.harvests);
    } catch (err) {
      console.error("Error fetching harvests:", err);
    }
  };

  useEffect(() => {
    fetchHives();
    fetchHarvests();
  }, [farmId]);

  // Delete harvest
  const handleDeleteHarvest = async (id) => {
    if (!window.confirm("Delete this harvest record?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/harvests/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Harvest deleted successfully!");
        fetchHarvests();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Delete hive
  const handleDeleteHive = async (hive) => {
    const hiveIdentifier = hive._id || hive.hiveId;
    if (!window.confirm(`Delete ${hive.hiveName}?`)) return;

    setDeletingId(hiveIdentifier);

    try {
      const res = await fetch(
        `http://localhost:3000/api/hives/${hiveIdentifier}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.success) {
        setHives((prev) =>
          prev.filter((h) => h._id !== hive._id && h.hiveId !== hive.hiveId)
        );
        alert("✅ Hive deleted successfully!");
      } else {
        alert("❌ Error deleting hive: " + data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete hive");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* 🔹 Banner */}
      <div
        className="relative h-64 w-full overflow-hidden"
        style={{
          backgroundImage: `url(${farmBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg">
            Farm Details of {farm ? farm.farmName : "Loading..."} Farm
          </h1>
        </div>
      </div>

      {/* 🔹 Actions */}
      <div className="bg-[#FFFDF6] shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Farms
          </button>
          <button
            onClick={() => navigate(`/hiveRegistration?farmId=${farmId}`)}
            className="flex items-center gap-2 bg-[#E6A500] text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-600 transition shadow"
          >
            <PlusCircle className="w-5 h-5" /> Add Hive
          </button>
        </div>
      </div>

      {/* 🔹 Hives */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Hives in this Farm
        </h2>
        <p className="text-gray-600 mb-8">
          Manage and monitor all bee hives under this farm
        </p>

        {hives.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <Hexagon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">
              No hives found for this farm
            </p>
            <button
              onClick={() => navigate(`/hiveRegistration?farmId=${farmId}`)}
              className="bg-[#E6A500] text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Add Your First Hive
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hives.map((hive) => (
              <div
                key={hive._id || hive.hiveId}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-[#E6A500] p-4">
                  <div className="flex items-center gap-2">
                    <Hexagon className="w-6 h-6 text-white" />
                    <h3 className="text-lg font-bold text-white">
                      {hive.hiveName}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bee Species:</span>
                      <span className="font-medium">
                        {hive.beeSpecies || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {hive.hiveType || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Colony Strength:</span>
                      <span className="font-medium">
                        {hive.colonyStrength || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          hive.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {hive.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Yield:</span>
                      <span className="font-semibold text-gray-900">
                        {hive.expectedYield ? `${hive.expectedYield} kg` : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="space-y-3">
                    {/* 🔹 Open Harvest Modal */}
                    <button
                      onClick={() => setShowHarvestForm(hive)}
                      className="w-full flex items-center justify-center gap-2 bg-[#E6A500] text-black px-4 py-2.5 rounded-lg font-medium hover:bg-yellow-600 transition"
                    >
                      <Leaf className="w-4 h-4" /> Harvest
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => navigate(`/hive/update/${hive._id}`)}
                        className="flex items-center justify-center gap-2 bg-[#065F46] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#064E3B] transition"
                      >
                        <Edit3 className="w-4 h-4" /> Update
                      </button>
                      <button
                        onClick={() => handleDeleteHive(hive)}
                        disabled={deletingId === (hive._id || hive.hiveId)}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                          deletingId === (hive._id || hive.hiveId)
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingId === (hive._id || hive.hiveId)
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Harvest History */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <History className="w-6 h-6 text-yellow-600" /> Harvest History
        </h2>
        <p className="text-gray-600 mb-6">
          Records of harvests from all hives in this farm
        </p>

        {harvests.length === 0 ? (
          <p className="text-gray-600">No harvests recorded yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Hive</th>
                  <th className="p-3 border">Quantity (kg)</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Quality</th>
                  <th className="p-3 border">Notes</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {harvests.map((h) => (
                  <tr key={h._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{h.hiveName || h.hiveId}</td>
                    <td className="p-3 border">{h.quantity}</td>
                    <td className="p-3 border">
                      {new Date(h.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border">{h.quality}</td>
                    <td className="p-3 border">{h.notes}</td>
                    <td className="p-3 border flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                        <Edit3 className="w-4 h-4" /> Update
                      </button>
                      <button
                        onClick={() => handleDeleteHarvest(h._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
      </div>

      {/* 🔹 Harvest Modal */}
      {showHarvestForm && (
        <AddHarvestForm
          hive={showHarvestForm}
          onClose={() => setShowHarvestForm(null)}
          onSuccess={() => {
            fetchHives();
            fetchHarvests();
          }}
        />
      )}
    </div>
  );
}
