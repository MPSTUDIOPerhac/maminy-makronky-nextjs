"use client";

import { useEffect, useRef } from "react";
import ContactForm from "@/components/ContactForm";

const collageTiles = [
  { src: "/images/photos/zakazka-vez-narozeniny-balonky.jpg", alt: "Makronková věž s balonky na narozeninovou oslavu" },
  { src: "/images/photos/zakazka-cupcakes-mercedes.jpg", alt: "Firemní cupcaky s logem na zakázku" },
  { src: "/images/photos/zakazka-vez-oslava.jpg", alt: "Makronková věž na oslavu" },
  { src: "/images/photos/sezona-valentyn-srdce.jpg", alt: "Sezónní makronky zdobené srdíčky" },
  { src: "/images/photos/zakazka-kyticovy-dort.jpg", alt: "Makronková věž zdobená květinovými makronkami" },
  { src: "/images/photos/sezona-valentyn-cokolada-kava.jpg", alt: "Valentýnské dezerty a káva k makronkám" },
];

export default function OrderSection() {
  const collageRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const orderCollage = collageRef.current;
    const orderInfo = infoRef.current;
    if (!orderCollage || !orderInfo) return;

    function syncOrderCollageHeight() {
      if (window.innerWidth >= 980) {
        orderCollage.style.height = "";
        const targetHeight = orderInfo.getBoundingClientRect().height;
        orderCollage.style.height = Math.round(targetHeight) + "px";
      } else {
        orderCollage.style.height = "";
      }
    }

    syncOrderCollageHeight();
    window.addEventListener("load", syncOrderCollageHeight);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncOrderCollageHeight).catch(() => {});
    }
    let resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncOrderCollageHeight, 150);
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("load", syncOrderCollageHeight);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="order-grid">
      <div className="order-collage reveal" ref={collageRef}>
        {collageTiles.map((tile) => (
          <div className="tile" key={tile.src}>
            <img src={tile.src} alt={tile.alt} loading="lazy" />
          </div>
        ))}
      </div>

      <div className="order-info reveal" ref={infoRef}>
        <span className="section-label">Na zakázku</span>
        <h2>Makronky přesně podle vašich představ</h2>
        <p>
          Připravíme vám makronky na svatbu, narozeniny, firemní akci, křtiny nebo jen tak jako originální dárek.
          Poradíme s výběrem příchutí i barevného ladění tak, aby sedělo k příležitosti.
        </p>
        <ul className="order-perks">
          <li>Výběr z klasických i sezónních příchutí</li>
          <li>Barevné a tematické ladění na míru</li>
          <li>Krabičky vhodné i jako dárek</li>
          <li>Zatím pouze osobní vyzvednutí v Lysé nad Labem</li>
        </ul>

        <ContactForm />
      </div>
    </div>
  );
}
