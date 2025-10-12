import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Download,
  BarChart3,
  Leaf,
  Building,
  Hexagon,
  Bell,
  CheckCircle,
  XCircle,
  Tag,
} from "lucide-react";

export default function FarmHarvestManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: Leaf },
    { id: "farms", label: "Farms", icon: Building },
    { id: "hives", label: "Hives", icon: Hexagon },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: Download },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "actions", label: "Admin Actions", icon: Tag },
  ];

  // 🔹 Fetch farms when "farms" tab is active
  useEffect(() => {
    if (activeTab === "farms" || activeTab === "overview" || activeTab === "hives") {
      axios
        .get("http://localhost:4000/api/farms")
        .then((res) => {
          if (res.data.success) {
            setFarms(res.data.farms);
          }
        })
        .catch((err) => console.error("Error fetching farms:", err));
    }
  }, [activeTab]);

  // 🔹 View single farm details
  const handleViewFarm = async (farmId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/farms/${farmId}`);
      if (res.data.success) {
        setSelectedFarm(res.data.farm);
      }
    } catch (error) {
      console.error("Error fetching farm details:", error);
    }
  };

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">Farm & Harvest Management</h1>
      <p className="text-gray-400 mb-6">
        Monitor farms, hives, harvest records, analytics, and manage farm owners.
      </p>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-gray-700 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md ${
              activeTab === tab.id
                ? "bg-[#1A1A1A] text-[#FBB01A] font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl shadow">
        {/* 🔹 Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Farm Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#2A2A2A] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Farms</p>
                <p className="text-2xl font-bold">{farms.length}</p>
              </div>
              <div className="bg-[#2A2A2A] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Active vs Inactive</p>
                <p className="text-2xl font-bold">
                  {farms.filter((f) => f.status === "Active").length} /{" "}
                  {farms.filter((f) => f.status !== "Active").length}
                </p>
              </div>
              <div className="bg-[#2A2A2A] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Hives</p>
                <p className="text-2xl font-bold">
                  {farms.reduce((acc, f) => acc + (f.numHives || 0), 0)}
                </p>
              </div>
              <div className="bg-[#2A2A2A] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Harvests this Month</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Farms Tab */}
        {activeTab === "farms" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Registered Farms</h2>
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-[#2A2A2A] text-gray-300">
                <tr>
                  <th className="px-4 py-2">Farm</th>
                  <th className="px-4 py-2">Owner</th>
                  <th className="px-4 py-2">District</th>
                  <th className="px-4 py-2">Hives</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {farms.map((farm) => (
                  <tr key={farm._id} className="border-b border-gray-700">
                    <td className="px-4 py-2">{farm.farmName}</td>
                    <td className="px-4 py-2">{farm.owner}</td>
                    <td className="px-4 py-2">{farm.district}</td>
                    <td className="px-4 py-2">{farm.numHives}</td>
                    <td
                      className={`px-4 py-2 ${
                        farm.status === "Active"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {farm.status}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleViewFarm(farm._id)}
                        className="text-blue-400 hover:underline"
                      >
                        View
                      </button>
                      <button className="text-red-400 hover:underline">
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
                {farms.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-400">
                      No farms registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 🔹 Farm Details Modal */}
            {selectedFarm && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-[#1A1A1A] p-6 rounded-lg w-[500px] shadow-lg">
                  <h3 className="text-xl font-bold mb-4">
                    {selectedFarm.farmName}
                  </h3>
                  <p><strong>Owner:</strong> {selectedFarm.owner}</p>
                  <p><strong>Phone:</strong> {selectedFarm.phone}</p>
                  <p><strong>Email:</strong> {selectedFarm.email}</p>
                  <p>
                    <strong>Address:</strong> {selectedFarm.address},{" "}
                    {selectedFarm.district}
                  </p>
                  <p><strong>Size:</strong> {selectedFarm.size} acres</p>
                  <p><strong>Hives:</strong> {selectedFarm.numHives}</p>
                  <p>
                    <strong>Hive Types:</strong>{" "}
                    {selectedFarm.hiveTypes?.join(", ")}
                  </p>
                  <p><strong>Flora:</strong> {selectedFarm.flora}</p>
                  <p>
                    <strong>Date Established:</strong>{" "}
                    {selectedFarm.dateEstablished
                      ? new Date(selectedFarm.dateEstablished).toDateString()
                      : "--"}
                  </p>
                  <p>
                    <strong>Expected Yield:</strong>{" "}
                    {selectedFarm.expectedAnnualYield} kg
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setSelectedFarm(null)}
                      className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 🔹 Hives Tab */}
        {activeTab === "hives" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Hive Management Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-400">Total Hives</p>
                <p className="text-xl font-bold">
                  {farms.reduce((acc, f) => acc + (f.numHives || 0), 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Productive</p>
                <p className="text-xl font-bold text-green-400">--</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Low Productive</p>
                <p className="text-xl font-bold text-red-400">--</p>
              </div>
            </div>
            <div className="mt-6 h-40 flex items-center justify-center text-gray-500">
              🐝 Pie/Donut Chart goes here
            </div>
          </div>
        )}

        {/* 🔹 Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Harvest Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#2A2A2A] p-6 rounded-lg">
                <p className="font-semibold">Harvest by Month</p>
                <div className="h-40 flex items-center justify-center text-gray-500">
                  📊 Line/Bar Chart
                </div>
              </div>
              <div className="bg-[#2A2A2A] p-6 rounded-lg">
                <p className="font-semibold">Harvest by Farm</p>
                <div className="h-40 flex items-center justify-center text-gray-500">
                  📊 Comparison Chart
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Reports Tab */}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Reports & Downloads</h2>
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#FBB01A] text-black px-4 py-2 rounded hover:bg-yellow-500">
                Generate Farm Report
              </button>
              <button className="bg-[#FBB01A] text-black px-4 py-2 rounded hover:bg-yellow-500">
                Harvest Summary Report
              </button>
              <button className="bg-[#FBB01A] text-black px-4 py-2 rounded hover:bg-yellow-500">
                Hive-wise Breakdown
              </button>
            </div>
          </div>
        )}

        {/* 🔹 Alerts Tab */}
        {activeTab === "alerts" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Notifications & Alerts</h2>
            <ul className="space-y-2 text-sm">
              <li className="text-yellow-400">Farm A → Harvest due in 7 days</li>
              <li className="text-red-400">Farm B → Low hive productivity</li>
              <li className="text-gray-400">Farm C → No updates in 3 months</li>
            </ul>
          </div>
        )}

        {/* 🔹 Admin Actions Tab */}
        {activeTab === "actions" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Admin Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                <CheckCircle size={16} /> Approve Farm
              </button>
              <button className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                <XCircle size={16} /> Reject Farm
              </button>
              <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                <Tag size={16} /> Assign Label
              </button>
              <button className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
                <Bell size={16} /> Send Reminder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
