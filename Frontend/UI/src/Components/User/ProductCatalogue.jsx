// src/components/products/ProductCatalogue.jsx
import React, { useMemo, useState, useEffect } from "react";

import { Link } from "react-router-dom";

const API = "http://localhost:4000/api/products";
const asset = (file) => new URL(`../../assets/${file}`, import.meta.url).href;
const PLACEHOLDER = asset("jar.jpeg"); // fallback image

export default function ProductCatalogue() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // controls
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("best");

  // load from API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API, { cache: "no-store" });
        const json = await res.json(); // { items, total, ... }
        const items = json.items || [];
        const normalized = items.map((p) => ({
          id: p.id || p._id,
          name: p.name,
          category: p.category || "Raw Honey",
          weight: p.weight || "",
          price: Number(p.price) || 0,
          bestseller: Boolean(p.bestseller),
          img: (p.imageUrl || p.img || "").trim() || PLACEHOLDER,
          createdAt: p.createdAt,
        }));
        setAllProducts(normalized);
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // categories derived from data (with sensible defaults)
  const CATEGORIES = useMemo(() => {
    const base = ["Raw Honey", "Infused", "Skincare", "Gift Sets"];
    const fromData = Array.from(
      new Set(allProducts.map((p) => p.category).filter(Boolean))
    );
    return ["All", ...Array.from(new Set([...base, ...fromData]))];
  }, [allProducts]);

  // filtered + sorted list
  const products = useMemo(() => {
    let list = [...allProducts];

    if (category !== "All") list = list.filter((p) => p.category === category);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }

    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);
    list = list.filter((p) => p.price >= min && p.price <= max);

    if (sort === "best") {
      list.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
    } else if (sort === "low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === "new") {
      list.sort((a, b) => {
        const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bT - aT || String(b.id || "").localeCompare(String(a.id || ""));
      });
    }

    return list;
  }, [allProducts, query, category, minPrice, maxPrice, sort]);

  return (
    <section id="catalogue" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <h3 className="text-2xl sm:text-3xl font-bold">All products</h3>

        {/* Filters */}
        <div className="mt-6 grid gap-4 md:grid-cols-12 items-center">
          {/* search */}
          <div className="md:col-span-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full px-4 py-2.5 rounded-xl border border-[#1A1A1A]/10 bg-white text-[#1A1A1A] placeholder:text-[#1A1A1A]/50 focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/40"
            />
          </div>

          {/* categories */}
          <div className="md:col-span-5 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3.5 py-2 text-sm border transition ${
                  category === c
                    ? "bg-[#FBB01A] text-black border-transparent"
                    : "bg-white text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#FBB01A]/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* sort */}
          <div className="md:col-span-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#1A1A1A]/10 bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FBB01A]/40"
            >
              <option value="best">Best selling</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="new">Newest</option>
            </select>
          </div>

          {/* price range */}
          <div className="md:col-span-12 flex flex-wrap items-center gap-3 mt-1">
            <span className="text-sm text-[#1A1A1A]/70">Price:</span>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="w-28 px-3 py-2 rounded-lg border border-[#1A1A1A]/10"
            />
            <span className="text-[#1A1A1A]/50">—</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-28 px-3 py-2 rounded-lg border border-[#1A1A1A]/10"
            />
            {(minPrice !== "" || maxPrice !== "") && (
              <button
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="ml-2 text-sm text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading ? (
            <div className="col-span-full text-center text-[#1A1A1A]/70 py-12">
              Loading…
            </div>
          ) : products.length ? (
            products.map((p) => (
              <article
                key={p.id}
                className="bg-[#111111] text-white border border-white/10 rounded-2xl hover:border-[#FBB01A]/40 transition"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-wide text-white/60">
                    {p.category}
                  </div>
                  <h4 className="mt-1 font-semibold">{p.name}</h4>
                  {p.weight && (
                    <p className="text-white/70 text-sm">{p.weight}</p>
                  )}

                  
                 <div className="mt-3 flex items-center justify-between">
                <span className="text-[#F28C28] font-semibold">
                  Rs {p.price.toLocaleString()}
                </span>

                <Link
                  to={`/product/${p.id}`}  /* or p.slug if you have it */
                  className="rounded-full bg-[#FBB01A] text-black px-3 py-1.5 text-sm font-semibold hover:opacity-90"
                >
                  View
                </Link>
              </div>



                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center text-[#1A1A1A]/70 py-12">
              No products match your filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
