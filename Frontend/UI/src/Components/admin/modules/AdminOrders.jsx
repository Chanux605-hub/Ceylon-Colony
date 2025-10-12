import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order =>
        order.userId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orderdetails/all");
      setOrders(response.data.data);
      setFilteredOrders(response.data.data); // Initialize filtered orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/orderdetails/update/${orderId}`, {
        status: newStatus,
      });
      // update UI instantly
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      // also update filtered orders
      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">All Orders</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {searchQuery && (
          <p className="text-white/60 text-sm mt-2">
            {filteredOrders.length} order(s) found for "{searchQuery}"
          </p>
        )}
      </div>
      
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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-white/70 py-4">
                  {searchQuery ? `No orders found for "${searchQuery}"` : "No orders found"}
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td className="py-2 pr-4">{order._id}</td>
                  <td className="py-2 pr-4 text-white/80">{order.userId}</td>
                  <td className="py-2 pr-4">
                    {order.items.map(item => `${item.name} x ${item.quantity}`).join(", ")}
                  </td>
                  <td className="py-2 pr-4 text-[#F28C28] font-semibold">Rs {order.amount}</td>
                  <td className="py-2 pr-4">
  <select
    value={order.status}
    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
    className={`px-3 py-1 rounded-md text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 
      ${
        order.status === "Delivered"
          ? "bg-green-600 text-white border-green-700 hover:bg-green-700 focus:ring-green-400"
          : order.status === "Out for Delivery"
          ? "bg-yellow-500 text-black border-yellow-600 hover:bg-yellow-600 focus:ring-yellow-400"
          : "bg-orange-500 text-white border-orange-600 hover:bg-orange-600 focus:ring-orange-400"
      }`}
  >
    <option value="Processing">Processing</option>
    <option value="Out for Delivery">Out for Delivery</option>
    <option value="Delivered">Delivered</option>
  </select>
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
