"use client";

import Link from "next/link";
import { useRef } from "react";

export default function Header() {
  const navRef = useRef(null);
  const scrimRef = useRef(null);

  function openNav() {
    navRef.current?.classList.add("is-open");
    scrimRef.current?.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    navRef.current?.classList.remove("is-open");
    scrimRef.current?.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <img src="/images/logo.jpg" alt="Máminy Makronky — logo" />
          <span className="brand-text">
            <strong>Máminy Makronky</strong>
            <span>Makronkárna · Lysá n. Labem</span>
          </span>
        </Link>

        <button className="nav-toggle" aria-label="Otevřít menu" onClick={openNav}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#351324" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <nav className="main-nav" ref={navRef}>
          <button className="nav-close" aria-label="Zavřít menu" onClick={closeNav}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#351324" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
          <Link href="/" onClick={closeNav}>Domů</Link>
          <Link href="/galerie" onClick={closeNav}>Galerie</Link>
          <Link href="/#prodejna" onClick={closeNav}>Prodejna</Link>
          <Link href="/#objednavka" onClick={closeNav}>Objednávka</Link>
          <Link href="/#objednavka" className="btn btn-primary" onClick={closeNav}>Objednat makronky</Link>
        </nav>
        <div className="nav-scrim" ref={scrimRef} onClick={closeNav}></div>
      </div>
    </header>
  );
}
