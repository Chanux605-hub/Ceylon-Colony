import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function FarmerNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selected, setSelected] = useState([]);

  // ✅ Load notifications + unread count
  const loadNotifications = async () => {
    if (!user?.userId) return;
    try {
      const [notifRes, unreadRes] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/notifications/farmer/${user.userId}`
        ),
        axios.get(
          `http://localhost:3000/api/notifications/farmer/${user.userId}/unread-count`
        ),
      ]);

      const withReadFlag = notifRes.data.notifications.map((n) => ({
        ...n,
        isRead: n.isRead ?? false,
      }));

      setNotifications(withReadFlag);
      setUnreadCount(unreadRes.data.count || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  // ✅ Toggle checkbox selection
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ Mark selected as read/unread
  const markSelected = async (isRead) => {
    try {
      await Promise.all(
        selected.map((id) =>
          axios.patch(`http://localhost:3000/api/notifications/${id}/read`, {
            isRead,
          })
        )
      );
      setNotifications((prev) =>
        prev.map((n) =>
          selected.includes(n._id) ? { ...n, isRead } : n
        )
      );
      setSelected([]);
      setUnreadCount((prev) =>
        isRead ? 0 : prev + selected.length
      );
    } catch (err) {
      console.error("Error marking selected:", err);
    }
  };

  // ✅ Delete selected
  const deleteSelected = async () => {
    try {
      await Promise.all(
        selected.map((id) =>
          axios.delete(`http://localhost:3000/api/notifications/${id}`)
        )
      );
      setNotifications((prev) =>
        prev.filter((n) => !selected.includes(n._id))
      );
      setSelected([]);
      setUnreadCount(
        (prev) =>
          prev -
          selected.filter(
            (id) =>
              !notifications.find((n) => n._id === id)?.isRead
          ).length
      );
    } catch (err) {
      console.error("Error deleting notifications:", err);
    }
  };

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
      if (unreadIds.length === 0) return;
      await Promise.all(
        unreadIds.map((id) =>
          axios.patch(`http://localhost:3000/api/notifications/${id}/read`, {
            isRead: true,
          })
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // ✅ Show loading
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading notifications...
      </div>
    );

  const alerts = notifications.filter((n) => n.type === "Alert");
  const reminders = notifications.filter((n) => n.type === "Reminder");

  const renderList = (list, color) =>
    list.length === 0 ? (
      <p className="text-gray-400 text-sm">No {color} notifications.</p>
    ) : (
      list.map((n) => (
        <div
          key={n._id}
          className={`p-4 mb-3 rounded-lg border flex justify-between items-start transition-all duration-300 ${
            n.isRead
              ? "bg-[#111111] border-gray-700 opacity-70"
              : color === "alert"
              ? "bg-[#2B0000] border-[#F87171] hover:bg-[#400000]"
              : "bg-[#2E2A00] border-[#FBB01A] hover:bg-[#403700]"
          }`}
        >
          <div className="flex gap-3">
            <input
              type="checkbox"
              checked={selected.includes(n._id)}
              onChange={() => toggleSelect(n._id)}
              className="mt-1 accent-[#FBB01A]"
            />
            <div>
              <h4
                className={`font-semibold ${
                  color === "alert"
                    ? "text-[#F87171]"
                    : "text-[#FBB01A]"
                }`}
              >
                {n.title}
              </h4>
              <p
                className="text-sm text-gray-300"
                dangerouslySetInnerHTML={{ __html: n.message }}
              />
              <p className="text-xs text-gray-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          {color === "alert" ? (
            <AlertTriangle className="w-5 h-5 text-[#F87171]" />
          ) : (
            <Clock className="w-5 h-5 text-[#FBB01A]" />
          )}
        </div>
      ))
    );

  return (
    <div className="bg-[#0B0B0B] min-h-screen text-white p-6">
      <div className="max-w-5xl mx-auto bg-[#1A1A1A] rounded-xl p-6 shadow-lg border border-[#2a2a2a]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#FBB01A]" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-sm bg-red-600 text-white rounded-full px-3 py-1">
                {unreadCount} Unread
              </span>
            )}
          </h2>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                unreadCount === 0
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-[#10B981] hover:bg-[#059669] text-white"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> Mark All as Read
            </button>
            {selected.length > 0 && (
              <>
                <button
                  onClick={() => markSelected(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => markSelected(false)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                >
                  Mark Unread
                </button>
                <button
                  onClick={deleteSelected}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* ALERTS */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#F87171]">
            <AlertTriangle className="w-5 h-5" /> Alerts
          </h3>
          {renderList(alerts, "alert")}
        </section>

        {/* REMINDERS */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#FBB01A]">
            <Clock className="w-5 h-5" /> Reminders
          </h3>
          {renderList(reminders, "reminder")}
        </section>
      </div>
    </div>
  );
}
