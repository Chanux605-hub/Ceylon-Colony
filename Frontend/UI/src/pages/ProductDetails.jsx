// src/pages/ProductDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const PLACEHOLDER =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80";

/* ---------- Small UI helpers ---------- */
function Star({ filled }) {
  return <span className={filled ? "text-amber-400" : "text-white/20"}>★</span>;
}
function RatingBar({ stars, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 text-sm text-white/70">{stars} Star</div>
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-amber-400" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
const rs = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

/* ---------- Page ---------- */
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // load one product
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/api/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        if (alive) setData(json);
      } catch (e) {
        if (alive) setErr("Failed to load product.");
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // ✅ Add-to-Cart handler
const handleAddToCart = async () => {
  if (!product?.inventoryId?._id) {
    alert("This product is not linked to inventory");
    return;
  }
  try {
    const res = await fetch(
      `${API_BASE}/api/inventory/${product.inventoryId._id}/reduce`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || res.statusText);
    }
    const updated = await res.json();
    alert(`Added ${qty} to cart ✔. Remaining stock: ${updated.stock}`);
  } catch (err) {
    alert("Could not add to cart: " + err.message);
  }
};


  // normalize fields so the UI is stable
  const product = useMemo(() => {
    if (!data) return null;

    // ---- NEW: robust gallery normalization ----
    // Accept strings or objects with url/src/imageUrl keys
    const fromArray = Array.isArray(data.images) ? data.images : [];
    const normalizedFromArray = fromArray
      .map((it) => {
        if (!it) return null;
        if (typeof it === "string") return it.trim();
        return (it.url || it.src || it.imageUrl || "").trim();
      })
      .filter(Boolean);

    // If a single imageUrl exists (base64 or URL), put it first
    const gallery = [];
    if (typeof data.imageUrl === "string" && data.imageUrl.trim()) {
      gallery.push(data.imageUrl.trim());
    }
    gallery.push(...normalizedFromArray);
    if (gallery.length === 0) gallery.push(PLACEHOLDER);
    // -------------------------------------------

    return {
      id: data.id || data._id,
      name: data.name || "Product",
      category: data.category || "",
      price: Number(data.price) || 0,
      compareAt: Number(data.compareAt) || undefined,
      inStock: typeof data.inStock === "boolean" ? data.inStock : true,
      ratingAvg: data?.rating?.average ?? 0,
      ratingCount: data?.rating?.count ?? 0,
      sku: data.sku || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: data.description || "",
      sizes: data.attributes?.sizes || [], // optional if you add sizes
      additional: [
        ["Net weight", data.weight || ""],
        ["Origin", data.attributes?.origin || "Sri Lanka"],
        ["Allergens", data.attributes?.allergens || "None"],
        ["Stock", data.stock ?? 0],
      ].filter(([, v]) => String(v).trim() !== ""),
      images: gallery,
    };
  }, [data]);

  const [mainImg, setMainImg] = useState(PLACEHOLDER);
  const [activeSize, setActiveSize] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setMainImg(product.images[0] || PLACEHOLDER);
      setActiveSize(product.sizes[0] || "");
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0B0B0B] text-white">
        <div className="text-white/70">Loading product…</div>
      </div>
    );
  }

  if (err || !product) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#0B0B0B] text-white">
        <div className="text-red-300">{err || "Product not found."}</div>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-4 py-2 rounded-lg bg-amber-400 text-black font-semibold"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const price = product.price;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Top bar with a real back action */}
      <section className="border-b border-white/10 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/products"))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm"
          >
            ← Back to Products
          </button>
        </div>
      </section>

      {/* Breadcrumb / Header */}
      <section className="border-b border-white/10 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
          <div className="text-sm text-white/60 flex items-center gap-2">
            <Link to="/" className="hover:text-amber-300">
              Home
            </Link>{" "}
            <span>›</span>
            <Link to="/products" className="hover:text-amber-300">
              Shop
            </Link>{" "}
            <span>›</span>
            <span className="text-white/80">{product.name}</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Product Details
          </h1>
        </div>
      </section>

      {/* Top content: gallery + info */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* GALLERY */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/60">
              <img
                src={mainImg}
                alt={product.name}
                className="w-full h-[420px] object-cover"
                onError={(e) => {
                  // if a thumbnail fails, fall back to placeholder instead of hiding
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setMainImg(src)}
                  className={`h-20 rounded-xl overflow-hidden border ${
                    mainImg === src
                      ? "border-amber-400"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-sm text-white/60">{product.category}</div>
            <h2 className="text-2xl font-bold">{product.name}</h2>

            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} filled={i <= Math.round(product.ratingAvg)} />
                ))}
              </div>
              <div className="text-sm text-white/60">
                {Number(product.ratingAvg).toFixed(1)} ({product.ratingCount} reviews)
              </div>
              {product.inStock ? (
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-300/30">
                  In Stock
                </span>
              ) : (
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-red-500/15 text-red-300 border border-red-300/30">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <div className="text-3xl font-extrabold text-[#F28C28]">{rs(price)}</div>
              {product.compareAt ? (
                <div className="text-white/40 line-through">{rs(product.compareAt)}</div>
              ) : null}
            </div>

            <p className="text-white/80">{product.description}</p>

            {/* Highlights (hard-coded marketing points) */}
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">✔</span> Cold-filtered, unblended quality
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">✔</span> Sourced from sustainable Sri Lankan apiaries
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">✔</span> Great for tea, toast, and skincare DIYs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">✔</span> Lab-tested for purity & moisture
              </li>
            </ul>

            {/* Size / Volume (optional) */}
            {product.sizes.length > 0 && (
              <div>
                <div className="text-sm text-white/70 mb-2">Size / Volume</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSize(s)}
                      className={`px-3 py-1.5 rounded-full text-sm border ${
                        activeSize === s
                          ? "bg-amber-400 text-black border-amber-300"
                          : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + CTA */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="inline-flex items-center rounded-xl overflow-hidden border border-white/10">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10"
                >
                  −
                </button>
                <div className="px-4 py-2 bg-black/60">{qty}</div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10"
                >
                  +
                </button>
              </div>




<div className="flex flex-wrap gap-3 items-center">
  <div className="inline-flex items-center rounded-xl overflow-hidden border border-white/10">
    <button
      onClick={() => setQty((q) => Math.max(1, q - 1))}
      className="px-3 py-2 bg-white/5 hover:bg-white/10"
    >
      −
    </button>
    <div className="px-4 py-2 bg-black/60">{qty}</div>
    <button
      onClick={() => setQty((q) => q + 1)}
      className="px-3 py-2 bg-white/5 hover:bg-white/10"
    >
      +
    </button>
  </div>

  {/* ✅ Corrected Add to Cart */}
  <button
    onClick={handleAddToCart}
    disabled={!product?.inventoryId || (product.inventoryId.stock ?? 0) <= 0}
    className="flex-1 min-w-[180px] px-5 py-3 rounded-xl bg-amber-400 text-black font-semibold hover:brightness-95 disabled:opacity-50"
  >
    Add to Cart
  </button>

  <button className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
    Buy Now
  </button>
</div>


              <button className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10">
                Buy Now
              </button>
            </div>

            {/* Meta */}
            <div className="grid md:grid-cols-3 gap-3 text-sm pt-1">
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-white/60">SKU:</span>{" "}
                <span className="ml-2">{product.sku || "—"}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-white/60">Tags:</span>
                <span className="ml-2 inline-flex flex-wrap gap-2">
                  {product.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-xs"
                    >
                      #{t}
                    </span>
                  ))}
                  {product.tags.length === 0 && <span className="text-white/50">—</span>}
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-3">
                <span className="text-white/60">Share:</span>
                <button className="hover:text-amber-300">🔗</button>
                <button className="hover:text-amber-300">🐦</button>
                <button className="hover:text-amber-300">📘</button>
                <button className="hover:text-amber-300">📸</button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-10" />

        {/* Tabs (description / specs / reviews summary) */}
        <Tabs
          product={{
            description: product.description,
            additional: product.additional,
            rating: product.ratingAvg,
            reviewsCount: product.ratingCount,
          }}
        />

        {/* You may also like (HARD-CODED UI) */}
        <AlsoLike />
      </section>
    </div>
  );
}

