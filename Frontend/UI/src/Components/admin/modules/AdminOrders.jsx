import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orderdetails/all");
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">All Orders</h2>
      
      <div className="overflow-x-auto bg-black/40 border border-white/10 rounded p-4">
        <table className="min-w-full text-sm">
          <thead className="text-white/60">
            <tr className="text-left">
              <th className="py-2 pr-4">Order #</th>
              <th className="py-2 pr-4">User ID</th>
              <th className="py-2 pr-4">Items</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-white/70 py-4">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}>
                  <td className="py-2 pr-4">{order._id}</td>
                  <td className="py-2 pr-4 text-white/80">{order.userId}</td>
                  <td className="py-2 pr-4">
                    {order.items.map(item => `${item.name} x ${item.quantity}`).join(", ")}
                  </td>
                  <td className="py-2 pr-4 text-[#F28C28] font-semibold">Rs {order.amount}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      order.status === "Paid"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
