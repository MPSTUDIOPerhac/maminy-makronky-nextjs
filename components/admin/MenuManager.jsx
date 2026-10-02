"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";

const emptyForm = { category: "", name: "", price: "", flavors: "", description: "", photo: "" };

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/menu");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      name: item.name,
      price: item.price,
      flavors: item.flavors,
      description: item.description,
      photo: item.photo,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/menu", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Uložení se nezdařilo.");
      await load();
      cancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Opravdu smazat položku „${name}“?`)) return;
    await fetch(`/api/admin/menu?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="admin-panel">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Upravit položku" : "Přidat novou položku do nabídky"}</h3>

        <div className="admin-field">
          <label>Kategorie</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="např. Klasické makronky, Dorty, Na zakázku…"
            required
          />
        </div>

        <div className="admin-row">
          <div className="admin-field">
            <label>Název</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="např. Francouzské makronky"
              required
            />
          </div>
          <div className="admin-field">
            <label>Cena</label>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="např. 45 Kč / ks"
              required
            />
          </div>
        </div>

        <div className="admin-field">
          <label>Příchutě</label>
          <input
            value={form.flavors}
            onChange={(e) => setForm({ ...form, flavors: e.target.value })}
            placeholder="např. Vanilka, malina, pistácie…"
          />
        </div>

        <div className="admin-field">
          <label>Krátký popis (nepovinné)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>

        <ImageUploader
          folder="menu"
          value={form.photo}
          onUploaded={(src) => setForm({ ...form, photo: src })}
        />

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Ukládám…" : editingId ? "Uložit změny" : "Přidat do nabídky"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={cancelEdit}>
              Zrušit úpravu
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        <h3>Aktuální nabídka ({items.length})</h3>
        {loading ? (
          <p>Načítám…</p>
        ) : items.length === 0 ? (
          <p>Zatím žádné položky.</p>
        ) : (
          items.map((item) => (
            <div className="admin-list-item" key={item.id}>
              {item.photo && <img src={item.photo} alt={item.name} />}
              <div className="admin-list-item-info">
                <strong>{item.name}</strong>
                <span>{item.category}</span>
                <span>{item.price}</span>
                {item.flavors && <span className="muted">{item.flavors}</span>}
              </div>
              <div className="admin-list-item-actions">
                <button className="btn btn-outline" onClick={() => startEdit(item)}>
                  Upravit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(item.id, item.name)}>
                  Smazat
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
