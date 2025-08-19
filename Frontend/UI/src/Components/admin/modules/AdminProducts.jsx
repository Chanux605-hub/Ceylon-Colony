import React, { useMemo, useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, ImagePlus, Filter } from "lucide-react";

// helper: make currency
const rs = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

// helper: resolve sample asset images (since this file is in src/pages)
const asset = (file) => new URL(`../assets/${file}`, import.meta.url).href;

// seed data (3–4 products)
const SEED = [
  { id: crypto.randomUUID(), name: "Wildflower Honey", category: "Raw Honey",    weight: "350g", price: 1200, status: "Active", img: asset("honeyjarP1.jpeg") },
  { id: crypto.randomUUID(), name: "Cinnamon Infused", category: "Infused",      weight: "350g", price: 1450, status: "Active", img: asset("jar.jpeg") },
  { id: crypto.randomUUID(), name: "Honey Glow Serum", category: "Skincare",     weight: "50ml", price: 1750, status: "Active", img: asset("honeyserump2.jpeg") },
  { id: crypto.randomUUID(), name: "Taster Gift Set",  category: "Gift Sets",    weight: "3×125g", price: 3200, status: "Active", img: asset("product5.jpg") /* replace if you have */ },
];

const CATEGORIES = ["All", "Raw Honey", "Infused", "Skincare", "Gift Sets"];
const SORTS = [
  { value: "new",  label: "Newest" },
  { value: "name", label: "Name (A→Z)" },
  { value: "low",  label: "Price (Low→High)" },
  { value: "high", label: "Price (High→Low)" },
];

export default function AdminProducts() {
  // load from localStorage once
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("admin_products");
    return saved ? JSON.parse(saved) : SEED;
  });

  // persist whenever products change
  useEffect(() => {
    localStorage.setItem("admin_products", JSON.stringify(products));
  }, [products]);

  // controls
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("new");

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // product or null

  const filtered = useMemo(() => {
    let list = [...products];

    if (cat !== "All") list = list.filter((p) => p.category === cat);

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s) ||
          (p.weight || "").toLowerCase().includes(s)
      );
    }

    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    else if (sort === "new") list.sort((a, b) => (a._ts || 0) - (b._ts || 0)).reverse();

    return list;
  }, [products, q, cat, sort]);

  const onDelete = (id) => {
    if (confirm("Delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const onSave = (data) => {
    if (data.id) {
      setProducts((prev) => prev.map((p) => (p.id === data.id ? { ...p, ...data } : p)));
    } else {
      setProducts((prev) => [{ ...data, id: crypto.randomUUID(), _ts: Date.now() }, ...prev]);
    }
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* header card */}
      <div className="rounded-2xl bg-black/40 border border-white/10 p-5 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold">Products</div>
            <p className="text-white/70 text-sm">Create, search, filter, and edit your catalogue.</p>
          </div>
          <button
            onClick={() => { setEditing(null); setOpen(true); }}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold bg-[#FBB01A] text-black hover:opacity-90"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* controls row */}
        <div className="mt-4 grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, category, weight…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/30"
            />
          </div>
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-white/60" />
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#121212]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#121212]">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* table card */}
      <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-white/5 text-white/70">
              <tr className="text-left">
                <th className="py-3 pl-5 pr-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="py-3 pl-5 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-white/50 text-xs">{p.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/85">{p.category}</td>
                  <td className="py-3 px-4 text-white/85">{p.weight}</td>
                  <td className="py-3 px-4 text-[#F28C28] font-semibold">{rs(p.price)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300">
                      {p.status || "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2 pr-1">
                      <button
                        onClick={() => { setEditing(p); setOpen(true); }}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10"
                        title="Edit"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-red-300"
                        title="Delete"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-white/60">
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <ProductModal
          initial={editing}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={onSave}
        />
      )}
    </div>
  );
}

/* ---------------- Modal ---------------- */

function ProductModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      category: "Raw Honey",
      weight: "",
      price: "",
      status: "Active",
      img: "",
    }
  );
  const [preview, setPreview] = useState(initial?.img || "");

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onPickImg = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      handleChange("img", e.target.result); // store base64 (no backend)
    };
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Name and price are required.");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0E0E0E] text-white border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="font-semibold">{initial ? "Edit Product" : "Add Product"}</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="px-5 py-4 space-y-4">
          {/* image picker */}
          <div>
            <label className="text-sm text-white/80">Image</label>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-16 w-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden grid place-items-center">
                {preview ? (
                  <img src={preview} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus className="text-white/50" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPickImg(e.target.files?.[0])}
                className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#FBB01A] file:px-3 file:py-2 file:text-black hover:file:opacity-90"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product name">
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                placeholder="e.g., Forest Honey"
              />
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
              >
                {["Raw Honey", "Infused", "Skincare", "Gift Sets"].map((c) => (
                  <option key={c} value={c} className="bg-[#0E0E0E]">
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Weight / Size">
              <input
                value={form.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                placeholder="e.g., 500g / 50ml"
              />
            </Field>

            <Field label="Price (Rs)">
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                placeholder="e.g., 1900"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
              >
                {["Active", "Draft", "Archived"].map((s) => (
                  <option key={s} value={s} className="bg-[#0E0E0E]">
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg px-4 py-2 font-semibold bg-[#FBB01A] text-black hover:opacity-90"
            >
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
