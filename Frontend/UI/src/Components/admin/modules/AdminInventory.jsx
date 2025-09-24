import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit, Trash2, X, ImagePlus, Filter, AlertTriangle } from "lucide-react";

// helpers
const asset = (file) => new URL(`../assets/${file}`, import.meta.url).href;
const rs = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

const CATEGORIES = ["All", "Raw Honey", "Infused", "Skincare", "Packaging"];
const SOURCES = ["All", "In-house", "Outsourced"];
const SORTS = [
  { value: "low", label: "Stock (Low→High)" },
  { value: "high", label: "Stock (High→Low)" },
  { value: "name", label: "Name (A→Z)" },
];

export default function AdminInventory() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("inventory_items");
    return saved ? JSON.parse(saved) : [];
  });

  // fetch from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/inventory");
        if (!res.ok) throw new Error("Failed to fetch inventory");
        const json = await res.json();
        setItems(json);
      } catch (err) {
        console.error("Inventory fetch error:", err);
      }
    })();
  }, []);

  // persist low count to sidebar badge
  const lowThreshold = 5;
  const lowItems = items.filter(
    (it) => it.stock <= lowThreshold || it.stock <= (it.reorder ?? 0)
  );
  useEffect(() => {
    localStorage.setItem("inventory_low_count", String(lowItems.length));
  }, [lowItems.length]);

  // toolbar state
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [src, setSrc] = useState("All");
  const [sort, setSort] = useState("low");

  // modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // derived
  const filtered = useMemo(() => {
    let list = [...items];
    if (cat !== "All") list = list.filter((i) => i.category === cat);
    if (src !== "All") list = list.filter((i) => i.source === src);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(s) ||
          i.category.toLowerCase().includes(s) ||
          i.source.toLowerCase().includes(s)
      );
    }
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "low") list.sort((a, b) => a.stock - b.stock);
    if (sort === "high") list.sort((a, b) => b.stock - a.stock);
    return list;
  }, [items, q, cat, src, sort]);

  // 🔹 Delete item
  const onDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/inventory/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      // ✅ refresh list
      const refreshed = await fetch("http://localhost:3000/api/inventory").then((r) => r.json());
      setItems(refreshed);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete item: " + err.message);
    }
  };

  // 🔹 Save (create/update)
  const onSave = async (data) => {
    try {
      const url = data.id
        ? `http://localhost:3000/api/inventory/${data.id}`
        : "http://localhost:3000/api/inventory";
      const method = data.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Save failed");

      // ✅ refresh list
      const refreshed = await fetch("http://localhost:3000/api/inventory").then((r) => r.json());
      setItems(refreshed);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save item: " + err.message);
    }

    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6 text-white">
      {/* 🔹 Low stock banner */}
      {lowItems.length > 0 && (
        <div className="rounded-2xl bg-[#2a1a00] border border-[#FBB01A]/40 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-[#FBB01A] mt-0.5" />
            <div>
              <div className="font-semibold">Low stock alert</div>
              <p className="text-white/80 text-sm">
                {lowItems.length} item{lowItems.length > 1 ? "s" : ""} at or below threshold (≤ {lowThreshold} or ≤ reorder point).
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {lowItems.slice(0, 6).map((it) => (
                  <span key={it._id} className="px-2 py-1 rounded bg-[#FBB01A] text-black font-semibold">
                    {it.name} ({it.stock})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Toolbar, Filters, Table (unchanged) */}
      {/* ... keep your existing JSX for Toolbar, Filters, and Table ... */}

      {open && (
        <ItemModal
          initial={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSave={onSave}
        />
      )}
    </div>
  );
}

/* ---------------- Modal for Add / Adjust ---------------- */

function ItemModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || { name: "", category: "Raw Honey", source: "In-house", stock: 0, reorder: 10, img: "" }
  );
  const [preview, setPreview] = useState(initial?.img || "");

  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const pickImg = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => {
      setPreview(e.target.result);
      change("img", e.target.result);
    };
    r.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name is required.");
    if (form.stock < 0) return alert("Stock cannot be negative.");
    onSave(form);
  };

  const adjust = (delta) => change("stock", Math.max(0, Number(form.stock || 0) + delta));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0E0E0E] text-white border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="font-semibold">{initial ? "Adjust Item" : "Add Item"}</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* 🔹 Form (unchanged UI) */}
        {/* ... keep your existing JSX for form fields ... */}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="text-sm text-white/80 grid gap-1">
      <span>{label}</span>
      {children}
    </label>
  );
}
