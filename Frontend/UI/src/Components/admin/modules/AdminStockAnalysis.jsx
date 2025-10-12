import React, { useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ComposedChart, Line, ReferenceLine
} from "recharts";

// ====== MOCK DATA (hardcoded) ======

// Inventory value over time (Rs)
const VALUE_SERIES = [
  { date: "Aug 01", value: 320000 },
  { date: "Aug 05", value: 345000 },
  { date: "Aug 10", value: 355000 },
  { date: "Aug 15", value: 330000 },
  { date: "Aug 20", value: 368000 },
  { date: "Aug 25", value: 372000 },
  { date: "Aug 30", value: 365000 },
];

// Stock movements (units) per day
const MOVEMENTS = [
  { date: "Aug 01", IN: 120, OUT: 80 },
  { date: "Aug 05", IN: 90,  OUT: 110 },
  { date: "Aug 10", IN: 140, OUT: 100 },
  { date: "Aug 15", IN: 70,  OUT: 130 },
  { date: "Aug 20", IN: 160, OUT: 120 },
  { date: "Aug 25", IN: 110, OUT: 90 },
  { date: "Aug 30", IN: 95,  OUT: 105 },
];

// ABC / Pareto: top items by revenue
const ABC = [
  { sku: "WF-500", name: "Wildflower 500g", revenue: 180000 },
  { sku: "MF-350", name: "Multi‑Floral 350g", revenue: 120000 },
  { sku: "CIN-350", name: "Cinnamon 350g", revenue: 90000 },
  { sku: "SER-50", name: "Honey Serum 50ml", revenue: 70000 },
  { sku: "SCR-30", name: "Lip Scrub 30g", revenue: 45000 },
  { sku: "GIF-TS", name: "Taster Gift Set", revenue: 30000 },
  { sku: "FR-500", name: "Forest 500g", revenue: 28000 },
];

// Aging buckets (units)
const AGING = [
  { category: "Raw Honey", b0_30: 140, b31_60: 85, b61_90: 45, b90p: 18 },
  { category: "Infused",   b0_30: 90,  b31_60: 60, b61_90: 25, b90p: 10 },
  { category: "Skincare",  b0_30: 55,  b31_60: 30, b61_90: 12, b90p: 6  },
  { category: "Gifts",     b0_30: 35,  b31_60: 15, b61_90: 8,  b90p: 4  },
];

// Top & Bottom movers (units sold)
const TOP_MOVERS = [
  { name: "Wildflower 500g", units: 260 },
  { name: "Cinnamon 350g", units: 210 },
  { name: "Multi‑Floral 350g", units: 190 },
  { name: "Serum 50ml", units: 160 },
];
const BOTTOM_MOVERS = [
  { name: "Lip Scrub 30g", units: 22 },
  { name: "Gift Set", units: 28 },
  { name: "Forest 500g", units: 35 },
];

// Reorder risk table (sample)
const REORDER_RISK = [
  { sku: "MF-350", name: "Multi‑Floral 350g", onHand: 24, rop: 30, lead: 7, supplier: "BeeCo" },
  { sku: "CIN-350", name: "Cinnamon 350g", onHand: 12, rop: 25, lead: 5, supplier: "HiveWorks" },
  { sku: "SER-50",  name: "Honey Serum 50ml", onHand: 8, rop: 20, lead: 10, supplier: "Glow Naturals" },
];

// KPI snapshots
const KPI = {
  onHandUnits: 1260,
  onHandValue: 365000,
  stockoutRate: "3.4%",
  doi: 27, // days of inventory
  deadItems: 4,
};

const Rs = (n) => `Rs ${n.toLocaleString()}`;

