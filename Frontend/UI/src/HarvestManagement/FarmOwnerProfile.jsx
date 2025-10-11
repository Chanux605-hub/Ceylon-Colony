import React, { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Leaf,
  Bell,
  BarChart3,
  PlusCircle,
  History,
  LogOut,
  Edit3,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HarvestHistory from "./HarvestHistory.jsx";
import FarmAnalyticsDashboard from "./FarmAnalyticsDashboard.jsx";
import Navbar from "../Components/User/navbar.jsx"; // ✅ Imported your responsive navbar

export default function FarmOwnerProfile() {
  const [farmer, setFarmer] = useState(null);
  const [activeTab, setActiveTab] = useState("farms");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const ownerId = "001"; // Example static ownerId
        const res = await fetch(`http://localhost:3000/api/farms/owner/${ownerId}`);
        const data = await res.json();

        if (data.success) {
          setFarmer({
            farmerId: ownerId,
            name: "John Silva",
            contact: {
              phone: "0771234567",
              email: "johnsilva@gmail.com",
              address: "Kandy, Sri Lanka",
            },
            profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
            farms: data.farms,
          });
        }
      } catch (err) {
        console.error("Error fetching farms:", err);
      }
    };

    fetchFarmerData();
  }, []);

  const handleDeleteFarm = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farm?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/farms/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setFarmer((prev) => ({
          ...prev,
          farms: prev.farms.filter((f) => f._id.toString() !== id.toString()),
        }));
        alert("✅ Farm deleted successfully!");
      } else {
        alert("❌ Error deleting farm: " + data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete farm");
    }
  };

  if (!farmer) return <p className="text-center text-white mt-10">Loading profile...</p>;

  return (
    <div className="bg-[#0B0B0B] min-h-screen text-white flex flex-col">
      {/* ✅ Ceylon Colony Navbar */}
      <Navbar />

      {/* ✅ Dashboard Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#111111] text-gray-300 flex flex-col justify-between p-6 border-r border-[#2a2a2a]">
          <div>
            <div className="flex flex-col items-center text-center mb-8">
              <img
                src={farmer.profilePic}
                alt={farmer.name}
                className="w-24 h-24 rounded-full border-4 border-[#FBB01A] mb-3"
              />
              <h2 className="text-lg font-bold">{farmer.name}</h2>
              <p className="text-sm text-gray-400">{farmer.contact.email}</p>
            </div>

            {/* Sidebar tabs */}
            <div className="flex flex-col space-y-2">
              {["farms", "analytics", "harvest", "notifications"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    activeTab === tab
                      ? "bg-[#FBB01A] text-black font-semibold"
                      : "hover:bg-[#1f1f1f]"
                  }`}
                >
                  {tab === "farms" && <Leaf className="w-4 h-4" />}
                  {tab === "analytics" && <BarChart3 className="w-4 h-4" />}
                  {tab === "harvest" && <History className="w-4 h-4" />}
                  {tab === "notifications" && <Bell className="w-4 h-4" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar bottom actions */}
          <div className="mt-8 flex flex-col space-y-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FBB01A] text-black font-semibold hover:bg-yellow-500 transition">
              <Edit3 className="w-4 h-4" /> Update Profile
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* ✅ Main Content Area */}
        <main className="flex-1 bg-[#0B0B0B] p-8 overflow-y-auto">
          {activeTab === "farms" && (
            <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#FBB01A]" /> Farms
                </h3>
                <button
                  onClick={() => navigate("/farmRegistration")}
                  className="flex items-center gap-2 bg-[#FBB01A] text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition shadow"
                >
                  <PlusCircle className="w-5 h-5" /> Add New Farm
                </button>
              </div>

              <ul className="space-y-3">
                {farmer.farms.map((farm) => (
                  <li
                    key={farm._id}
                    className="p-4 bg-[#0B0B0B] rounded-lg flex justify-between items-center hover:shadow-lg transition"
                  >
                    <div>
                      <p className="font-semibold">{farm.farmName}</p>
                      <p className="text-sm text-gray-400">{farm.district}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          farm.status === "Active"
                            ? "bg-[#FBB01A] text-black font-semibold"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {farm.status}
                      </span>
                      <button
                        onClick={() => navigate(`/farm/${farm.farmId}`)}
                        className="flex items-center gap-1 bg-[#2D9CDB] text-white px-3 py-1 rounded-lg font-medium hover:bg-[#1B77B9]"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => navigate(`/farm/update/${farm._id}`)}
                        className="flex items-center gap-1 bg-[#10B981] text-white px-3 py-1 rounded-lg font-medium hover:bg-[#059669]"
                      >
                        <Edit3 className="w-4 h-4" /> Update
                      </button>
                      <button
                        onClick={() => handleDeleteFarm(farm._id)}
                        className="flex items-center gap-1 bg-[#EF4444] text-white px-3 py-1 rounded-lg font-medium hover:bg-[#DC2626]"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6">
              <FarmAnalyticsDashboard ownerId={farmer.farmerId} />
            </div>
          )}

          {activeTab === "harvest" && (
            <div className="bg-[#1A1A1A] rounded-xl shadow-lg p-6">
              <HarvestHistory />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