/* ---------- Tabs component ---------- */
function Tabs({ product }) {
  const [active, setActive] = useState("Review");

  return (
    <section className="rounded-2xl bg-black/60 border border-white/10 p-5">
      <div className="flex flex-wrap gap-3">
        {["Description", "Additional Information", "Review"].map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-4 py-2 rounded-xl border text-sm ${
              active === t
                ? "bg-amber-400 text-black border-amber-300"
                : "bg-white/5 text-white border-white/10 hover:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "Description" && (
          <div className="prose prose-invert max-w-none">
            <p className="text-white/80">{product.description || "—"}</p>
          </div>
        )}

        {active === "Additional Information" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {(product.additional || []).map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="text-white/60 text-sm">{k}</div>
                <div className="font-medium">{String(v)}</div>
              </div>
            ))}
            {(!product.additional || product.additional.length === 0) && (
              <div className="text-white/60">No additional information.</div>
            )}
          </div>
        )}

        {active === "Review" && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Summary (mock numbers) */}
            <div className="lg:col-span-4 rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-4xl font-bold">
                {Number(product.rating || 0).toFixed(1)}
              </div>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} filled={i <= Math.round(product.rating || 0)} />
                ))}
              </div>
              <div className="text-xs text-white/60 mt-1">
                ({product.reviewsCount || 0} reviews)
              </div>

              <div className="mt-4 space-y-2">
                <RatingBar stars="5" value={82} />
                <RatingBar stars="4" value={12} />
                <RatingBar stars="3" value={4} />
                <RatingBar stars="2" value={1} />
                <RatingBar stars="1" value={1} />
              </div>

              <button className="mt-4 w-full rounded-lg bg-amber-400 text-black font-semibold px-3 py-2 hover:brightness-95">
                Write a review
              </button>
            </div>

            {/* Placeholder for review list */}
            <div className="lg:col-span-8 text-white/75">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="font-semibold">“Floral aroma & smooth texture!”</div>
                <div className="text-sm text-white/60 mt-1">Kristin • 1 month ago</div>
                <p className="mt-2">
                  Absolutely love this product. Tastes amazing and works great in my skincare routine.
                </p>
              </div>
              <div className="mt-3 rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="font-semibold">“Great value for money”</div>
                <div className="text-sm text-white/60 mt-1">Jenny • 2 months ago</div>
                <p className="mt-2">
                  Balanced sweetness, and the packaging feels premium. Will buy again!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Also Like (hard-coded) ---------- */
