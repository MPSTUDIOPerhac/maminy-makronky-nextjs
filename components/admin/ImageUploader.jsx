"use client";

import { useRef, useState } from "react";

/**
 * Nahrávání fotky — vybere se soubor, rovnou se pošle na server
 * (/api/admin/upload) a výsledná cesta k fotce (src) se předá rodiči
 * přes onUploaded. Zobrazuje náhled a stav nahrávání.
 */
export default function ImageUploader({ folder, value, onUploaded, label = "Fotka" }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Nahrání se nezdařilo.");
      onUploaded(data.src);
    } catch (err) {
      setError(err.message || "Nahrání se nezdařilo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className="admin-uploader">
        {preview ? (
          <img src={preview} alt="Náhled" className="admin-uploader-preview" />
        ) : (
          <div className="admin-uploader-empty">Bez fotky</div>
        )}
        <div>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Nahrávám…" : preview ? "Vyměnit fotku" : "Nahrát fotku"}
          </button>
          {error && <p className="admin-error">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
