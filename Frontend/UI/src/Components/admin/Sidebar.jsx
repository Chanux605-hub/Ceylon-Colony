import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ active, modules = [], admin, onLogout }) {
  const [open, setOpen] = useState(true);

  const initials = useMemo(() => {
    const n = admin?.name || "Admin";
    return n.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
  }, [admin?.name]);

  return (
    <aside
      className={`${open ? "w-72" : "w-20"} hidden md:flex flex-col
      transition-all duration-300 bg-neutral-900/80 ring-1 ring-white/10`}
    >
      {/* Brand row */}
      <div className="h-16 flex items-center justify-between gap-3 px-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-400 text-neutral-900 grid place-items-center font-bold">
            🐝
          </div>
          {open && (
            <div>
              <div className="text-sm text-neutral-300">Ceylon Colony</div>
              <div className="text-xs text-neutral-400">Admin Dashboard</div>
            </div>
          )}
        </div>
        {/* tiny icon toggle */}
        <button
          onClick={() => setOpen(s => !s)}
          className="h-8 w-8 grid place-items-center rounded-lg bg-neutral-800 hover:bg-neutral-700"
          title={open ? "Collapse" : "Expand"}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronIcon open={open} />
        </button>
      </div>

      {/* Admin card */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          {admin?.avatar ? (
            <img
              src={admin.avatar}
              alt="avatar"
              className="h-12 w-12 rounded-xl object-cover ring-1 ring-yellow-400/40"
            />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-yellow-400 text-neutral-900 grid place-items-center font-bold">
              {initials}
            </div>
          )}
          {open && (
            <div>
              <div className="font-semibold">{admin?.name || "Admin"}</div>
              <div className="text-xs text-neutral-400">Administrator</div>
            </div>
          )}
        </div>
      </div>

      {/* Pinned Overview */}
      <div className="px-2 pt-3">
        <Link
          to="/admin/overview"
          aria-current={active === "overview" ? "page" : undefined}
          className={`w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 transition
            ${active === "overview" ? "bg-yellow-400 text-neutral-900" : "hover:bg-neutral-800"}`}
          title={!open ? "Overview" : undefined}
        >
          <span className={`${active === "overview" ? "text-neutral-900" : "text-yellow-400"} grid place-items-center`}>
            <OverviewIcon />
          </span>
          {open && <span className={`text-sm ${active === "overview" ? "font-semibold" : "text-neutral-200"}`}>Overview</span>}
        </Link>
      </div>
      <div className="px-2 pt-2"><div className="h-px bg-white/10" /></div>

      {/* Modules */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {modules.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <Link
              key={key}
              to={`/admin/${key}`}
              aria-current={isActive ? "page" : undefined}
              className={`w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 transition
                ${isActive ? "bg-yellow-400 text-neutral-900" : "hover:bg-neutral-800"}`}
              title={!open ? label : undefined}
            >
              <span className={`${isActive ? "text-neutral-900" : "text-yellow-400"} grid place-items-center`}>
                {Icon ? <Icon /> : <DotIcon />}
              </span>
              {open && (
                <span className={`text-sm ${isActive ? "font-semibold" : "text-neutral-200"}`}>
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Link
            to="/admin/settings"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm py-2"
            title="Settings"
          >
            <SettingsIcon />
            {open && <span>Settings</span>}
          </Link>
          <button
            onClick={onLogout}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm py-2 text-yellow-300"
            title="Logout"
          >
            <LogoutIcon />
            {open && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

/* Icons (tiny inline SVGs) */
function OverviewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
    </svg>
  );
}
function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {open ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}
function DotIcon() {
  return <span className="text-xl leading-none">•</span>;
}
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l.02.06a2 2 0 1 1-3.38 0l.02-.06A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33l-.06.02a2 2 0 1 1 0-3.38l.06.02A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 9 4.6c.39 0 .76-.14 1-.6l.02-.06a2 2 0 1 1 3.38 0l.02.06c.24.46.61.6 1 .6.6 0 1.14-.24 1.58-.64l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.4.44-.64.98-.64 1.58 0 .39.14.76.6 1l.06.02c.58.26.94.79.94 1.38Z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
