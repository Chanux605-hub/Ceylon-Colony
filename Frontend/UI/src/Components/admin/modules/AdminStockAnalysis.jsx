import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ComposedChart, Line, ReferenceLine
} from "recharts";

const API = "http://localhost:3000/api/analytics";
const Rs = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

export default function AdminStockAnalysis() {
  // filters (optional UI only)
  const [range] = useState("Last 30 days");
  const [group] = useState("day");
  const [category, setCategory] = useState("All");

  // data state
  const [kpi, setKpi] = useState({ onHandUnits: 0, onHandValue: 0, stockoutRate: "0%", doi: 0, deadItems: 0 });
  const [incomeSeries, setIncomeSeries] = useState([]);
  const [movements, setMovements] = useState([]);
  const [abcRows, setAbcRows] = useState([]);
  const [topRows, setTopRows] = useState([]);
  const [bottomRows, setBottomRows] = useState([]);
  const [stockRows, setStockRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch everything
  useEffect(() => {
    (async () => {
      try {
        const [kpiR, incR, movR, abcR, topR, botR, stockR] = await Promise.all([
          fetch(`${API}/kpis`).then(r => r.json()),
          fetch(`${API}/daily-income`).then(r => r.json()),
          fetch(`${API}/movements`).then(r => r.json()),
          fetch(`${API}/abc`).then(r => r.json()),
          fetch(`${API}/top-movers?limit=5`).then(r => r.json()),
          fetch(`${API}/bottom-movers?limit=5`).then(r => r.json()),
          fetch(`${API}/stock-status`).then(r => r.json()),
        ]);

        setKpi(kpiR || {});
        setIncomeSeries(Array.isArray(incR) ? incR : []);
        setMovements(Array.isArray(movR) ? movR : []);
        setAbcRows(Array.isArray(abcR) ? abcR : []);
        setTopRows(Array.isArray(topR) ? topR : []);
        setBottomRows(Array.isArray(botR) ? botR : []);
        setStockRows(Array.isArray(stockR) ? stockR : []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ABC with cumulative % for the composed chart
  const abcWithCum = useMemo(() => {
    const total = abcRows.reduce((s, r) => s + (r.revenue || 0), 0);
    let cum = 0;
    return abcRows.map((row, idx) => {
      cum += row.revenue || 0;
      const share = total ? ((row.revenue / total) * 100) : 0;
      const cumPct = total ? ((cum / total) * 100) : 0;
      return { ...row, idx: idx + 1, share: Number(share.toFixed(1)), cumPct: Number(cumPct.toFixed(1)) };
    });
  }, [abcRows]);

  const reorderRisk = useMemo(() => {
    const rows = stockRows
      .filter(r => r.stock <= r.reorder) // risk criteria
      .map(r => ({
        sku: r.sku || "-", // if you want SKU, you can extend the stockStatus endpoint to include it
        name: r.name,
        onHand: r.stock,
        rop: r.reorder,
        category: r.category || "",
      }));
    // optional category filter (visual only)
    return category === "All" ? rows : rows.filter(r => r.category === category);
  }, [stockRows, category]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white px-6 sm:px-8 py-8">
      {/* Header / Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Stock Analysis</h1>
          <p className="text-white/60">Analytics & insights for inventory performance</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select value={range} readOnly className="bg-black/60 border border-white/10 rounded-xl px-3 py-2">
            {["Today", "Last 7 days", "Last 30 days", "This month"].map((r) =>
              <option className="bg-[#0B0B0B]" key={r}>{r}</option>
            )}
          </select>
          <select value={group} readOnly className="bg-black/60 border border-white/10 rounded-xl px-3 py-2">
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

          <button onClick={() => window.print()}
                  className="rounded-xl bg-[#FBB01A] text-black font-semibold px-4 py-2 shadow-neon hover:brightness-95">
            Export PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <KpiCard label="Stock on hand (units)" value={Number(kpi.onHandUnits || 0).toLocaleString()} />
        <KpiCard label="Inventory value" value={Rs(kpi.onHandValue || 0)} />
        <KpiCard label="Stockout rate" value={kpi.stockoutRate || "0%"} />
        <KpiCard label="Days of inventory" value={`${kpi.doi || 0} days`} />
        <KpiCard label="Dead/slow items" value={kpi.deadItems || 0} />
      </div>

      {loading ? (
        <div className="text-white/60 mt-10">Loading analytics…</div>
      ) : (
        <>
          {/* Charts row */}
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            {/* Daily Income */}
            <Card title="Daily Income">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={incomeSeries} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
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

            {/* Movements OUT (IN=0 placeholder) */}
            <Card title="Stock Movements (IN vs OUT)">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={movements} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
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

          {/* ABC & Aging (we’ll show ABC; you can wire Aging later if you track dates per batch) */}
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <Card title="ABC Analysis (Pareto)">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                  data={abcWithCum}
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

            {/* Top / Bottom movers */}
            <div className="grid gap-6">
              <Card title="Top Movers (Units)">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topRows} layout="vertical" margin={{ top: 10, right: 30, bottom: 0, left: 80 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                    <XAxis tick={{ fill: "rgba(255,255,255,.7)" }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,.7)" }} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }} />
                    <Bar dataKey="units" fill="#FBB01A" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Bottom Movers (Units)">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={bottomRows} layout="vertical" margin={{ top: 10, right: 30, bottom: 0, left: 80 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                    <XAxis tick={{ fill: "rgba(255,255,255,.7)" }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,.7)" }} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }} />
                    <Bar dataKey="units" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>

          {/* Reorder Risk table */}
          <div className="mt-8 rounded-2xl bg-black/50 border border-white/10 shadow-inset-neon p-4">
            <div className="text-lg font-semibold mb-3">Reorder Risk</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-white/70">
                  <tr className="text-left">
                    <th className="py-2 pr-3">Product</th>
                    <th className="py-2 pr-3">Category</th>
                    <th className="py-2 pr-3">On-hand</th>
                    <th className="py-2 pr-3">ROP</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {reorderRisk.map((r, i) => (
                    <tr key={`${r.name}-${i}`} className="hover:bg-white/5">
                      <td className="py-2 pr-3">{r.name}</td>
                      <td className="py-2 pr-3">{r.category || "-"}</td>
                      <td className="py-2 pr-3 text-yellow-300">{r.onHand}</td>
                      <td className="py-2 pr-3">{r.rop}</td>
                      <td className="py-2">
                        {r.onHand <= r.rop ? (
                          <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-300">Low</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300">OK</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reorderRisk.length === 0 && (
                    <tr><td className="py-6 text-white/60" colSpan="5">No items at risk.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// small helpers
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
