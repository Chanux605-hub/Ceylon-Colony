// src/components/products/ProductCatalogue.jsx
import React, { useMemo, useState } from "react";

// helper: resolve images from src/assets (this file is at src/components/products)
const asset = (file) => new URL(`../../assets/${file}`, import.meta.url).href;

// product data (sample — tweak names/prices/images as you like)
const ALL_PRODUCTS = [
  // Raw Honey
  { id: "wf350", name: "Wildflower Honey",  category: "Raw Honey",   weight: "350g", price: 1200, bestseller: true,  img: asset("honeyjarP1.jpeg") },
  { id: "mf500", name: "Multi-Floral",      category: "Raw Honey",   weight: "500g", price: 2050, bestseller: true,  img: asset("jar.jpeg") },
  { id: "fr500", name: "Forest Reserve",    category: "Raw Honey",   weight: "500g", price: 1900, bestseller: false, img: asset("jar.jpeg") },

  // Infused
  { id: "cin350", name: "Cinnamon Infused", category: "Infused",      weight: "350g", price: 1450, bestseller: true,  img: asset("jar.jpeg") },
  { id: "gin350", name: "Ginger Infused",   category: "Infused",      weight: "350g", price: 1480, bestseller: false, img: asset("jar.jpeg") },
  { id: "lime350",name: "Lime Blossom",     category: "Infused",      weight: "350g", price: 1350, bestseller: false, img: asset("jar.jpeg") },

  // Skincare
  { id: "scrub",  name: "Honey Lip Scrub",  category: "Skincare",     weight: "30g",  price: 950,  bestseller: false, img: asset("honey lip scrub.jpg") },
  { id: "serum",  name: "Honey Serum",      category: "Skincare",     weight: "50ml", price: 1750, bestseller: false, img: asset("honeyserump2.jpeg") },

  // Gifts
  { id: "gift1",  name: "Taster Gift Set",  category: "Gift Sets",    weight: "3×125g", price: 3200, bestseller: true, img: asset("jar.jpeg") },
  { id: "gift2",  name: "Deluxe Hamper",    category: "Gift Sets",    weight: "Assorted", price: 6900, bestseller: false, img: asset("jar.jpeg") },
];

const CATEGORIES = ["All", "Raw Honey", "Infused", "Skincare", "Gift Sets"];
const SORTS = [
  { value: "best",  label: "Best selling" },
  { value: "low",   label: "Price: Low → High" },
  { value: "high",  label: "Price: High → Low" },
  { value: "new",   label: "Newest" },
];

export default function ProductCatalogue() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("best");

  // filter + sort
  const products = useMemo(() => {
    let list = [...ALL_PRODUCTS];

    // category
    if (category !== "All") list = list.filter(p => p.category === category);

    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // price range
    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);
    list = list.filter(p => p.price >= min && p.price <= max);

    // sort
    if (sort === "best") {
      list.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
    } else if (sort === "low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === "new") {
      // fake "newest": by id order descending
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [query, category, minPrice, maxPrice, sort]);

  // some featured for "Top picks"
  const topPicks = ALL_PRODUCTS.filter(p => p.bestseller).slice(0, 4);

  return (
    <section id="catalogue" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">

        {/* Top picks scroller */}
        <h2 className="text-2xl sm:text-3xl font-bold">Top picks</h2>
        <p className="text-[#1A1A1A]/70 mt-1">Customer favorites and gift-ready bestsellers.</p>

        <style>{`
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .no-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        `}</style>

        <div className="mt-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-5 pr-6">
            {topPicks.map((p) => (
              <ProductCard key={p.id} p={p} compact />
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-10 grid gap-4 md:grid-cols-12 items-center">
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
              {SORTS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* price range */}
          <div className="md:col-span-12 flex flex-wrap items-center gap-3 mt-2">
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
                onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                className="ml-2 text-sm text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <h3 className="mt-10 text-xl font-semibold">All products</h3>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center text-[#1A1A1A]/70 py-12">
              No products match your filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, compact = false }) {
  return (
    <article className={`${compact ? "w-[260px] shrink-0" : ""} bg-[#111111] text-white border border-white/10 rounded-2xl hover:border-[#FBB01A]/40 transition`}>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
        <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="text-xs uppercase tracking-wide text-white/60">{p.category}</div>
        <h4 className="mt-1 font-semibold">{p.name}</h4>
        <p className="text-white/70 text-sm">{p.weight}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[#F28C28] font-semibold">Rs {p.price.toLocaleString()}</span>
          <button className="rounded-full bg-[#FBB01A] text-black px-3 py-1.5 text-sm font-semibold hover:opacity-90">
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
