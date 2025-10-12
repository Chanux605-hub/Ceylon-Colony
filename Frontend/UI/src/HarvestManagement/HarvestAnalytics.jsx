import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function HarvestAnalytics() {
  // ============================= STATES =============================
  const [harvestByMonth, setHarvestByMonth] = useState([]);
  const [harvestByFarm, setHarvestByFarm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chart-1 filters
  const [selectedYearMonth, setSelectedYearMonth] = useState("All");

  // Chart-2 filters
  const [selectedYearFarm, setSelectedYearFarm] = useState("All");
  const [selectedMonthFarm, setSelectedMonthFarm] = useState("All");

  const years = ["All", "2022", "2023", "2024", "2025", "2026"];
  const months = [
    "All",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const monthNames = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  // ============================= API CALLS =============================
  const fetchByMonthData = async (year = "") => {
    setLoading(true);
    try {
      const yearQuery = year && year !== "All" ? `?year=${year}` : "";
      const res = await axios.get(
        `http://localhost:3000/api/harvests/by-month${yearQuery}`
      );
      if (res.data.success) setHarvestByMonth(res.data.data);
    } catch (err) {
      console.error("Error loading month analytics:", err);
      setError("Failed to load monthly analytics data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchByFarmData = async (year = "", month = "") => {
    setLoading(true);
    try {
      const queryParams =
        year && month && month !== "All"
          ? `?year=${year}&month=${month}`
          : year && year !== "All"
          ? `?year=${year}`
          : "";
      const res = await axios.get(
        `http://localhost:3000/api/harvests/by-farm-advanced${queryParams}`
      );
      if (res.data.success) setHarvestByFarm(res.data.data);
    } catch (err) {
      console.error("Error loading farm analytics:", err);
      setError("Failed to load farm analytics data.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load (overall)
  useEffect(() => {
    fetchByMonthData();
    fetchByFarmData();
  }, []);

  // ============================= HANDLERS =============================
  const handleMonthYearChange = (e) => {
    const year = e.target.value;
    setSelectedYearMonth(year);
    fetchByMonthData(year);
  };

  // ✅ Only change year here — no fetch until month is chosen
  const handleFarmYearChange = (e) => {
    const year = e.target.value;
    setSelectedYearFarm(year);
  };

  // ✅ Fetch only after month selection (using selected year)
  const handleFarmMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonthFarm(month);
    if (selectedYearFarm !== "All" || month !== "All") {
      fetchByFarmData(selectedYearFarm, month);
    }
  };

  // ============================= REPORTS =============================
  const generateMonthReport = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // 🌟 Header section
    doc.setFillColor(251, 176, 26);
    doc.roundedRect(0, 0, 210, 25, 0, 0, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Ceylon Colony - Harvest by Month Report", 14, 17);

    // 🟢 Subheader
    const subtitle =
      selectedYearMonth === "All" ? "Overall Data" : `Year ${selectedYearMonth}`;
    doc.setFontSize(13);
    doc.setTextColor(60);
    doc.text(subtitle, 14, 35);

    // 🟡 Decorative line
    doc.setDrawColor(251, 176, 26);
    doc.setLineWidth(0.8);
    doc.line(14, 38, 196, 38);

    // 📊 Table
    const monthTable = harvestByMonth.map((d, i) => [
      i + 1,
      d.month,
      `${d.total.toFixed(2)} kg`,
    ]);

    autoTable(doc, {
      startY: 44,
      head: [["#", "Month", "Total Harvest (kg)"]],
      body: monthTable.length ? monthTable : [["-", "No Data", "-"]],
      theme: "striped",
      headStyles: {
        fillColor: [251, 176, 26],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      bodyStyles: { fillColor: [245, 245, 245], textColor: [33, 33, 33] },
      alternateRowStyles: { fillColor: [230, 230, 230] },
      styles: { halign: "center", fontSize: 11, lineWidth: 0.1 },
    });

    // 🧮 Summary
    const total = harvestByMonth.reduce((sum, d) => sum + d.total, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(251, 176, 26);
    doc.text(
      `Total Harvest: ${total.toFixed(2)} kg`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    // 🕒 Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `Generated on ${new Date().toLocaleString()} | © Ceylon Colony Analytics`,
      14,
      290
    );

    doc.save(
      `Harvest_By_Month_Report_${
        selectedYearMonth === "All" ? "Overall" : selectedYearMonth
      }.pdf`
    );
  };

  const generateFarmReport = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // 🌟 Header
    doc.setFillColor(251, 176, 26);
    doc.roundedRect(0, 0, 210, 25, 0, 0, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Ceylon Colony - Harvest by Farm Report", 14, 17);

    // 🟢 Subheader
    let titleText = "";
    if (selectedYearFarm === "All") titleText = "Overall Data";
    else if (selectedMonthFarm === "All")
      titleText = `Year ${selectedYearFarm}`;
    else titleText = `${monthNames[selectedMonthFarm]} ${selectedYearFarm}`;
    doc.setFontSize(13);
    doc.setTextColor(60);
    doc.text(titleText, 14, 35);
    doc.setDrawColor(251, 176, 26);
    doc.setLineWidth(0.8);
    doc.line(14, 38, 196, 38);

    // 📊 Table
    const farmTable = harvestByFarm.map((d, i) => [
      i + 1,
      d._id,
      `${d.total.toFixed(2)} kg`,
    ]);

    autoTable(doc, {
      startY: 44,
      head: [["#", "Farm ID", "Total Harvest (kg)"]],
      body: farmTable.length ? farmTable : [["-", "No Data", "-"]],
      theme: "striped",
      headStyles: {
        fillColor: [251, 176, 26],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      bodyStyles: { fillColor: [245, 245, 245], textColor: [33, 33, 33] },
      alternateRowStyles: { fillColor: [230, 230, 230] },
      styles: { halign: "center", fontSize: 11, lineWidth: 0.1 },
    });

    // 🧮 Summary
    const total = harvestByFarm.reduce((sum, d) => sum + d.total, 0);
    const topFarm = harvestByFarm[0]?._id || "N/A";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(251, 176, 26);
    doc.text(`Total Harvest: ${total.toFixed(2)} kg`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Top Performing Farm: ${topFarm}`, 14, doc.lastAutoTable.finalY + 18);

    // 🕒 Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `Generated on ${new Date().toLocaleString()} | © Ceylon Colony Analytics`,
      14,
      290
    );

    const fileName =
      selectedYearFarm === "All"
        ? "Harvest_By_Farm_Overall.pdf"
        : selectedMonthFarm === "All"
        ? `Harvest_By_Farm_${selectedYearFarm}.pdf`
        : `Harvest_By_Farm_${monthNames[selectedMonthFarm]}_${selectedYearFarm}.pdf`;
    doc.save(fileName);
  };

  // ============================= RENDER =============================
  if (loading)
    return <p className="text-center text-gray-400 py-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-400 py-10">{error}</p>;

  return (
    <div>
      {/* ========== HARVEST BY MONTH ========== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-lg font-semibold">
          Harvest by Month{" "}
          <span className="text-gray-400 text-sm ml-2">
            ({selectedYearMonth === "All"
              ? "Overall"
              : `Year ${selectedYearMonth}`})
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-300">Year:</label>
          <select
            value={selectedYearMonth}
            onChange={handleMonthYearChange}
            className="bg-[#1f1f1f] text-white border border-gray-600 rounded px-3 py-1"
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#2A2A2A] p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-lg">Harvest by Month</p>
          <button
            onClick={generateMonthReport}
            className="bg-[#FBB01A] text-black flex items-center gap-2 px-4 py-2 rounded hover:bg-yellow-500"
          >
            <Download size={16} /> Download Report
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={harvestByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#FBB01A" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ========== HARVEST BY FARM ========== */}
      <div className="bg-[#2A2A2A] p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:justify-between mb-3 gap-4">
          <p className="font-semibold text-lg">
            {selectedYearFarm === "All"
              ? "Harvest by Farm (Overall)"
              : selectedMonthFarm === "All"
              ? `Select month for Year ${selectedYearFarm}`
              : `Harvest by Farm for ${
                  monthNames[selectedMonthFarm]
                } ${selectedYearFarm}`}
          </p>

          <div className="flex gap-3">
            <div>
              <label className="text-sm text-gray-300 mr-1">Year:</label>
              <select
                value={selectedYearFarm}
                onChange={handleFarmYearChange}
                className="bg-[#1f1f1f] text-white border border-gray-600 rounded px-3 py-1"
              >
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mr-1">Month:</label>
              <select
                value={selectedMonthFarm}
                onChange={handleFarmMonthChange}
                className="bg-[#1f1f1f] text-white border border-gray-600 rounded px-3 py-1"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m === "All" ? "All" : monthNames[m]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateFarmReport}
              className="bg-[#FBB01A] text-black flex items-center gap-2 px-4 py-2 rounded hover:bg-yellow-500"
            >
              <Download size={16} /> Download Report
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={harvestByFarm}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="_id" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
