"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Přihlášení se nezdařilo.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Něco se nepovedlo, zkus to prosím znovu.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <h1>Administrace webu</h1>
        <p className="admin-hint">Máminy Makronky — zadej prosím heslo pro vstup do administrace.</p>
        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Přihlašuji…" : "Přihlásit se"}
        </button>
      </form>
    </div>
  );
}
