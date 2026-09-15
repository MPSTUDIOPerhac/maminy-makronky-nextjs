"use client";

import { useEffect, useState } from "react";

const filters = [
  { key: "all", label: "Vše" },
  { key: "klasika", label: "Klasické příchutě" },
  { key: "sezona", label: "Sezónní speciály" },
  { key: "zakazka", label: "Zakázkové sestavy" },
  { key: "prodejna", label: "Prodejna" },
];

export default function GalleryClient({ items }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);

  function openLightbox(item) {
    setLightboxItem(item);
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    setLightboxItem(null);
    document.body.style.overflow = "";
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") closeLightbox();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div className="filter-row reveal">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-btn${activeFilter === f.key ? " is-active" : ""}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="masonry">
        {items.map((item, i) => {
          const show = activeFilter === "all" || item.cat === activeFilter;
          return (
            <div
              key={item.src + i}
              className="masonry-item"
              data-cat={item.cat}
              data-label={item.label}
              style={{ "--ar": item.ar, display: show ? "" : "none" }}
              onClick={() => openLightbox(item)}
            >
              <img src={item.src} alt={item.alt} loading="lazy" />
              <span className="caption">{item.caption}</span>
            </div>
          );
        })}
      </div>

      <div className={`lightbox${lightboxItem ? " is-open" : ""}`} onClick={(e) => {
        if (e.target.classList.contains("lightbox") || e.target.closest(".lightbox-close")) {
          closeLightbox();
        }
      }}>
        <div className="lightbox-box">
          {lightboxItem && (
            <>
              <button className="lightbox-close" aria-label="Zavřít" onClick={closeLightbox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>
              <img src={lightboxItem.src} alt={lightboxItem.alt} />
              <div className="lb-label">{lightboxItem.label}</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
