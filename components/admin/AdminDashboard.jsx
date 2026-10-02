"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MenuManager from "@/components/admin/MenuManager";
import GalleryManager from "@/components/admin/GalleryManager";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("menu");

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="admin-wrap">
      <header className="admin-topbar">
        <div>
          <strong>Administrace webu</strong>
          <span className="muted"> — Máminy Makronky</span>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>
          Odhlásit se
        </button>
      </header>

      <nav className="admin-tabs">
        <button className={tab === "menu" ? "is-active" : ""} onClick={() => setTab("menu")}>
          Nabídka a ceník
        </button>
        <button className={tab === "gallery" ? "is-active" : ""} onClick={() => setTab("gallery")}>
          Galerie
        </button>
      </nav>

      <main className="admin-main">
        {tab === "menu" ? <MenuManager /> : <GalleryManager />}
      </main>

      <p className="admin-footnote">
        Změny se po uložení objeví na webu zhruba do jedné minuty (web se na pozadí znovu nasadí).
      </p>
    </div>
  );
}
