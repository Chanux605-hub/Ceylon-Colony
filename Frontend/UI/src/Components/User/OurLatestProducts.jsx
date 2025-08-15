// src/components/LatestProducts.jsx
import React, { useRef } from "react";

// helper to resolve files from src/assets (adjust depth if needed)
const asset = (file) => new URL(`../assets/${file}`, import.meta.url).href;

const products = [
  { id: 1, name: "Wildflower Honey", weight: "350g", price: "Rs 1,200", img:  asset("jar.jpeg") },
  { id: 2, name: "Cinnamon Infused",  weight: "350g", price: "Rs 1,450", img: "../../assets.jar.jpeg" },
  { id: 3, name: "Lime Blossom",      weight: "350g", price: "Rs 1,350", img: "/images/honey3.jpg" },
  { id: 4, name: "Forest Honey",      weight: "500g", price: "Rs 1,900", img: "/images/honey4.jpg" },
  { id: 5, name: "Organic Raw",       weight: "350g", price: "Rs 1,600", img: "/images/honey5.jpg" },
  { id: 6, name: "Multi-Floral",      weight: "500g", price: "Rs 2,050", img: "/images/honey6.jpg" },
  { id: 7, name: "Bee Pollen Honey",  weight: "250g", price: "Rs 1,150", img: "/images/honey7.jpg" },
  { id: 8, name: "Ginger Infused",    weight: "350g", price: "Rs 1,480", img: "/images/honey8.jpg" },
];

export default function LatestProducts() {
  const scrollerRef = useRef(null);
  const scroll = (dir) =>
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <>
      {/* Hide horizontal scrollbar (scoped CSS) */}
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE/Edge */
          scrollbar-width: none;     /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar { /* Chrome/Safari/Edge */
          width: 0;
          height: 0;
        }
      `}</style>

      <section className="relative bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#F28C28]">
                Products
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">Our latest products</h2>
              <p className="mt-2 text-white/70 text-sm">
                Fresh from our beekeepers — small batches, big flavor.
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <ArrowBtn onClick={() => scroll(-1)} dir="left" />
              <ArrowBtn onClick={() => scroll(1)} dir="right" />
            </div>
          </div>

          {/* Scroller */}
          <div className="relative mt-8">
            {/* fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[#1A1A1A] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#1A1A1A] to-transparent" />

            <div
              ref={scrollerRef}
              className="no-scrollbar overflow-x-auto snap-x snap-mandatory scroll-smooth"
            >
              <div className="flex gap-5 pr-6">
                {products.map((p) => (
                  <article
                    key={p.id}
                    className="snap-start shrink-0 w-[260px] bg-[#111111] border border-white/10 rounded-2xl hover:border-[#FBB01A]/40 transition"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-white/70 text-sm">{p.weight}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[#F28C28] font-semibold">{p.price}</span>
                        <button className="rounded-full bg-[#FBB01A] text-black px-3 py-1.5 text-sm font-semibold hover:opacity-90">
                          Add
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* mobile arrows */}
            <div className="mt-6 flex md:hidden justify-center gap-3">
              <ArrowBtn onClick={() => scroll(-1)} dir="left" />
              <ArrowBtn onClick={() => scroll(1)} dir="right" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ArrowBtn({ onClick, dir }) {
  const isLeft = dir === "left";
  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? "Scroll left" : "Scroll right"}
      className="h-10 w-10 grid place-items-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
    >
      {/* inline SVG so no icon library needed */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFF">
        {isLeft ? (
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        ) : (
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        )}
      </svg>
    </button>
  );
}