function AlsoLike() {
  const items = [
    {
      id: "rel-1",
      name: "Forest Reserve Honey",
      category: "Raw Honey",
      price: 1900,
      img: "https://res.cloudinary.com/dxoytbws6/image/upload/v1756686014/Creative_Honey_Label_Trends_jqadqv.jpg",
    },
    {
      id: "rel-2",
      name: "Multi-Floral Honey",
      category: "Raw Honey",
      price: 2050,
      img: "https://res.cloudinary.com/dxoytbws6/image/upload/v1756687256/buns_r9o495.jpg",
    },
    {
      id: "rel-3",
      name: "Cinnamon Infused",
      category: "Infused",
      price: 1450,
      img: "https://res.cloudinary.com/dxoytbws6/image/upload/v1756687289/Candles_Mumlar_yczevq.jpg",
    },
    {
      id: "rel-4",
      name: "Taster Gift Set",
      category: "Gift Sets",
      price: 3200,
      img: "https://res.cloudinary.com/dxoytbws6/image/upload/v1756687326/download_15_hm3cfb.jpg",
    },
  ];

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">You may also like</h3>
        <Link to="/products" className="text-sm text-amber-300 hover:underline">
          Browse all
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map((r) => (
          <article
            key={r.id}
            className="bg-[#111] text-white border border-white/10 rounded-2xl hover:border-amber-400/40 transition"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
              <img
                src={r.img}
                alt={r.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4">
              <div className="text-xs uppercase tracking-wide text-white/60">
                {r.category}
              </div>
              <div className="font-semibold">{r.name}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[#F28C28] font-semibold">{rs(r.price)}</span>
                <Link
                  to={`/product/${r.id}`} // replace with real id when wired
                  className="px-3 py-1.5 rounded-full bg-amber-400 text-black text-sm font-semibold hover:brightness-95"
                >
                  View
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
