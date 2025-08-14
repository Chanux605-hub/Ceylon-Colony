import React from "react";

export default function Topbar({ activeLabel = "" }) {
  return (
    <div className="hidden md:flex h-16 items-center justify-between px-6 bg-neutral-900/60 ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <span className="text-yellow-400"><LightningIcon /></span>
        <div className="text-sm text-neutral-300">
          Active module: <span className="ml-1 font-semibold text-yellow-300">{activeLabel}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SearchInput />
        <div className="h-9 w-9 rounded-xl bg-neutral-800 grid place-items-center"><BellIcon /></div>
      </div>
    </div>
  );
}

function SearchInput() {
  return (
    <div className="hidden md:flex items-center bg-neutral-800 rounded-xl overflow-hidden">
      <span className="pl-3 pr-1 text-neutral-400"><SearchIcon /></span>
      <input placeholder="Search…" className="bg-transparent text-sm px-2 py-2 outline-none placeholder:text-neutral-500 w-56" />
    </div>
  );
}

function LightningIcon(){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><path d="M13 2 3 14h7v8l11-14h-8z"/></svg>);}
function SearchIcon(){return(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>);}
function BellIcon(){return(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 5 3 9H3c0-4 3-2 3-9"/><path d="M9.5 19a2.5 2.5 0 0 0 5 0"/></svg>);}