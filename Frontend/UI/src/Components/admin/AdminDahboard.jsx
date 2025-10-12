import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ShoppingCart, Users, Package, Triangle, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";

// tiny stat card
function Stat({ title, value, delta = "+0.0%", icon: Icon }) {
  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">{title}</div>
        <div className="h-9 w-9 grid place-items-center rounded-lg bg-white/5">
          <Icon size={18} className="text-[#FBB01A]" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/5 text-emerald-400">
        <Triangle size={10} className="fill-current rotate-0" />
        <span>{delta}</span>
        <span className="text-white/50"> vs last month</span>
      </div>
    </div>
  );
}

// simple inline bar chart
function BarChart({ data }) {
  const max = Math.max(...data);
  return (
    <svg viewBox="0 0 320 120" className="w-full h-32">
      {data.map((v, i) => {
        const h = (v / max) * 100;
        return (
          <rect
            key={i}
            x={i * 40 + 12}
            y={110 - h}
            width="24"
            height={h}
            rx="4"
            fill="#F28C28"
          />
        );
      })}
      {/* baseline */}
      <line x1="0" y1="110" x2="320" y2="110" stroke="rgba(255,255,255,0.1)" />
    </svg>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // "all", "today", "week", "month"
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: ""
  });

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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/orderdetails/update/${orderId}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Filter orders by date range
  const filterOrdersByDate = (ordersList) => {
    if (dateFilter === "all") return ordersList;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return ordersList.filter(order => {
      const orderDate = new Date(order.createdAt || order.updatedAt || new Date());
      const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
      
      switch (dateFilter) {
        case "today":
          return orderDateOnly.getTime() === today.getTime();
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDateOnly >= weekAgo;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDateOnly >= monthAgo;
        case "custom":
          if (!customDateRange.start || !customDateRange.end) return true;
          const startDate = new Date(customDateRange.start);
          const endDate = new Date(customDateRange.end);
          return orderDateOnly >= startDate && orderDateOnly <= endDate;
        default:
          return true;
      }
    });
  };

  // Filter orders by search and date
  const filteredOrders = useMemo(() => {
    const dateFiltered = filterOrdersByDate(orders);
    return dateFiltered.filter(order =>
      order.userId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, dateFilter, customDateRange, searchQuery]);

  // Calculate order statistics
  const calculateOrderStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const processingOrders = orders.filter(order => order.status === 'Processing').length;
    const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;
    const outForDeliveryOrders = orders.filter(order => order.status === 'Out for Delivery').length;
    
    return {
      totalOrders,
      totalRevenue,
      processingOrders,
      deliveredOrders,
      outForDeliveryOrders
    };
  };

  // Generate PDF report
  const generatePDFReport = () => {
    const ordersToReport = filteredOrders.length > 0 ? filteredOrders : orders;
    const stats = calculateOrderStats();
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    // Get date range info for report title
    const getDateRangeInfo = () => {
      switch (dateFilter) {
        case "today":
          return "Today's Orders";
        case "week":
          return "Last 7 Days Orders";
        case "month":
          return "Last 30 Days Orders";
        case "custom":
          return `Custom Range: ${customDateRange.start} to ${customDateRange.end}`;
        default:
          return "All Orders";
      }
    };

    // Set up colors
    const primaryColor = [242, 140, 40]; // Orange color
    const darkColor = [0, 0, 0];
    const lightGray = [128, 128, 128];

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Ceylon Colony - Orders Report', 20, 20);

    // Date and time
    doc.setTextColor(...lightGray);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${currentDate} at ${currentTime}`, 20, 35);
    
    // Report period
    doc.text(`Report Period: ${getDateRangeInfo()}`, 20, 42);

    // Summary section
    doc.setTextColor(...darkColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Summary', 20, 55);

    // Calculate stats for filtered orders
    const filteredStats = {
      totalOrders: ordersToReport.length,
      totalRevenue: ordersToReport.reduce((sum, order) => sum + (order.amount || 0), 0),
      processingOrders: ordersToReport.filter(order => order.status === 'Processing').length,
      deliveredOrders: ordersToReport.filter(order => order.status === 'Delivered').length,
      outForDeliveryOrders: ordersToReport.filter(order => order.status === 'Out for Delivery').length
    };

    // Statistics
    const statsData = [
      ['Total Orders', filteredStats.totalOrders.toString()],
      ['Total Revenue', `Rs ${filteredStats.totalRevenue.toLocaleString()}`],
      ['Processing Orders', filteredStats.processingOrders.toString()],
      ['Out for Delivery', filteredStats.outForDeliveryOrders.toString()],
      ['Delivered Orders', filteredStats.deliveredOrders.toString()]
    ];

    let yPosition = 65;
    statsData.forEach(([label, value]) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`${label}:`, 20, yPosition);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 80, yPosition);
      yPosition += 8;
    });

    // Orders table
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Details', 20, yPosition);

    // Table headers
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Order ID', 20, yPosition);
    doc.text('User ID', 60, yPosition);
    doc.text('Items', 100, yPosition);
    doc.text('Qty', 140, yPosition);
    doc.text('Amount', 160, yPosition);
    doc.text('Status', 190, yPosition);

    // Table data
    yPosition += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    ordersToReport.slice(0, 20).forEach((order, index) => { // Limit to first 20 orders
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const itemsText = order.items.map(item => item.name).join(', ');
      const truncatedItems = itemsText.length > 25 ? itemsText.substring(0, 25) + '...' : itemsText;
      const totalQuantity = order.items.reduce((total, item) => total + (item.quantity || 0), 0);
      
      doc.text(order._id.substring(0, 12) + '...', 20, yPosition);
      doc.text(order.userId || 'N/A', 60, yPosition);
      doc.text(truncatedItems, 100, yPosition);
      doc.text(totalQuantity.toString(), 140, yPosition);
      doc.text(`Rs ${order.amount}`, 160, yPosition);
      doc.text(order.status, 190, yPosition);
      yPosition += 6;
    });

    // Footer
    if (ordersToReport.length > 20) {
      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...lightGray);
      doc.text(`Showing first 20 orders out of ${ordersToReport.length} total orders`, 20, yPosition);
    }

    // Save the PDF
    doc.save(`Ceylon-Colony-Orders-Report-${currentDate.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
        <div className="text-lg font-semibold">Good to see you 👋</div>
        <p className="text-white/70 text-sm">
          Here’s a quick snapshot of sales and stock. Keep the jars flowing!
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Stat title="Total Orders" value="2,381" delta="+3.1%" icon={ShoppingCart} />
        <Stat title="Customers" value="420,081" delta="+3.3%" icon={Users} />
        <Stat
          title="Revenue"
          value="Rs 319,200"
          delta="+5.4%"
          icon={() => <span className="font-bold text-[#FBB01A]">₨</span>}
        />
        <Stat title="Products" value="138" delta="+1.2%" icon={Package} />
      </div>

      {/* Charts / panels */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-black/40 border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Sales Overview</div>
            <button className="text-xs text-white/70 hover:text-white">View details</button>
          </div>
          <div className="mt-4">
            <BarChart data={[22, 18, 21, 36, 24, 14, 20]} />
            <div className="mt-2 flex justify-between text-xs text-white/50">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
          <div className="font-semibold">Low Stock</div>
          <ul className="mt-3 space-y-3 text-sm">
            {[
              ["Multi-Floral 500g", 12],
              ["Wildflower 350g", 6],
              ["Cinnamon Infused", 9],
            ].map(([name, qty]) => (
              <li key={name} className="flex items-center justify-between">
                <span className="text-white/80">{name}</span>
                <span className="px-2 py-0.5 rounded bg-[#FBB01A] text-black font-semibold">
                  {qty}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* All Orders Table */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">All Orders</h2>
          <button
            onClick={generatePDFReport}
            className="flex items-center gap-2 px-4 py-2 bg-[#F28C28] hover:bg-[#E67E22] text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <FileText size={18} />
            Generate PDF Report
          </button>
        </div>

        {/* 🔍 Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
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

            {/* Date Filter */}
            <div className="flex gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateFilter === "custom" && (
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-white/70 text-sm">From:</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-1 bg-black/40 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-white/70 text-sm">To:</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-1 bg-black/40 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-white/60 text-sm">
            {searchQuery && (
              <span>{filteredOrders.length} order(s) found for "{searchQuery}"</span>
            )}
            {dateFilter !== "all" && (
              <span className={searchQuery ? " ml-2" : ""}>
                • {filteredOrders.length} order(s) in selected period
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto bg-black/40 border border-white/10 rounded p-4">
          <table className="min-w-full text-sm">
            <thead className="text-white/60">
              <tr className="text-left">
                <th className="py-2 pr-4">Order #</th>
                <th className="py-2 pr-4">User ID</th>
                <th className="py-2 pr-4">Items</th>
                <th className="py-2 pr-4">Quantity</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-white/70 py-4">
                    {searchQuery ? `No orders found for "${searchQuery}"` : "No orders found"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="py-2 pr-4">{order._id}</td>
                    <td className="py-2 pr-4 text-white/80">{order.userId}</td>
                    <td className="py-2 pr-4">
                      {order.items
                        .map((item) => item.name)
                        .join(", ")}
                    </td>
                    <td className="py-2 pr-4 text-center">
                      <span className="px-2 py-1 bg-[#F28C28]/20 text-[#F28C28] rounded-full text-xs font-medium">
                        {order.items.reduce((total, item) => total + (item.quantity || 0), 0)}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-[#F28C28] font-semibold">
                      Rs {order.amount}
                    </td>
                    <td className="py-2 pr-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
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
    </div>
  );
}
