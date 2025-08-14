import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

/* Module registry with icons */
const MODULES = [
  { key: "products",  label: "Product Management",   icon: ProductIcon },
  { key: "inventory", label: "Inventory Management", icon: InventoryIcon },
  { key: "workshops", label: "Workshop Schedule",    icon: CalendarIcon },
  { key: "harvest",   label: "Harvest & Farm",       icon: LeafIcon },
  { key: "orders",    label: "Order & Delivery",     icon: TruckIcon },
  { key: "media",     label: "Customer Media",       icon: MediaIcon },
];

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = pathname.split("/")[2] || "products";
  const activeMeta = MODULES.find((m) => m.key === active);

  const admin = { name: "Admin User", avatar: "" };
  const initials = useMemo(
    () =>
      (admin?.name || "Admin")
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [admin?.name]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 text-neutral-100 flex">
      {/* Sidebar */}
      <Sidebar active={active} modules={MODULES} admin={{ name: admin.name, avatar: admin.avatar }} onLogout={handleLogout} />

      {/* Main */}
      <main className="flex-1 min-w-0 md:ml-0">
        {/* Topbar */}
        <div className="hidden md:flex h-16 items-center justify-between px-6 bg-neutral-900/60 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <span className="text-yellow-400"><LightningIcon /></span>
            <div className="text-sm text-neutral-300">
              Active module:
              <span className="ml-2 font-semibold text-yellow-300">{activeMeta?.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SearchInput />
            <div className="h-9 w-9 rounded-xl bg-neutral-800 grid place-items-center">
              <BellIcon />
            </div>
          </div>
        </div>

        {/* Content: Left = module page, Right = placeholder */}
        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <section className="xl:col-span-2 rounded-2xl bg-neutral-900/60 ring-1 ring-white/10 p-5">
              <Outlet />
            </section>
            <aside className="xl:col-span-1 rounded-2xl bg-neutral-900/60 ring-1 ring-white/10 p-5">
              <div className="text-sm text-neutral-400">
                Right-hand area — your module’s custom content goes here.
              </div>
              {active === "overview" ? (
                <OverallAnalytics />
                ) : (
                    <div className="text-sm text-neutral-400">
                    Right-hand area — your module’s custom content goes here.
                    </div>
                )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------ Small UI bits ------------------------------ */
function SearchInput() {
  return (
    <div className="hidden md:flex items-center bg-neutral-800 rounded-xl overflow-hidden">
      <span className="pl-3 pr-1 text-neutral-400"><SearchIcon /></span>
      <input
        placeholder="Search…"
        className="bg-transparent text-sm px-2 py-2 outline-none placeholder:text-neutral-500 w-56"
      />
    </div>
  );
}

function LightningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
      <path d="M13 2 3 14h7v8l11-14h-8z" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 5 3 9H3c0-4 3-2 3-9" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

/* Module icons */
function ProductIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="M21 7v6l-9 5-9-5V7" />
    </svg>
  );
}
function InventoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2v3M17 2v3M3 8h18" />
      <rect x="3" y="5" width="18" height="16" rx="2" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3S12 3 7.5 7.5 3 21 3 21s10.5 0 15-4.5S21 3 21 3z" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 6h11v8H3z" />
      <path d="M14 9h4l3 3v2h-7V9z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}
function MediaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="m10 9 5 3-5 3V9z" />
    </svg>
  );
}

function OverallAnalytics() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">System Overview</h3>
      <div className="grid gap-4">
        <Kpis rows={[
          ["Active Products", "128"],
          ["Open Orders", "42"],
          ["Low Stock", "9"],
          ["Workshops Upcoming", "6"],
        ]} />
        <MiniBar title="Sales by Channel (7d)" data={[280, 190, 110]} labels={["Web", "TikTok", "Wholesale"]} />
        <TrendLine title="Daily Orders (14d)" points={[18,22,20,21,24,19,26,27,25,29,31,28,33,30]} />
      </div>
    </div>
  );
}

function Kpis({ rows }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {rows.map(([k, v], i) => (
        <div key={i} className="rounded-xl bg-neutral-900 ring-1 ring-white/10 p-3">
          <div className="text-xs text-neutral-400">{k}</div>
          <div className="text-lg font-semibold mt-1">{v}</div>
        </div>
      ))}
    </div>
  );
}

function MiniBar({ title, data = [], labels = [] }) {
  const max = Math.max(1, ...data);
  return (
    <div className="rounded-xl bg-neutral-900 ring-1 ring-white/10 p-3">
      <div className="text-xs text-neutral-400 mb-2">{title}</div>
      <div className="space-y-2">
        {data.map((n, i) => (
          <div key={i}>
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>{labels[i] ?? `Item ${i+1}`}</span>
              <span>{n}</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded">
              <div className="h-2 bg-yellow-400 rounded" style={{ width: `${(n / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendLine({ title, points = [] }) {
  const W = 260, H = 60, P = 6;
  const max = Math.max(...points, 1);
  const step = points.length > 1 ? (W - P*2) / (points.length - 1) : 0;
  const d = points.map((v, i) => {
    const x = P + i * step;
    const y = H - P - (v / max) * (H - P*2);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  return (
    <div className="rounded-xl bg-neutral-900 ring-1 ring-white/10 p-3">
      <div className="text-xs text-neutral-400 mb-2">{title}</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="block">
        <path d={d} fill="none" stroke="currentColor" className="text-yellow-400" strokeWidth="2" />
        <path d={`${d} L ${P + (points.length-1)*step},${H-P} L ${P},${H-P} Z`} fill="currentColor" className="text-yellow-400/20" />
      </svg>
    </div>
  );
}

