"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";

const categories = [
  { key: "klasika", label: "Klasické příchutě" },
  { key: "sezona", label: "Sezónní speciály" },
  { key: "zakazka", label: "Zakázkové sestavy" },
  { key: "prodejna", label: "Prodejna" },
];

const emptyForm = { cat: "klasika", label: "", src: "" };

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.src) {
      setError("Nejdřív prosím nahraj fotku.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Uložení se nezdařilo.");
      await load();
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, label) {
    if (!confirm(`Opravdu smazat fotku „${label}“ z galerie?`)) return;
    await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  const visibleItems = filter === "all" ? items : items.filter((it) => it.cat === filter);

  return (
    <div className="admin-panel">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>Přidat novou fotku do galerie</h3>

        <div className="admin-field">
          <label>Kategorie</label>
          <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label>Popisek fotky</label>
          <input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="např. Letní nanuky"
            required
          />
        </div>

        <ImageUploader
          folder="photos"
          value={form.src}
          onUploaded={(src) => setForm({ ...form, src })}
        />

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Ukládám…" : "Přidat do galerie"}
          </button>
        </div>
      </form>

      <div className="admin-list">
        <div className="admin-list-header">
          <h3>Fotky v galerii ({items.length})</h3>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Všechny kategorie</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Načítám…</p>
        ) : (
          <div className="admin-gallery-grid">
            {visibleItems.map((item) => (
              <div className="admin-gallery-tile" key={item.id}>
                <img src={item.src} alt={item.alt} />
                <div className="admin-gallery-tile-info">
                  <span>{item.label}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id, item.label)}>
                    Smazat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
