import React, { useState, useEffect } from "react";
import HarvestAnalytics from "./HarvestAnalytics";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

export default function FarmHarvestManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // Hive states
  const [hives, setHives] = useState([]);
  const [hiveStats, setHiveStats] = useState({ total: 0, productive: 0, lowProductive: 0 });
  const [hiveAlerts, setHiveAlerts] = useState({ overdueInspections: [], lowProductive: [] });

  // Harvest state
  const [monthlyHarvest, setMonthlyHarvest] = useState({ total: 0, count: 0 });

  // ✅ Harvest Insights
  const [harvestInsights, setHarvestInsights] = useState({
    bestFarm: null,
    avgPerFarm: 0,
    yearlyTotal: 0,
    topHive: null,
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: Leaf },
    { id: "farms", label: "Farms", icon: Building },
    { id: "hives", label: "Hives", icon: Hexagon },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "actions", label: "Admin Actions", icon: Tag },
  ];

  // Fetch farms
  useEffect(() => {
    if (activeTab === "farms" || activeTab === "overview" || activeTab === "hives") {
      axios
        .get("http://localhost:3000/api/farms")
        .then((res) => {
          if (res.data.success) {
            setFarms(res.data.farms);
          }
        })
        .catch((err) => console.error("Error fetching farms:", err));
    }
  }, [activeTab]);

  // Fetch hive stats
  useEffect(() => {
    if (activeTab === "hives" || activeTab === "overview") {
      axios.get("http://localhost:3000/api/hives/stats").then((res) => {
        if (res.data.success) setHiveStats(res.data.stats);
      });
    }
    if (activeTab === "hives") {
      axios.get("http://localhost:3000/api/hives").then((res) => {
        if (res.data.success) setHives(res.data.hives);
      });
      axios.get("http://localhost:3000/api/hives/alerts").then((res) => {
        if (res.data.success) setHiveAlerts(res.data.alerts);
      });
    }
  }, [activeTab]);

  // Fetch monthly harvest total
  useEffect(() => {
    if (activeTab === "overview") {
      axios
        .get("http://localhost:3000/api/harvests/monthly-total")
        .then((res) => {
          if (res.data.success) setMonthlyHarvest(res.data);
        })
        .catch((err) => console.error("Error fetching monthly harvest:", err));
    }
  }, [activeTab]);

  // ✅ Fetch harvest insights
  useEffect(() => {
    if (activeTab === "overview") {
      axios
        .get("http://localhost:3000/api/harvests/insights")
        .then((res) => {
          if (res.data.success) setHarvestInsights(res.data.data);
        })
        .catch((err) => console.error("Error fetching harvest insights:", err));
    }
  }, [activeTab]);

  // Fetch analytics
  useEffect(() => {
    if (activeTab === "analytics") {
      axios
        .get("http://localhost:3000/api/harvests/by-month")
        .then((res) => res.data.success && setHarvestByMonth(res.data.data));
      axios
        .get("http://localhost:3000/api/harvests/by-farm")
        .then((res) => res.data.success && setHarvestByFarm(res.data.data));
    }
  }, [activeTab]);

  // View farm details
  const handleViewFarm = async (farmId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/farms/${farmId}`);
      if (res.data.success) {
        setSelectedFarm(res.data.farm);
      }
    } catch (error) {
      console.error("Error fetching farm details:", error);
    }
  };

  // Update farm status
  const handleUpdateFarmStatus = async (farmId, newStatus) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${newStatus.toLowerCase()} this farm?`
    );
    if (!confirmAction) return;

    try {
      const res = await axios.put(`http://localhost:3000/api/farms/${farmId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        alert(`✅ Farm ${newStatus.toLowerCase()}d successfully!`);
        setFarms((prev) =>
          prev.map((farm) =>
            farm._id === farmId ? { ...farm, status: newStatus } : farm
          )
        );
      }
    } catch (error) {
      console.error(`Error updating farm status:`, error);
      alert("❌ Failed to update farm status. Check console for details.");
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
                <p className="text-lg font-bold">{farms.length}</p>
              </div>
              <div className="bg-[#2A2A2A] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Active vs Inactive</p>
                <p className="text-lg font-bold">
                  {farms.filter((f) => f.status === "Active").length} Active /
                  {farms.filter((f) => f.status !== "Active").length} Inactive
                </p>
              </div>
              <div className="bg-[#2A2A2A] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Hives</p>
                <p className="text-lg font-bold">
                  {farms.reduce((acc, f) => acc + (f.numHives || 0), 0)}
                </p>
              </div>
              <div className="bg-[#2A2A2A] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Harvests this Month</p>
                <p className="text-lg font-bold">{monthlyHarvest.total} kg</p>
                <p className="text-sm text-gray-400">
                  ({monthlyHarvest.count} records)
                </p>
              </div>
            </div>

            {/* ✅ Harvest Insights Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-lg">
                Harvest Insights
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#2A2A2A] p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400">🏆 Best Farm of the Month</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {harvestInsights.bestFarm || "–"}
                  </p>
                </div>

                <div className="bg-[#2A2A2A] p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400">🍯 Avg Harvest / Farm</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {harvestInsights.avgPerFarm?.toFixed(1) || 0} kg
                  </p>
                </div>

                <div className="bg-[#2A2A2A] p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400">📊 Total Harvest This Year</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {harvestInsights.yearlyTotal} kg
                  </p>
                </div>

                <div className="bg-[#2A2A2A] p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400">🐝 Top Hive</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {harvestInsights.topHive || "–"}
                  </p>
                </div>
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
                  <th className="px-9 py-2">Actions</th>
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
                    <td className="px-4 py-2 flex gap-10">
                      <button
                        onClick={() => handleViewFarm(farm._id)}
                        className="text-blue-400 hover:underline"
                      >
                        View
                      </button>

                      {farm.status === "Active" ? (
                      <button
                        onClick={() => handleUpdateFarmStatus(farm._id, "Inactive")}
                        className="text-red-400 hover:underline"
                      >
                        Deactivate
                      </button>
                      ) : (
                      <button
                        onClick={() => handleUpdateFarmStatus(farm._id, "Active")}
                        className="text-green-400 hover:underline"
                      >
                        Activate
                      </button>
                    )}
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

            {/*  Farm Details Modal */}
            {selectedFarm && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#1A1A1A] rounded-xl shadow-2xl w-[650px] max-h-[85vh] overflow-y-auto border border-gray-700">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
                    <h3 className="text-xl font-bold text-[#FBB01A] flex items-center gap-2">
                      <Building size={18} /> {selectedFarm.farmName}
                    </h3>
                    <button
                      onClick={() => setSelectedFarm(null)}
                      className="text-gray-400 hover:text-white text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-6 space-y-8">
                    {/* Owner Info */}
                    <section>
                      <h4 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                        <Tag size={16}/> Owner Info
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-400">Owner:</span> {selectedFarm.owner}</div>
                        <div><span className="text-gray-400">Owner ID:</span> {selectedFarm.ownerId}</div>
                        <div><span className="text-gray-400">Phone:</span> {selectedFarm.phone}</div>
                        <div><span className="text-gray-400">Email:</span> {selectedFarm.email || "--"}</div>
                      </div>
                    </section>

                    {/* Farm Info */}
                    <section>
                      <h4 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                        <Leaf size={16}/> Farm Info
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-400">Address:</span> {selectedFarm.address}</div>
                        <div><span className="text-gray-400">District:</span> {selectedFarm.district}</div>
                        <div><span className="text-gray-400">Established:</span> 
                          {selectedFarm.dateEstablished
                            ? new Date(selectedFarm.dateEstablished).toDateString()
                            : "--"}
                        </div>
                        <div>
                          <span className="text-gray-400">Status:</span>{" "}
                          <span className={selectedFarm.status === "Active" ? "text-green-400" : "text-yellow-400"}>
                            {selectedFarm.status}
                          </span>
                        </div>
                      </div>
                    </section>

                    {/* Stats */}
                    <section>
                      <h4 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                        <BarChart3 size={16}/> Farm Stats
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                          <p className="text-gray-400 text-sm">Size</p>
                          <p className="text-xl font-bold">{selectedFarm.size || 0} acres</p>
                        </div>
                        <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                          <p className="text-gray-400 text-sm">Hives</p>
                          <p className="text-xl font-bold">{selectedFarm.numHives || 0}</p>
                        </div>
                        <div className="bg-[#2A2A2A] rounded-lg p-4 text-center">
                          <p className="text-gray-400 text-sm">Expected Yield</p>
                          <p className="text-xl font-bold">{selectedFarm.expectedAnnualYield || 0} kg</p>
                        </div>
                      </div>
                    </section>

                    {/* Hive Types & Flora */}
                    <section>
                      <h4 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                        <Hexagon size={16}/> Hive & Flora
                      </h4>
                      <p><span className="text-gray-400">Hive Types:</span> {selectedFarm.hiveTypes?.join(", ") || "--"}</p>
                      <p><span className="text-gray-400">Flora:</span> {selectedFarm.flora || "--"}</p>
                    </section>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end border-t border-gray-700 px-6 py-4 bg-[#161616] rounded-b-xl">
                    <button
                      onClick={() => setSelectedFarm(null)}
                      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded text-white font-medium"
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

            {/* Hive stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-400">Total Hives</p>
                <p className="text-xl font-bold">{hiveStats.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Productive</p>
                <p className="text-xl font-bold text-green-400">{hiveStats.productive}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Low Productive</p>
                <p className="text-xl font-bold text-red-400">{hiveStats.lowProductive}</p>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Productive", value: hiveStats.productive },
                      { name: "Low Productive", value: hiveStats.lowProductive },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid #333",
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#ccc" }} verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ✅ Hives grouped by farm name */}
            <h3 className="text-lg font-semibold mt-8 mb-4">All Hives (Grouped by Farm)</h3>

            {Object.entries(
              hives.reduce((acc, hive) => {
                const farmId = hive.farmId || "Unknown Farm";
                if (!acc[farmId]) acc[farmId] = [];
                acc[farmId].push(hive);
                return acc;
              }, {})
            ).map(([farmId, hiveList]) => {
              // Find farm name from farms list
              const farm = farms.find((f) => f.farmId === farmId);
              const farmName = farm ? farm.farmName : farmId;

              return (
                <div key={farmId} className="mb-8">
                  <h4 className="text-[#FBB01A] text-base font-semibold mb-2 flex items-center gap-2">
                    <Building size={16} /> {farmName}
                    <span className="text-gray-400 text-sm ml-2">
                      ({hiveList.length} hives)
                    </span>
                  </h4>

                  <table className="w-full text-sm border-collapse mb-4">
                    <thead className="bg-[#2A2A2A] text-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left">Hive ID</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hiveList.map((hive) => (
                        <tr
                          key={hive._id}
                          className="border-b border-gray-700 hover:bg-[#252525]"
                        >
                          <td className="px-4 py-2 text-left font-medium">{hive.hiveId}</td>
                          <td className="px-4 py-2 text-left">{hive.hiveName}</td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                hive.status === "Active"
                                  ? "bg-green-900/30 text-green-400"
                                  : hive.status === "Needs Attention"
                                  ? "bg-red-900/30 text-red-400"
                                  : "bg-yellow-900/30 text-yellow-400"
                              }`}
                            >
                              {hive.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}

            {/* If no hives */}
            {hives.length === 0 && (
              <p className="text-center py-4 text-gray-400">No hives found</p>
            )}

            {/* Hive Alerts */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Hive Alerts</h3>
            <ul className="space-y-2 text-sm">
              {hiveAlerts.overdueInspections.map((h) => (
                <li key={h._id} className="text-yellow-400">
                  Hive {h.hiveId} → Inspection overdue
                </li>
              ))}
              {hiveAlerts.lowProductive.map((h) => (
                <li key={h._id} className="text-red-400">
                  Hive {h.hiveId} → Low productivity
                </li>
              ))}
              {hiveAlerts.overdueInspections.length === 0 &&
                hiveAlerts.lowProductive.length === 0 && (
                  <li className="text-gray-400">No alerts at the moment</li>
                )}
            </ul>
          </div>
        )}

            

        {/* 🔹 Analytics Tab */}
         {activeTab === "analytics" && (
          <div className="mt-4">
            <HarvestAnalytics />
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
