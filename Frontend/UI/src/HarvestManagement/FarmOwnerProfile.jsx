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
import HarvestHistory from "../HarvestManagement/HarvestHistory.jsx"; // ✅ Harvest Tab

export default function FarmOwnerProfile() {
  const [farmer, setFarmer] = useState(null);
  const [activeTab, setActiveTab] = useState("farms");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const ownerId = "001"; // Example ownerId
        const res = await fetch(
          `http://localhost:3000/api/farms/owner/${ownerId}`
        );
        const data = await res.json();

        if (data.success) {
          setFarmer({
            farmerId: ownerId,
            name: "John Silva",
            contact: {
              phone: "0771234567",
              email: "john@example.com",
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

  // ✅ Delete handler
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
          farms: prev.farms.filter(
            (f) => f._id.toString() !== id.toString()
          ),
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

  if (!farmer) return <p className="text-center text-white">Loading profile...</p>;

  return (
    <div className="flex gap-6 bg-[#0B0B0B] min-h-screen p-6 w-full text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#1a1a1a] rounded-xl shadow-lg p-6 flex flex-col justify-between">
        <div>
          {/* Profile Info */}
          <div className="flex flex-col items-center text-center">
            <img
              src={farmer.profilePic}
              alt={farmer.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-[#FBB01A] mb-4 shadow-lg"
            />
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-[#FBB01A]" /> {farmer.name}
            </h2>
            <p className="flex items-center gap-2 text-gray-300">
              <Phone className="w-4 h-4 text-[#FBB01A]" /> {farmer.contact.phone}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4 text-[#FBB01A]" /> {farmer.contact.email}
            </p>
            <p className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-[#FBB01A]" /> {farmer.contact.address}
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex flex-col space-y-2">
            {["farms", "analytics", "harvest", "notifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-4 py-2 rounded-lg transition ${
                  activeTab === tab
                    ? "bg-[#FBB01A] text-black font-semibold"
                    : "text-gray-300 hover:bg-[#2a2a2a]"
                }`}
              >
                {tab === "farms" && (
                  <>
                    <Leaf className="inline w-4 h-4 mr-2" /> Farms
                  </>
                )}
                {tab === "analytics" && (
                  <>
                    <BarChart3 className="inline w-4 h-4 mr-2" /> Analytics
                  </>
                )}
                {tab === "harvest" && (
                  <>
                    <History className="inline w-4 h-4 mr-2" /> Harvest
                  </>
                )}
                {tab === "notifications" && (
                  <>
                    <Bell className="inline w-4 h-4 mr-2" /> Notifications
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col space-y-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FBB01A] hover:bg-yellow-500 text-black font-semibold transition shadow">
            <Edit3 className="w-4 h-4" /> Update Profile
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition shadow">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Farms Tab */}
        {activeTab === "farms" && (
          <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-between items-center mb-4">
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
                  className="p-4 bg-[#0B0B0B] rounded-lg flex justify-between items-center shadow hover:shadow-lg"
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

                    {/* View */}
                    <button
                      onClick={() => navigate(`/farm/${farm.farmId}`)}
                      className="flex items-center gap-1 bg-[#2D9CDB] text-white px-3 py-1 rounded-lg font-medium hover:bg-[#1B77B9] transition shadow"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>

                    {/* Update */}
                    <button
                      onClick={() => navigate(`/farm/update/${farm._id}`)}
                      className="flex items-center gap-1 bg-[#10B981] text-white px-3 py-1 rounded-lg font-medium hover:bg-[#059669] transition shadow"
                    >
                      <Edit3 className="w-4 h-4" /> Update
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteFarm(farm._id)}
                      className="flex items-center gap-1 bg-[#EF4444] text-white px-3 py-1 rounded-lg font-medium hover:bg-[#DC2626] transition shadow"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ✅ Harvest Tab */}
        {activeTab === "harvest" && (
          <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 h-full">
            <HarvestHistory />
          </div>
        )}
      </div>
    </div>
  );
}
