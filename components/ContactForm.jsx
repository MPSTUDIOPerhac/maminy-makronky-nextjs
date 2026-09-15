"use client";

import { useRef, useState } from "react";

const WEB3FORMS_KEY = "VLOŽ-SEM-SVŮJ-WEB3FORMS-KLÍČ";

export default function ContactForm() {
  const formRef = useRef(null);
  const [status, setStatus] = useState({ text: "", kind: "" }); // kind: '' | 'ok' | 'err'
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    if (!form.reportValidity()) return;

    setSubmitting(true);
    setStatus({ text: "", kind: "" });

    const data = new FormData(form);
    const accessKey = WEB3FORMS_KEY;
    const placeholder = !accessKey || accessKey.includes("VLOŽ-SEM");

    if (placeholder) {
      await new Promise((r) => setTimeout(r, 700));
      setStatus({
        text: "(Náhled) Formulář zatím není napojený na e-mail — viz README.md → sekce „Kontaktní formulář“.",
        kind: "ok",
      });
      setSubmitting(false);
      return;
    }

    data.append("access_key", accessKey);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (json.success) {
        setStatus({ text: "Díky! Poptávku jsme přijali a ozveme se vám co nejdřív. 💛", kind: "ok" });
        form.reset();
      } else {
        throw new Error(json.message || "Odeslání se nezdařilo");
      }
    } catch (err) {
      setStatus({
        text: "Něco se nepovedlo. Napište nám prosím rovnou na e-mail v patičce stránky.",
        kind: "err",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const statusClass = `form-status${status.kind ? " " + status.kind : ""}`;

  return (
    <div className="order-form">
      <h3>Poptávka na zakázkovou výrobu</h3>
      <p className="hint">Napište nám, co byste si představovali, ozveme se vám zpět na e-mail nebo telefon.</p>

      {/* Formulář odesílá poptávku přímo na e-mail majitelky přes službu
          Web3Forms (bez nutnosti vlastního serveru). Než půjde naostro,
          je potřeba doplnit přístupový klíč — viz README.md. */}
      <form id="order-form" ref={formRef} onSubmit={handleSubmit}>
        <input type="hidden" name="subject" value="Nová poptávka z webu — Máminy Makronky" readOnly />
        <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex="-1" autoComplete="off" />

        <div className="form-row two">
          <div className="field">
            <label htmlFor="name">Jméno a příjmení *</label>
            <input type="text" id="name" name="name" placeholder="Jana Nováková" required />
          </div>
          <div className="field">
            <label htmlFor="email">E-mail *</label>
            <input type="email" id="email" name="email" placeholder="jana@email.cz" required />
          </div>
        </div>

        <div className="form-row two">
          <div className="field">
            <label htmlFor="phone">Telefon</label>
            <input type="tel" id="phone" name="phone" placeholder="+420 777 123 456" />
          </div>
          <div className="field">
            <label htmlFor="date">Termín akce / odběru</label>
            <input type="text" id="date" name="date" placeholder="např. 20. 12. 2026" />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="message">Co si přejete? *</label>
            <textarea id="message" name="message" placeholder="Počet kusů, příležitost, barvy, příchutě…" required></textarea>
          </div>
        </div>

        <label className="form-consent">
          <input type="checkbox" required />
          <span>Souhlasím se zpracováním uvedených údajů za účelem vyřízení poptávky.</span>
        </label>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Odesílám…" : "Odeslat poptávku"}
        </button>
        <p className="form-note">Vyzvednutí pouze osobně na naší prodejně v Lysé nad Labem.</p>
        <p className={statusClass} id="form-status" style={{ display: status.kind ? "block" : "none" }}>
          {status.text}
        </p>
      </form>
    </div>
  );
}
