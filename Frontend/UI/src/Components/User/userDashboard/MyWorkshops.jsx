// src/components/User/userDashboard/MyWorkshops.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { Loader2, X, Download } from "lucide-react";
import { jsPDF } from "jspdf";

export default function MyWorkshops() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        if (!user?.userId) return;
        const res = await axios.get(
          `http://localhost:3000/api/workshops/user/${user.userId}`
        );
        console.log("Fetched participants:", res.data.participants);
        setWorkshops(res.data.participants || []);
      } catch (err) {
        console.error("Error loading workshops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, [user]);

  // ✅ Cancel Booking
  const handleCancelBooking = async (participantId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.put(
        `http://localhost:3000/api/participants/${participantId}/cancel`
      );
      setWorkshops((prev) =>
        prev.map((item) =>
          item._id === participantId ? { ...item, status: "Cancelled" } : item
        )
      );
      alert("Booking cancelled successfully");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel booking");
    }
  };

  // ✅ Generate & Download Certificate
  const handleDownloadCertificate = (participant) => {
    const { workshopId: ws } = participant;
    if (!ws) return alert("Workshop data missing");

    const doc = new jsPDF();
    const certId = `CERT-${Date.now().toString().slice(-6)}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Certificate of Completion", 105, 40, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`This certifies that`, 105, 60, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.text(`${user.name}`, 105, 70, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.text(`has successfully completed the`, 105, 80, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.text(`${ws.title}`, 105, 90, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.text(
      `on ${new Date(ws.date).toLocaleDateString()}`,
      105,
      100,
      { align: "center" }
    );

    doc.text(`Certificate ID: ${certId}`, 20, 130);
    doc.text(`Instructor Signature: ___________________`, 20, 140);

    doc.save(`${user.name}_Certificate.pdf`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-neutral-300">
        <Loader2 className="animate-spin mr-2" /> Loading your workshops...
      </div>
    );

  if (!workshops.length)
    return (
      <p className="text-center text-neutral-400 mt-10">
        You haven’t booked any workshops yet.
      </p>
    );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-yellow-400 mb-4">
        🎓 My Booked Workshops
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((item) => {
          const w = item.workshopId || {};
          return (
            <div
              key={item._id}
              className="bg-neutral-800 p-4 rounded-xl shadow-md border border-neutral-700"
            >
              <h3 className="text-lg font-semibold text-yellow-300">
                {w?.title || "Untitled Workshop"}
              </h3>
              <p className="text-sm text-neutral-400 mt-1">
                📅 {w?.date ? new Date(w.date).toLocaleDateString() : "TBA"} | ⏰{" "}
                {w?.time || "TBA"}
              </p>
              <p className="text-sm text-neutral-400">📍 {w?.location || "N/A"}</p>

              <div className="mt-3 text-sm text-neutral-400">
                <p>
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      item.status === "Paid"
                        ? "text-green-400"
                        : item.status === "Cancelled"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </p>
                <p>Attendance: {item.attendance}</p>
              </div>

              <div className="mt-4 flex gap-2">
                {item.status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelBooking(item._id)}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                  >
                    <X size={16} /> Cancel Booking
                  </button>
                )}

                {item.attendance === "Present" && (
                  <button
                    onClick={() => handleDownloadCertificate(item)}
                    className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
                  >
                    <Download size={16} /> Download Certificate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
