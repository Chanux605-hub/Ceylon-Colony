import React from "react";
import { ShoppingCart, Users, Package, Triangle } from "lucide-react";

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
            className=""
            fill="#F28C28"
          />
        );
      })}
      {/* baseline */}
      <line x1="0" y1="110" x2="320" y2="110" stroke="rgba(255,255,255,0.1)" />
    </svg>
  );
}

export default function AdminDahboard() {
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
        <Stat title="Revenue" value="Rs 319,200" delta="+5.4%" icon={() => <span className="font-bold text-[#FBB01A]">₨</span>} />
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
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <span key={d}>{d}</span>)}
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
                <span className="px-2 py-0.5 rounded bg-[#FBB01A] text-black font-semibold">{qty}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

<div className="mt-4">
  <button
    onClick={() => window.location.href = '/allorders'}
    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded"
  >
    Orders
  </button>
</div>

      {/* Recent orders */}
      <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
        <div className="font-semibold mb-3">Recent Orders</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-white/60">
              <tr className="text-left">
                <th className="py-2 pr-4">Order #</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Items</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                ["#10234","Sandun Perera","3","Rs 4,350","Paid"],
                ["#10233","Ishara Silva","2","Rs 2,050","Pending"],
                ["#10232","Malsha Jay","1","Rs 1,450","Paid"],
              ].map(([id, name, items, total, status]) => (
                <tr key={id}>
                  <td className="py-2 pr-4">{id}</td>
                  <td className="py-2 pr-4 text-white/80">{name}</td>
                  <td className="py-2 pr-4">{items}</td>
                  <td className="py-2 pr-4 text-[#F28C28] font-semibold">{total}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      status === "Paid" ? "bg-emerald-500/20 text-emerald-300" : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
