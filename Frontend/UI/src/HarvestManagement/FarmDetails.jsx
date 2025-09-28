import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Hexagon,
  Leaf,
  Edit3,
  Trash2,
  ArrowLeft,
  PlusCircle,
} from "lucide-react";
import farmBanner from "../assets/farm-banner.jpg";
import AddHarvestForm from "./AddHarvestForm";

export default function FarmDetails() {
  const { farmId } = useParams();
  const [farm, setFarm] = useState(null);
  const [hives, setHives] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [showHarvestForm, setShowHarvestForm] = useState(null);
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
      const res = await fetch(`http://localhost:3000/api/hives/farm/${farmId}`);
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

  // Delete hive
  const handleDeleteHive = async (hive) => {
    const hiveIdentifier = hive._id || hive.hiveId;
    if (!window.confirm(`Delete ${hive.hiveName}?`)) return;

    setDeletingId(hiveIdentifier);
    try {
      const res = await fetch(`http://localhost:3000/api/hives/${hiveIdentifier}`, {
        method: "DELETE",
      });
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
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] to-[#1a1a1a] text-white">
      {/* 🔹 Banner */}
      <div
        className="relative h-72 w-full flex items-center justify-center"
        style={{
          backgroundImage: `url(${farmBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <h1 className="relative text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg">
          {farm ? farm.farmName : "Loading..."} Farm
        </h1>
      </div>

      {/* 🔹 Actions */}
      <div className="bg-[#111] shadow-md sticky top-0 z-10 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-700 transition shadow"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Farms
          </button>
          <button
            onClick={() => navigate(`/hiveRegistration?farmId=${farmId}`)}
            className="flex items-center gap-2 bg-[#FBB01A] text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-500 transition shadow"
          >
            <PlusCircle className="w-5 h-5" /> Add Hive
          </button>
        </div>
      </div>

      {/* 🔹 Hives */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-[#FBB01A] mb-3">Hives in this Farm</h2>
        <p className="text-gray-400 mb-10">
          Manage and monitor all bee hives under this farm.
        </p>

        {hives.length === 0 ? (
          <div className="text-center py-20 bg-[#1a1a1a] rounded-xl shadow-xl border border-gray-700">
            <Hexagon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No hives found for this farm</p>
            <button
              onClick={() => navigate(`/hiveRegistration?farmId=${farmId}`)}
              className="bg-[#FBB01A] text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition shadow-md"
            >
              Add Your First Hive
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hives.map((hive) => (
              <div
                key={hive._id || hive.hiveId}
                className="bg-[#1a1a1a] rounded-xl shadow-lg hover:shadow-2xl transition border border-gray-800 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-[#FBB01A] p-4 flex items-center gap-2">
                  <Hexagon className="w-6 h-6 text-black" />
                  <h3 className="text-lg font-bold text-black">{hive.hiveName}</h3>
                </div>

                {/* Card Body */}
                <div className="p-6 text-sm space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bee Species:</span>
                    <span className="font-medium">{hive.beeSpecies || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="font-medium">{hive.hiveType || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Colony Strength:</span>
                    <span className="font-medium">{hive.colonyStrength || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        hive.status === "Active"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {hive.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expected Yield:</span>
                    <span className="font-semibold">{hive.expectedYield ? `${hive.expectedYield} kg` : "N/A"}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6 space-y-3">
                  <button
                    onClick={() => setShowHarvestForm(hive)}
                    className="w-full flex items-center justify-center gap-2 bg-[#FBB01A] text-black px-4 py-2.5 rounded-lg font-medium hover:bg-yellow-500 transition shadow"
                  >
                    <Leaf className="w-4 h-4" /> Add Harvest
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/hive/update/${hive._id}`)}
                      className="flex items-center justify-center gap-2 bg-gray-700 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-600 transition"
                    >
                      <Edit3 className="w-4 h-4" /> Update
                    </button>
                    <button
                      onClick={() => handleDeleteHive(hive)}
                      disabled={deletingId === (hive._id || hive.hiveId)}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                        deletingId === (hive._id || hive.hiveId)
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingId === (hive._id || hive.hiveId) ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
