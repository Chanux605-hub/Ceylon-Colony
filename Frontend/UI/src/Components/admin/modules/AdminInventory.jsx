import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Edit, Trash2, X, ImagePlus, Filter, AlertTriangle } from "lucide-react";

// helpers
const asset = (file) => new URL(`../assets/${file}`, import.meta.url).href;
const rs = (n) => `Rs ${Number(n || 0).toLocaleString()}`; // optional if you show price later

const CATEGORIES = ["All", "Raw Honey", "Infused", "Skincare", "Packaging"];
const SOURCES = ["All", "In-house", "Outsourced"];
const SORTS = [
  { value: "low", label: "Stock (Low→High)" },
  { value: "high", label: "Stock (High→Low)" },
  { value: "name", label: "Name (A→Z)" },
];

// Seed inventory (first run only)
const SEED = [
  { id: crypto.randomUUID(), name: "Wildflower Honey 350g", category: "Raw Honey", source: "In-house", stock: 42, reorder: 10, img: asset("honeyjarP1.jpeg") },
  { id: crypto.randomUUID(), name: "Cinnamon Infused 350g", category: "Infused",   source: "In-house", stock: 8,  reorder: 12, img: asset("jar.jpeg") },
  { id: crypto.randomUUID(), name: "Honey Glow Serum 50ml", category: "Skincare",  source: "In-house", stock: 15, reorder: 8,  img: asset("honeyserump2.jpeg") },
  { id: crypto.randomUUID(), name: "Empty Glass Jar 350g",  category: "Packaging", source: "Outsourced", stock: 120, reorder: 50, img: asset("react.svg") }, // replace with your jar image
  { id: crypto.randomUUID(), name: "Labels Roll (1,000)",   category: "Packaging", source: "Outsourced", stock: 4,  reorder: 20, img: asset("skin2.jpeg") },   // replace
];

export default function AdminInventory() {
 const [items, setItems] = useState([]); // start empty array

useEffect(() => {
  (async () => {
    try {
      const res = await fetch("http://localhost:3000/api/inventory");
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const json = await res.json();

      // ✅ Fix: set items from json.items (not json)
      setItems(Array.isArray(json.items) ? json.items : []);

      console.log("Fetched inventory:", json.items);
    } catch (err) {
      console.error("Inventory fetch error:", err);
      setItems([]); // fallback to empty array if failed
    }
  })();
}, []);



  // toolbar state
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [src, setSrc] = useState("All");
  const [sort, setSort] = useState("low");

  // modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // derived
  const lowThreshold = 5;
  const lowItems = items.filter((it) => it.stock <= lowThreshold || it.stock <= (it.reorder ?? 0));

  // expose low count for sidebar badge (optional)
  useEffect(() => {
    localStorage.setItem("inventory_low_count", String(lowItems.length));
  }, [lowItems.length]);

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

 const onDelete = async (id) => {
  if (!confirm("Delete this item?")) return;
  try {
    const res = await fetch(`http://localhost:3000/api/inventory/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");

    const refreshed = await fetch("http://localhost:3000/api/inventory").then((r) => r.json());
    setItems(refreshed);
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete item: " + err.message);
  }
};


const onSave = async (data) => {
  try {
    const id = data._id || data.id;   // ✅ handle both

    if (id) {
      // Update existing
      const res = await fetch(`http://localhost:3000/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
    } else {
      // Create new
      const res = await fetch("http://localhost:3000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create failed");
    }

    // Refresh list
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
      {/* Low stock banner (inventory page only) */}
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
                  <span key={it.id} className="px-2 py-1 rounded bg-[#FBB01A] text-black font-semibold">
                    {it.name} ({it.stock})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold">Inventory</div>
            <p className="text-white/70 text-sm">Track on-hand stock, sources, and reorder points.</p>
          </div>
          <button
            onClick={() => { setEditing(null); setOpen(true); }}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold bg-[#FBB01A] text-black hover:opacity-90"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search item, category, source…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
            />
          </div>
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-white/60" />
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg_white/5 bg-white/5 border border-white/10 text-white focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#121212]">{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2">
            <select
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
            >
              {SOURCES.map((s) => (
                <option key={s} value={s} className="bg-[#121212]">{s}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#121212]">{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr className="text-left">
                <th className="py-3 pl-5 pr-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">In Stock</th>
                <th className="py-3 px-4">Reorder</th>
                <th className="py-3 px-4 pr-5 text-right">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {filtered.map((it) => {
                const isLow = it.stock <= lowThreshold || it.stock <= (it.reorder ?? 0);
                return (
                  <tr key={it.id} className={`hover:bg-white/5 ${isLow ? "bg-[#FBB01A]/5" : ""}`}>
                    <td className="py-3 pl-5 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={it.img} alt={it.name} className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10" />
                        <div>
                          <div className="font-medium">{it.name}</div>
                          <div className="text-white/50 text-xs">{it.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{it.category}</td>
                    <td className="py-3 px-4">{it.source}</td>
                    <td className="py-3 px-4 font-semibold">{it.stock}</td>
                    <td className="py-3 px-4">{it.reorder}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2 pr-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${isLow ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                          {isLow ? "Low" : "OK"}
                        </span>
                        <button
                          onClick={() => { setEditing(it); setOpen(true); }}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10"
                          title="Adjust"
                        >
                          <Edit size={16} /> Adjust
                        </button>
                        <button
                          onClick={() => onDelete(it.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="py-12 text-center text-white/60">No matching items.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <ItemModal
          initial={editing}
          onClose={() => { setOpen(false); setEditing(null); }}
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
    r.onload = (e) => { setPreview(e.target.result); change("img", e.target.result); };
    r.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name is required.");
    if (form.stock < 0) return alert("Stock cannot be negative.");
    onSave(form);
  };

  // quick increment/decrement for stock
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

        <form onSubmit={submit} className="px-5 py-4 space-y-4">
          <div>
            <label className="text-sm text-white/80">Image</label>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-16 w-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden grid place-items-center">
                {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="text-white/50" />}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => pickImg(e.target.files?.[0])}
                className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#FBB01A] file:px-3 file:py-2 file:text-black hover:file:opacity-90"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input value={form.name} onChange={(e) => change("name", e.target.value)}
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => change("category", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none">
                {["Raw Honey", "Infused", "Skincare", "Packaging"].map((c) => (
                  <option key={c} value={c} className="bg-[#0E0E0E]">{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Source">
              <select value={form.source} onChange={(e) => change("source", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none">
                {["In-house", "Outsourced"].map((s) => (
                  <option key={s} value={s} className="bg-[#0E0E0E]">{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Reorder point">
              <input type="number" min="0" value={form.reorder}
                     onChange={(e) => change("reorder", Number(e.target.value))}
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" />
            </Field>
            <Field label="In stock">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => adjust(-1)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">-</button>
                <input type="number" min="0" value={form.stock}
                       onChange={(e) => change("stock", Number(e.target.value))}
                       className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" />
                <button type="button" onClick={() => adjust(1)} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">+</button>
              </div>
            </Field>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose}
                    className="rounded-lg px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10">Cancel</button>
            <button type="submit" className="rounded-lg px-4 py-2 font-semibold bg-[#FBB01A] text-black hover:opacity-90">
              Save
            </button>
          </div>
        </form>
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
