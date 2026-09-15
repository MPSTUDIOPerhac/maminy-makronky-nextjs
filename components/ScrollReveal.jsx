"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Stejná logika jako "Reveal on scroll" v původním js/main.js —
 * jakémukoliv prvku s třídou "reveal" přidá po vjetí do viewportu
 * třídu "is-visible" (spouští CSS přechod definovaný v globals.css).
 * Mountuje se v root layoutu; protože layout při přechodu mezi
 * stránkami nezaniká, znovu se spustí při každé změně cesty (pathname),
 * ať se najdou i "reveal" prvky na nově zobrazené stránce.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!revealEls.length) return;

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
      return () => io.disconnect();
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }, [pathname]);

  return null;
}
