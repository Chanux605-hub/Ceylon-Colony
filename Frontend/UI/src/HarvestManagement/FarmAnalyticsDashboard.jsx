import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { Hexagon, Leaf, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FarmAnalyticsDashboard({ ownerId }) {
  const [farmAnalytics, setFarmAnalytics] = useState(null);
  const [hiveAnalytics, setHiveAnalytics] = useState(null);

  // Separate year/month for farm & hive
  const [farmYear, setFarmYear] = useState(new Date().getFullYear());
  const [farmMonth, setFarmMonth] = useState(new Date().getMonth() + 1);

  const [hiveYear, setHiveYear] = useState(new Date().getFullYear());
  const [hiveMonth, setHiveMonth] = useState(new Date().getMonth() + 1);

  const [selectedFarm, setSelectedFarm] = useState("");

  // ✅ Fetch farm analytics
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/farm-analytics/${ownerId}`, {
        params: { year: farmYear, month: farmMonth },
      })
      .then((res) => setFarmAnalytics(res.data))
      .catch((err) => console.error("Error fetching farm analytics:", err));
  }, [ownerId, farmYear, farmMonth]);

  // ✅ Fetch hive analytics
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/farm-analytics/${ownerId}`, {
        params: { year: hiveYear, month: hiveMonth },
      })
      .then((res) => setHiveAnalytics(res.data))
      .catch((err) => console.error("Error fetching hive analytics:", err));
  }, [ownerId, hiveYear, hiveMonth]);

  if (!farmAnalytics || !hiveAnalytics)
    return <p style={{ color: "#9ca3af" }}>Loading analytics...</p>;

  // ✅ number formatter
  const formatNum = (num) =>
    typeof num === "number" ? num.toFixed(2) : "0.00";

  // ✅ readable month name
  const getMonthName = (month) =>
    new Date(2000, month - 1).toLocaleString("default", { month: "long" });

  // ✅ filtered farm-level data
  const filteredFarms = farmAnalytics.farms;

  // ✅ filtered hive-level data
  const filteredHives = selectedFarm
    ? hiveAnalytics.hives.filter((h) => h.farmId === selectedFarm)
    : [];

  // 🎨 Pie slice colors
  const COLORS = [
    "#FBB01A",
    "#10B981",
    "#3B82F6",
    "#EF4444",
    "#8B5CF6",
    "#F59E0B",
  ];

  // 📌 Farm PDF
  const handleFarmPDF = () => {
    if (filteredFarms.length === 0) {
      alert("No farm records available for this month.");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFontSize(18);
    pdf.setTextColor(251, 176, 26);
    pdf.text("Ceylon Colony - Farm Productivity Report", 10, 15);

    pdf.setFontSize(11);
    pdf.setTextColor(80);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 22);
    pdf.text(`For: ${getMonthName(farmMonth)} ${farmYear}`, 150, 22);

    autoTable(pdf, {
      startY: 30,
      head: [["Farm", "Total Harvest (kg)"]],
      body: filteredFarms.map((farm) => [
        farm.farmName,
        formatNum(farm.totalHarvest),
      ]),
      theme: "grid",
      headStyles: { fillColor: [251, 176, 26] },
    });

    pdf.save(`Farm_Report_${farmYear}_${farmMonth}.pdf`);
  };

  // 📌 Hive PDF
  const handleHivePDF = () => {
    if (!selectedFarm || filteredHives.length === 0) {
      alert("No hive records available for this farm in this month.");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFontSize(18);
    pdf.setTextColor(251, 176, 26);
    pdf.text("Ceylon Colony - Hive Productivity Report", 10, 15);

    pdf.setFontSize(11);
    pdf.setTextColor(80);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 22);
    pdf.text(`For: ${getMonthName(hiveMonth)} ${hiveYear}`, 150, 22);

    const farmName =
      farmAnalytics.farms.find((f) => f.farmId === selectedFarm)?.farmName ||
      selectedFarm;

    autoTable(pdf, {
      startY: 30,
      head: [["Hive", "Harvest (kg)"]],
      body: filteredHives.map((hive) => [
        hive.hiveName,
        formatNum(hive.harvest),
      ]),
      theme: "grid",
      headStyles: { fillColor: [251, 176, 26] },
    });

    pdf.save(`Hive_Report_${farmName}_${hiveYear}_${hiveMonth}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Farm Productivity Section */}
      <div className="bg-[#0B0B0B] p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold text-[#FBB01A] flex items-center gap-2">
          <Leaf /> Farm Productivity
        </h2>
        <div className="flex gap-3 items-center justify-end">
          <select value={farmYear} onChange={(e) => setFarmYear(e.target.value)}
            className="bg-[#0B0B0B] border border-gray-600 text-white rounded-lg px-3 py-2">
            {[2025, 2024, 2023].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={farmMonth} onChange={(e) => setFarmMonth(e.target.value)}
            className="bg-[#0B0B0B] border border-gray-600 text-white rounded-lg px-3 py-2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) =>
              <option key={m} value={m}>{getMonthName(m)}</option>
            )}
          </select>
          <button onClick={handleFarmPDF}
            className="flex items-center gap-2 bg-[#FBB01A] text-black px-4 py-2 rounded-lg shadow hover:bg-yellow-500">
            <FileDown /> Farm Report (PDF)
          </button>
        </div>

        {filteredFarms.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredFarms}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="farmName" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip formatter={(val) => formatNum(val)} />
              <Legend />
              <Bar dataKey="totalHarvest" fill="#FBB01A" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 py-10">
            🚫 No farm records found for {getMonthName(farmMonth)} {farmYear}
          </p>
        )}
      </div>

      {/* Hive Productivity Section */}
      <div className="bg-[#0B0B0B] p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold text-[#FBB01A] flex items-center gap-2">
          <Hexagon /> Hive Productivity
        </h2>
        <div className="flex gap-3 items-center">
          <select value={selectedFarm} onChange={(e) => setSelectedFarm(e.target.value)}
            className="bg-[#0B0B0B] border border-gray-600 text-white rounded-lg px-3 py-2">
            <option value="">-- Choose Farm --</option>
            {farmAnalytics.farms.map((farm) => (
              <option key={farm.farmId} value={farm.farmId}>
                {farm.farmName}
              </option>
            ))}
          </select>
          <select value={hiveYear} onChange={(e) => setHiveYear(e.target.value)}
            className="bg-[#0B0B0B] border border-gray-600 text-white rounded-lg px-3 py-2">
            {[2025, 2024, 2023].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={hiveMonth} onChange={(e) => setHiveMonth(e.target.value)}
            className="bg-[#0B0B0B] border border-gray-600 text-white rounded-lg px-3 py-2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) =>
              <option key={m} value={m}>{getMonthName(m)}</option>
            )}
          </select>
          {selectedFarm && filteredHives.length > 0 && (
            <button onClick={handleHivePDF}
              className="flex items-center gap-2 bg-[#3B82F6] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
              <FileDown /> Hive Report (PDF)
            </button>
          )}
        </div>

        {selectedFarm ? (
          filteredHives.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredHives}
                  dataKey="harvest"
                  nameKey="hiveName"
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={120}
                  label={({ name, value }) => `${name}: ${formatNum(value)}kg`}>
                  {filteredHives.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `${formatNum(val)} kg`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-10">
              🚫 No hive records found for {getMonthName(hiveMonth)} {hiveYear}
            </p>
          )
        ) : (
          <p className="text-center text-gray-400 py-10">ℹ️ Please select a farm</p>
        )}
      </div>
    </div>
  );
}