export default function AdminStockAnalysis() {
  // simple filter shells (visual only for now)
  const [range, setRange] = useState("Last 30 days");
  const [group, setGroup] = useState("day");
  const [category, setCategory] = useState("All");

  const abcWithCum = useMemo(() => {
    const total = ABC.reduce((s, r) => s + r.revenue, 0);
    let cum = 0;
    return ABC.map((row) => {
      cum += row.revenue;
      return {
        ...row,
        share: +(row.revenue / total * 100).toFixed(1),
        cumPct: +(cum / total * 100).toFixed(1),
      };
    });
  }, []);

  const handleExport = () => {
    // keep it simple for the mock: just print the page section
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white px-6 sm:px-8 py-8">
      {/* Header / Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Stock Analysis</h1>
          <p className="text-white/60">Analytics & insights for inventory performance</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select value={range} onChange={(e) => setRange(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2">
            {["Today", "Last 7 days", "Last 30 days", "This month", "Custom"].map((r) =>
              <option className="bg-[#0B0B0B]" key={r}>{r}</option>
            )}
          </select>
          <select value={group} onChange={(e) => setGroup(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2">
            {["day", "week", "month"].map((g) =>
              <option className="bg-[#0B0B0B]" key={g}>{g}</option>
            )}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl px-3 py-2">
            {["All", "Raw Honey", "Infused", "Skincare", "Gift Sets"].map((c) =>
              <option className="bg-[#0B0B0B]" key={c}>{c}</option>
            )}
          </select>

          <button onClick={handleExport}
                  className="rounded-xl bg-[#FBB01A] text-black font-semibold px-4 py-2 shadow-neon hover:brightness-95">
            Export PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <KpiCard label="Stock on hand (units)" value={KPI.onHandUnits.toLocaleString()} />
        <KpiCard label="Inventory value" value={Rs(KPI.onHandValue)} />
        <KpiCard label="Stockout rate" value={KPI.stockoutRate} />
        <KpiCard label="Days of inventory" value={`${KPI.doi} days`} />
        <KpiCard label="Dead/slow items" value={KPI.deadItems} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Inventory Value Over Time */}
        <Card title="Inventory Value Over Time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={VALUE_SERIES} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="amberFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBB01A" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#FBB01A" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,.7)" }} tickMargin={8} />
              <YAxis tick={{ fill: "rgba(255,255,255,.7)" }} tickFormatter={(v) => (v/1000)+"k"} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }}
                       formatter={(v) => Rs(Number(v))} />
              <Area type="monotone" dataKey="value" stroke="#FBB01A" fill="url(#amberFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Movements IN vs OUT */}
        <Card title="Stock Movements (IN vs OUT)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MOVEMENTS} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,.7)" }} tickMargin={8} />
              <YAxis tick={{ fill: "rgba(255,255,255,.7)" }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }} />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Bar dataKey="IN" stackId="a" fill="#22C55E" />
              <Bar dataKey="OUT" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ABC & Aging */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* ABC / Pareto */}
        <Card title="ABC Analysis (Pareto)">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={abcWithCum.map((r, i) => ({ ...r, idx: i + 1 }))}
              margin={{ top: 10, right: 30, bottom: 30, left: -10 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="idx" tick={{ fill: "rgba(255,255,255,.7)" }} />
              <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,.7)" }} tickFormatter={(v)=> (v/1000)+"k" } />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(255,255,255,.7)" }} unit="%" />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }}
                       formatter={(v, n) => (n === "cumPct" ? `${v}%` : Rs(Number(v)))} />
              <Bar yAxisId="left" dataKey="revenue" fill="#FBB01A" />
              <Line yAxisId="right" type="monotone" dataKey="cumPct" stroke="#60A5FA" strokeWidth={2} dot={false} />
              <ReferenceLine yAxisId="right" y={80} stroke="#22D3EE" strokeDasharray="4 4" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="text-xs text-white/60 mt-2">Cyan line = cumulative %, dashed = 80% threshold</div>
        </Card>

        {/* Aging buckets */}
        <Card title="Inventory Aging">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={AGING} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: "rgba(255,255,255,.7)" }} />
              <YAxis tick={{ fill: "rgba(255,255,255,.7)" }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }} />
              <Legend wrapperStyle={{ color: "#fff" }} />
              <Bar dataKey="b0_30" stackId="a" fill="#22C55E" name="0–30" />
              <Bar dataKey="b31_60" stackId="a" fill="#F59E0B" name="31–60" />
              <Bar dataKey="b61_90" stackId="a" fill="#FBB01A" name="61–90" />
              <Bar dataKey="b90p"  stackId="a" fill="#F43F5E" name="90+" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Movers */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card title="Top Movers (Units)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={TOP_MOVERS} layout="vertical" margin={{ top: 10, right: 30, bottom: 0, left: 80 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" />
              <XAxis tick={{ fill: "rgba(255,255,255,.7)" }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,.7)" }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }} />
              <Bar dataKey="units" fill="#FBB01A" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Bottom Movers (Units)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={BOTTOM_MOVERS} layout="vertical" margin={{ top: 10, right: 30, bottom: 0, left: 80 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" />
              <XAxis tick={{ fill: "rgba(255,255,255,.7)" }} />
              <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,.7)" }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }} />
              <Bar dataKey="units" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tables */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-black/50 border border-white/10 shadow-inset-neon p-4">
          <div className="text-lg font-semibold mb-3">Reorder Risk</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-white/70">
                <tr className="text-left">
                  <th className="py-2 pr-3">SKU</th>
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">On‑hand</th>
                  <th className="py-2 pr-3">ROP</th>
                  <th className="py-2 pr-3">Lead (d)</th>
                  <th className="py-2">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {REORDER_RISK.map((r) => (
                  <tr key={r.sku} className="hover:bg-white/5">
                    <td className="py-2 pr-3">{r.sku}</td>
                    <td className="py-2 pr-3">{r.name}</td>
                    <td className="py-2 pr-3 text-yellow-300">{r.onHand}</td>
                    <td className="py-2 pr-3">{r.rop}</td>
                    <td className="py-2 pr-3">{r.lead}</td>
                    <td className="py-2">{r.supplier}</td>
                  </tr>
                ))}
                {REORDER_RISK.length === 0 && (
                  <tr><td className="py-6 text-white/60" colSpan="6">No items at risk.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-black/50 border border-white/10 shadow-inset-neon p-4">
          <div className="text-lg font-semibold mb-3">Adjustments (last 30 days)</div>
          <div className="text-white/60 text-sm">No adjustments in this mock.</div>
        </div>
      </div>
    </div>
  );
}

// ====== small helpers ======
function Card({ title, children }) {
  return (
    <section className="rounded-2xl bg-black/50 border border-white/10 shadow-inset-neon p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/60 border border-white/10 p-4 shadow-neon">
      <div className="text-white/60 text-sm">{label}</div>
      <div className="text-2xl font-extrabold mt-1 text-[#FBB01A]">{value}</div>
    </div>
  );
}
