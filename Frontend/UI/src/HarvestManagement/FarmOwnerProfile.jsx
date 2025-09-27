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

export default function FarmOwnerProfile() {
  const [farmer, setFarmer] = useState(null);
  const [activeTab, setActiveTab] = useState("farms");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const ownerId = "001"; // Example ownerId (replace with auth user later)
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
            reports: { totalHarvest: 200, lastSeasonYield: 80 },
            notifications: [
              { message: "Hive H12 is low productivity", type: "lowProductivity" },
              { message: "Upcoming harvest due in 3 days", type: "harvestAlert" },
            ],
            harvestHistory: [
              { date: "2025-09-20", qty: 25, quality: "High" },
              { date: "2025-09-15", qty: 18, quality: "Medium" },
            ],
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
            (f) => f._id.toString() !== id.toString() // ✅ fixed comparison
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

  if (!farmer) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="flex gap-6 bg-white min-h-screen p-6 w-full text-black">
      {/* Sidebar */}
      <div className="w-1/4 bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between border-2 border-[#FBB01A]">
        <div>
          {/* Profile Info */}
          <div className="flex flex-col items-center text-center">
            <img
              src={farmer.profilePic}
              alt={farmer.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-[#FBB01A] mb-4 shadow"
            />
            <h2 className="text-xl font-bold text-black flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-[#FBB01A]" /> {farmer.name}
            </h2>
            <p className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-[#FBB01A]" /> {farmer.contact.phone}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-[#FBB01A]" /> {farmer.contact.email}
            </p>
            <p className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-[#FBB01A]" />{" "}
              {farmer.contact.address}
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
                    ? "bg-[#FBB01A] text-black font-semibold shadow"
                    : "text-gray-700 hover:bg-gray-100"
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
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FBB01A] hover:bg-yellow-500 text-black font-semibold border border-[#FBB01A]">
            <Edit3 className="w-4 h-4" /> Update Profile
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white border border-red-600">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Farms Tab */}
        {activeTab === "farms" && (
          <div className="bg-white rounded-2xl shadow-md p-6 h-full border-2 border-[#FBB01A]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-black">
                <Leaf className="w-5 h-5 text-[#FBB01A]" /> Farms
              </h3>
              <button
                onClick={() => navigate("/farmRegistration")}
                className="flex items-center gap-2 bg-[#FBB01A] text-black px-4 py-2 rounded-lg hover:bg-yellow-500 shadow border border-[#FBB01A] "
              >
                <PlusCircle className="w-5 h-5" /> Add New Farm
              </button>
            </div>
            <ul className="space-y-3">
              {farmer.farms.map((farm) => (
                <li
                  key={farm._id}
                  className="p-4 bg-gray-50 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md border-2 border-[#FBB01A]"
                >
                  <div>
                    <p className="font-semibold text-black">{farm.farmName}</p>
                    <p className="text-sm text-gray-600">{farm.district}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm border ${
                        farm.status === "Active"
                          ? "bg-[#FBB01A] text-black font-semibold border-[#FBB01A]"
                          : "bg-gray-300 text-black border-gray-400"
                      }`}
                    >
                      {farm.status}
                    </span>

                    {/* View */}
                    <button
                      onClick={() => navigate(`/farm/${farm.farmId}`)} // ✅ use custom farmId, not _id
                      className="flex items-center gap-1 bg-[#FBB01A] text-black px-3 py-1 rounded hover:bg-yellow-500 shadow border border-[#FBB01A]"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>


                    {/* Update */}
                    <button
                      onClick={() => navigate(`/farm/update/${farm._id}`)} // ✅ use _id
                      className="flex items-center gap-1 bg-black text-[#FBB01A] px-3 py-1 rounded hover:bg-gray-800 shadow border border-black"
                    >
                      <Edit3 className="w-4 h-4" /> Update
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteFarm(farm._id)} // ✅ always _id
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 shadow border border-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
