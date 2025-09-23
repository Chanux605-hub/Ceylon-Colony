import React, { useMemo, useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, ImagePlus, Filter, Settings2 } from "lucide-react";

// helpers
const rs = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

// backend API
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const API = `${API_BASE}/api/products`;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // controls
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("new");

  // modals
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(null);

  // ✅ inventory options
  const [inventoryOptions, setInventoryOptions] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/inventory`)
      .then((r) => r.json())
      .then(setInventoryOptions)
      .catch(console.error);
  }, []);

  // load products
  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const { items = [] } = await res.json();
      const list = items.map((p) => ({
        id: p.id || p._id,
        name: p.name,
        category: p.category || "Raw Honey",
        weight: p.weight || "",
        price: Number(p.price) || 0,
        status: p.status || "Active",
        imageUrl: (p.imageUrl || p.img || "").trim(),
        _ts: p.createdAt ? Date.parse(p.createdAt) : Date.now(),
      }));
      setProducts(list);
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const CATEGORIES = useMemo(() => {
    const fromData = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    const base = ["Raw Honey", "Infused", "Skincare", "Gift Sets"];
    const merged = Array.from(new Set([...base, ...fromData]));
    return ["All", ...merged];
  }, [products]);

  const SORTS = [
    { value: "new", label: "Newest" },
    { value: "name", label: "Name (A→Z)" },
    { value: "low", label: "Price (Low→High)" },
    { value: "high", label: "Price (High→Low)" },
  ];

  const filtered = useMemo(() => {
    let list = [...products];

    if (cat !== "All") list = list.filter((p) => p.category === cat);

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          (p.category || "").toLowerCase().includes(s) ||
          (p.weight || "").toLowerCase().includes(s)
      );
    }

    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    else if (sort === "new") list.sort((a, b) => (a._ts || 0) - (b._ts || 0)).reverse();

    return list;
  }, [products, q, cat, sort]);

  const onDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({}))).message || res.statusText;
        throw new Error(`Delete failed: ${res.status} ${msg}`);
      }
      await load();
      alert("Deleted ✔");
    } catch (e) {
      console.error(e);
      alert(e.message || "Delete failed");
    }
  };

  const onSave = async (data) => {
    const payload = {
      name: data.name?.trim(),
      category: data.category || "",
      weight: data.weight || "",
      price: Number(data.price),
      status: data.status || "Active",
      imageUrl: (data.imageUrl || "").trim(),
      inventoryId: data.inventoryId || null, // ✅ include inventory link
    };

    try {
      const url = data.id ? `${API}/${data.id}` : API;
      const method = data.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(`${res.status} ${body.message || res.statusText}`);

      setOpen(false);
      setEditing(null);
      await load();
      alert(data.id ? "Updated ✔" : "Created ✔");
    } catch (e) {
      console.error("Save failed:", e, { payload });
      alert(e.message || "Save failed");
    }
  };

  const openDetailsFor = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`);
      const p = await res.json();
      setDetailsProduct(p);
      setOpenDetails(true);
    } catch (e) {
      console.error(e);
      alert("Failed to load product details");
    }
  };

  const saveDetails = async (id, details) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(`${res.status} ${body.message || res.statusText}`);
      setOpenDetails(false);
      setDetailsProduct(null);
      await load();
      alert("Details saved ✔");
    } catch (e) {
      console.error(e);
      alert(e.message || "Save failed");
    }
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

            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="6" className="py-8 text-center text-white/60">Loading…</td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-white/10">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="py-3 pl-5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-white/50 text-xs">{String(p.id).slice(0, 8)}</div>
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
                          onClick={() => openDetailsFor(p.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10"
                          title="Edit details"
                        >
                          <Settings2 size={16} /> Details
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
                    <td colSpan="6" className="py-12 text-center text-white/60">No products match your filters.</td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {open && (
        <ProductModal
          initial={editing}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={onSave}
          inventoryOptions={inventoryOptions}
        />
      )}

      {openDetails && detailsProduct && (
        <DetailsModal
          product={detailsProduct}
          onClose={() => { setOpenDetails(false); setDetailsProduct(null); }}
          onSave={(payload) => saveDetails(detailsProduct.id || detailsProduct._id, payload)}
        />
      )}
    </div>
  );
}

/* ---------------- Basic Add/Edit Modal ---------------- */

