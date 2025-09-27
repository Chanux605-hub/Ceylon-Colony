import React from "react";

export default function WorkshopScheduleManagement() {
  // replace mocked data with your API later
  const upcoming = [
    { id: "WKP-001", title: "Beekeeping 101", date: "2025-09-05", seats: 30, filled: 24, trainer: "Amal" },
    { id: "WKP-002", title: "Harvest Techniques", date: "2025-09-12", seats: 25, filled: 21, trainer: "Kavindi" },
    { id: "WKP-003", title: "Quality & Safety", date: "2025-09-19", seats: 20, filled: 16, trainer: "Ruwan" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Workshop Schedule</h2>

      {/* Quick actions */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm px-3 py-2">Create workshop</button>
        <button className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm px-3 py-2">Export</button>
        <button className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm px-3 py-2">Templates</button>
      </div>

      {/* List */}
      <div className="rounded-xl bg-neutral-900/60 ring-1 ring-white/10 overflow-x-auto">
        <table className="min-w-[680px] w-full text-sm">
          <thead className="text-neutral-400">
            <tr>
              <th className="text-left font-medium px-3 py-2.5">#</th>
              <th className="text-left font-medium px-3 py-2.5">Title</th>
              <th className="text-left font-medium px-3 py-2.5">Date</th>
              <th className="text-left font-medium px-3 py-2.5">Trainer</th>
              <th className="text-left font-medium px-3 py-2.5">Fill</th>
              <th className="text-left font-medium px-3 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {upcoming.map((w, i) => {
              const pct = Math.round((w.filled / w.seats) * 100);
              return (
                <tr key={w.id}>
                  <td className="px-3 py-3">{i + 1}</td>
                  <td className="px-3 py-3">{w.title}</td>
                  <td className="px-3 py-3">{w.date}</td>
                  <td className="px-3 py-3">{w.trainer}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-neutral-800 rounded">
                        <div className="h-2 bg-yellow-400 rounded" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-neutral-400">{w.filled}/{w.seats}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <button className="text-yellow-400 hover:text-yellow-300">Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
