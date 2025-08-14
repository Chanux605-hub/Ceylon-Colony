import React from "react";

export default function HarvestFarmManagement() {
  // Replace mock data with your API later
  const apiaries = [
    { id: "A1", name: "Central Apiary", hives: 48, health: "Good", lastInspection: "2025-08-02" },
    { id: "A2", name: "West Field",     hives: 26, health: "Watch", lastInspection: "2025-07-28" },
    { id: "B1", name: "Highland Ridge", hives: 18, health: "Good", lastInspection: "2025-08-10" },
  ];

  const dueInspections = [
    { hiveId: "A2-11", apiary: "West Field", daysOverdue: 5 },
    { hiveId: "A1-07", apiary: "Central Apiary", daysOverdue: 2 },
    { hiveId: "B1-03", apiary: "Highland Ridge", daysOverdue: 1 },
  ];

  const monthlyYield = [
    { month: "Mar", kg: 60 },
    { month: "Apr", kg: 72 },
    { month: "May", kg: 68 },
    { month: "Jun", kg: 75 },
    { month: "Jul", kg: 81 },
    { month: "Aug", kg: 77 },
  ];

  const totalHives = apiaries.reduce((sum, a) => sum + a.hives, 0);
  const lowHealth = apiaries.filter(a => a.health !== "Good").length;
  const avgYield = Math.round(monthlyYield.reduce((s, r) => s + r.kg, 0) / monthlyYield.length);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Harvest &amp; Farm</h2>

      {/* Quick actions */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm px-3 py-2">New Apiary</button>
        <button className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm px-3 py-2">Log Inspection</button>
        <button className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm px-3 py-2">Record Yield</button>
        <button className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm px-3 py-2">Export CSV</button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Kpi title="Total Hives" value={totalHives} />
        <Kpi title="Apiaries" value={apiaries.length} />
        <Kpi title="Needs Attention" value={lowHealth} alert />
        <Kpi title="Avg. Monthly Yield (kg)" value={avgYield} />
      </div>

      {/* Content blocks */}
      <div className="grid gap-6">
        {/* Apiaries table */}
        <section className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="text-neutral-400">
              <tr>
                <th className="text-left font-medium px-3 py-2.5">Apiary</th>
                <th className="text-left font-medium px-3 py-2.5">Hives</th>
                <th className="text-left font-medium px-3 py-2.5">Health</th>
                <th className="text-left font-medium px-3 py-2.5">Last Inspection</th>
                <th className="text-left font-medium px-3 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {apiaries.map((a) => (
                <tr key={a.id}>
                  <td className="px-3 py-3">{a.name}</td>
                  <td className="px-3 py-3">{a.hives}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1
                      ${a.health === "Good" ? "bg-green-900/30 text-green-300" : "bg-yellow-900/30 text-yellow-300"}`}>
                      <span className={`h-2.5 w-2.5 rounded-full
                        ${a.health === "Good" ? "bg-green-400" : "bg-yellow-400"}`} />
                      <span>{a.health}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3">{a.lastInspection}</td>
                  <td className="px-3 py-3">
                    <button className="text-yellow-400 hover:text-yellow-300">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Hives due for inspection */}
        <section className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 p-4">
          <h3 className="text-base font-semibold mb-3">Due Inspections</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {dueInspections.map((h) => (
              <div key={h.hiveId} className="rounded-lg bg-neutral-900 ring-1 ring-white/10 p-3">
                <div className="text-sm font-medium">{h.hiveId}</div>
                <div className="text-xs text-neutral-400">{h.apiary}</div>
                <div className="mt-2 text-xs">
                  Overdue: <span className="text-yellow-300">{h.daysOverdue}d</span>
                </div>
                <div className="mt-2 h-2 bg-neutral-800 rounded">
                  <div className="h-2 bg-yellow-400 rounded" style={{ width: `${Math.min(100, h.daysOverdue * 15)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly yield (mini bars) */}
        <section className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 p-4">
          <h3 className="text-base font-semibold mb-3">Monthly Yield (kg)</h3>
          <div className="grid gap-2">
            {monthlyYield.map((r) => (
              <div key={r.month}>
                <div className="flex justify-between text-[11px] text-neutral-400">
                  <span>{r.month}</span>
                  <span>{r.kg} kg</span>
                </div>
                <div className="h-2 bg-neutral-800 rounded">
                  <div className="h-2 bg-yellow-400 rounded" style={{ width: `${(r.kg / 100) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Kpi({ title, value, alert }) {
  return (
    <div className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 p-4">
      <div className="text-xs text-neutral-400">{title}</div>
      <div className={`mt-1 text-xl font-semibold ${alert ? "text-yellow-300" : ""}`}>{value}</div>
      {alert && <div className="mt-1 text-[11px] text-yellow-300/80">Action recommended</div>}
    </div>
  );
}
