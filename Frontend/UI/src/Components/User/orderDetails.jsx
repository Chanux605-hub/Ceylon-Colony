import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const API = "http://localhost:3000/api/orderdetails"; // matches Backend/routes/orderDetailsRouter.js

function formatCurrency(amount) {
  const num = Number(amount || 0);
  return `Rs ${num.toFixed(2)}`;
}

function StatusPill({ status }) {
  const label = (status || "placed").toString();
  const color = label === "delivered" ? "bg-green-500" : label === "cancelled" ? "bg-red-500" : "bg-orange-400";
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`}></span>
      <span className="text-sm text-gray-300 capitalize">{label}</span>
    </div>
  );
}

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const requestedUserId = user?._id || user?.email;
      if (!requestedUserId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${API}/myorders`,
          { userId: requestedUserId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.success) {
          setOrders(res.data.data || []);
        } else {
          setError(res.data?.message || "Failed to load orders");
        }
      } catch (e) {
        setError(e.message || "Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?._id]);

  if (loading) return <div className="text-white">Loading orders...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold text-white">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            const itemCount = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
            const summary = items
              .map((it) => `${it.name} x ${it.quantity}`)
              .join(", ");
            return (
              <div
                key={order._id}
                className="rounded-lg border border-[#FBB01A]/30 bg-neutral-950/60 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 p-4">
                  {/* package icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-[#FBB01A]/20">
                    <span className="text-2xl">📦</span>
                  </div>

                  {/* summary text */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-gray-200">{summary || "No items"}</p>
                  </div>

                  {/* total */}
                  <div className="w-32 text-right text-gray-200">
                    {formatCurrency(order.amount)}
                  </div>

                  {/* item count */}
                  <div className="w-28 text-right text-gray-300">Items: {itemCount}</div>

                  {/* status */}
                  <div className="w-32 flex justify-end">
                    <StatusPill status={order.status} />
                  </div>

                  {/* track button */}
                  <div className="w-36 flex justify-end">
                    <button
                      onClick={async () => {
                        try {
                          const res = await axios.get(`${API}/${order._id}`);
                          const latest = res.data?.data;
                          if (latest) {
                            // update just this order's status in UI
                            setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status: latest.status } : o)));
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="px-4 py-2 rounded-md bg-rose-200/40 text-rose-100 hover:bg-rose-200/60 transition"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

