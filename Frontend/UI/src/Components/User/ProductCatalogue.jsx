import React, { useMemo, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from '../../context/StoreContext';

const API = "http://localhost:3000/api/products";
const asset = (file) => new URL(`../../assets/${file}`, import.meta.url).href;
const PLACEHOLDER = asset("jar.jpeg");

export default function ProductCatalogue() {
  const { addToCart, cartItems } = useContext(StoreContext);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("best");

  // fetch
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API, { cache: "no-store" });
        const json = await res.json();
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
          stockStatus: p.stockStatus || "In stock",
        }));
        setAllProducts(normalized);
      } catch (e) {
        console.error("Failed to load products:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // categories
  const CATEGORIES = useMemo(() => {
    const base = ["Raw Honey", "Infused", "Skincare", "Gift Sets"];
    const fromData = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));
    return ["All", ...Array.from(new Set([...base, ...fromData]))];
  }, [allProducts]);

  // filtered + sorted
  const products = useMemo(() => {
    let list = [...allProducts];
    if (category !== "All") list = list.filter((p) => p.category === category);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q)
      );
    }

    const min = minPrice === "" ? -Infinity : Number(minPrice);
    const max = maxPrice === "" ? Infinity : Number(maxPrice);
    list = list.filter((p) => p.price >= min && p.price <= max);

    if (sort === "best") list.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
    else if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    else if (sort === "new") {
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

        {/* Product Grid */}
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
                  {p.weight && <p className="text-white/70 text-sm">{p.weight}</p>}

                  {/* ✅ Stock Status */}
                  <p
                    className={`mt-2 text-sm font-medium ${
                      p.stockStatus === "Out of stock"
                        ? "text-red-400"
                        : p.stockStatus === "Low stock"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {p.stockStatus}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[#F28C28] font-semibold">
                      Rs {p.price.toLocaleString()}
                    </span>

                    <div className="flex gap-2">
                      <Link
                        to={`/product/${p.id}`}
                        className="rounded-full bg-white/10 text-white px-3 py-1.5 text-sm font-semibold hover:bg-white/20"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => addToCart(p.id)}
                        disabled={p.stockStatus === "Out of stock"}
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                          p.stockStatus === "Out of stock"
                            ? "bg-gray-500 text-white cursor-not-allowed"
                            : "bg-[#FBB01A] text-black hover:opacity-90"
                        }`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {cartItems[p.id] > 0 && (
                    <div className="mt-2 text-sm text-[#FBB01A]">
                      In cart: {cartItems[p.id]}
                    </div>
                  )}
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