function ProductModal({ initial, onClose, onSave, inventoryOptions }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      category: "Raw Honey",
      weight: "",
      price: "",
      status: "Active",
      imageUrl: "",
      inventoryId: "",
    }
  );
  const [preview, setPreview] = useState(initial?.imageUrl || "");

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onPickImg = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { setPreview(e.target.result); handleChange("imageUrl", e.target.result); };
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Name and price are required.");
    onSave(initial ? { ...form, id: initial.id } : form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0E0E0E] text-white border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="font-semibold">{initial ? "Edit Product" : "Add Product"}</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5" aria-label="Close"><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="px-5 py-4 space-y-4">
          <div>
            <label className="text-sm text-white/80">Image</label>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-16 w-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden grid place-items-center">
                {preview ? <img src={preview} alt="preview" className="h-full w-full object-cover" /> : <ImagePlus className="text-white/50" />}
              </div>
              <input type="file" accept="image/*" onChange={(e) => onPickImg(e.target.files?.[0])}
                     className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#FBB01A] file:px-3 file:py-2 file:text-black hover:file:opacity-90" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product name">
              <input value={form.name} onChange={(e) => handleChange("name", e.target.value)}
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" placeholder="e.g., Forest Honey" />
            </Field>

            <Field label="Category">
              <select value={form.category} onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none">
                {["Raw Honey", "Infused", "Skincare", "Gift Sets"].map((c) => (
                  <option key={c} value={c} className="bg-[#0E0E0E]">{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Weight / Size">
              <input value={form.weight} onChange={(e) => handleChange("weight", e.target.value)}
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" placeholder="e.g., 500g / 50ml" />
            </Field>

            <Field label="Price (Rs)">
              <input type="number" min="0" value={form.price} onChange={(e) => handleChange("price", e.target.value)}
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" placeholder="e.g., 1900" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Status">
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none">
                {["Active", "Draft", "Archived"].map((s) => (
                  <option key={s} value={s} className="bg-[#0E0E0E]">{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Link Inventory">
            <select
              value={form.inventoryId || ""}
              onChange={(e) => handleChange("inventoryId", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
            >
              <option value="">— None —</option>
              {inventoryOptions.map((inv) => (
                <option key={inv._id} value={inv._id}>
                  {inv.name} (stock {inv.stock})
                </option>
              ))}
            </select>
          </Field>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10">Cancel</button>
            <button type="submit" className="rounded-lg px-4 py-2 font-semibold bg-[#FBB01A] text-black hover:opacity-90">Save</button>
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

/* ---------------- Details Modal ---------------- */

function DetailsModal({ product, onClose, onSave }) {
  const [desc, setDesc] = useState(product.description || "");
  const [sku, setSku] = useState(product.sku || "");
  const [inStock, setInStock] = useState(product.inStock ?? true);
  const [stock, setStock] = useState(product.stock ?? 0);
  const [bestseller, setBestseller] = useState(!!product.bestseller);

  const [images, setImages] = useState(
    Array.isArray(product.images) && product.images.length
      ? product.images
      : (product.imageUrl ? [{ url: product.imageUrl, alt: "" }] : [])
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(Array.isArray(product.tags) ? product.tags : []);

  const addImage = () => setImages((arr) => [...arr, { url: "", alt: "" }]);
  const updateImage = (i, key, val) =>
    setImages((arr) => arr.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const removeImage = (i) => setImages((arr) => arr.filter((_, idx) => idx !== i));

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags((ts) => [...ts, t]);
    setTagInput("");
  };
  const removeTag = (t) => setTags((ts) => ts.filter((x) => x !== t));

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      description: desc,
      sku,
      inStock,
      stock: Number(stock) || 0,
      bestseller,
      images: images.filter((it) => it && it.url),
      tags,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0E0E0E] text-white border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="font-semibold">Edit details — {product.name}</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="px-5 py-4 space-y-5">
          {/* Gallery */}
          <section>
            <div className="text-sm text-white/80 mb-2">Gallery images (3–4 recommended)</div>
            <div className="space-y-3">
              {images.map((img, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    value={img.url}
                    onChange={(e) => updateImage(i, "url", e.target.value)}
                    placeholder="Image URL (https://...)"
                    className="col-span-7 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                  />
                  <input
                    value={img.alt}
                    onChange={(e) => updateImage(i, "alt", e.target.value)}
                    placeholder="Alt text"
                    className="col-span-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                  />
                  <button type="button" onClick={() => removeImage(i)}
                          className="col-span-1 rounded-lg bg-white/5 border border-white/10 px-2 py-2 hover:bg-white/10">
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addImage}
                    className="mt-2 rounded-lg bg-[#FBB01A] text-black text-sm font-semibold px-3 py-1 hover:brightness-95">
              + Add image
            </button>
          </section>

          {/* Description */}
          <section>
            <div className="text-sm text-white/80 mb-1">Long description</div>
            <textarea
              rows="4"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 focus:outline-none"
              placeholder="Write product story, benefits, usage, storage tips…"
            />
          </section>

          {/* Tags */}
          <section>
            <div className="text-sm text-white/80 mb-1">Tags</div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag and press Enter"
                className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 focus:outline-none"
              />
              <button type="button" onClick={addTag}
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 hover:bg-white/10">
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} className="ml-1 opacity-70 hover:opacity-100">×</button>
                </span>
              ))}
            </div>
          </section>

          {/* Meta */}
          <section className="grid sm:grid-cols-2 gap-4">
            <Field label="SKU">
              <input value={sku} onChange={(e) => setSku(e.target.value)}
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" />
            </Field>
            <Field label="Stock quantity">
              <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)}
                     className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none" />
            </Field>
            <Field label="In stock">
              <select value={inStock ? "1" : "0"} onChange={(e) => setInStock(e.target.value === "1")}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none">
                <option value="1" className="bg-[#0E0E0E]">Yes</option>
                <option value="0" className="bg-[#0E0E0E]">No</option>
              </select>
            </Field>
            <Field label="Bestseller">
              <select value={bestseller ? "1" : "0"} onChange={(e) => setBestseller(e.target.value === "1")}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none">
                <option value="1" className="bg-[#0E0E0E]">Yes</option>
                <option value="0" className="bg-[#0E0E0E]">No</option>
              </select>
            </Field>
          </section>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose}
                    className="rounded-lg px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10">
              Cancel
            </button>
            <button type="submit"
                    className="rounded-lg px-4 py-2 font-semibold bg-[#FBB01A] text-black hover:opacity-90">
              Save details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
