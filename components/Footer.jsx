import Link from "next/link";
import Year from "@/components/Year";

export default function Footer({ withKontaktId = false }) {
  return (
    <footer className="site-footer" id={withKontaktId ? "kontakt" : undefined}>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src="/images/logo.jpg" alt="Máminy Makronky — logo" />
              <strong>Máminy Makronky</strong>
            </div>
            <p>
              Řemeslná makronkárna v Lysé nad Labem. Poctivé makronky na oslavy, ke kávě i jen tak pro radost — od
              roku 2020.
            </p>
            <div className="social-row">
              {/* TODO: ověřit přesné odkazy na sociální sítě */}
              <a href="https://www.facebook.com/maminymakronky" target="_blank" rel="noopener" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/maminy_makronky/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigace</h4>
            <ul className="footer-links">
              <li><Link href="/">Domů</Link></li>
              <li><Link href="/nabidka">Nabídka</Link></li>
              <li><Link href="/galerie">Galerie</Link></li>
              <li><Link href="/#prodejna">Prodejna</Link></li>
              <li><Link href="/#objednavka">Objednávka na zakázku</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Kontakt</h4>
            <ul className="footer-contact">
              <li>
                <span className="ic">📞</span>
                <a href="tel:+420604550234">+420 604 550 234</a>
              </li>
              <li>
                <span className="ic">✉️</span>
                <a href="mailto:maminymakronky@gmail.com">maminymakronky@gmail.com</a>
              </li>
              <li>
                <span className="ic">📍</span>
                {/* TODO: doplnit přesnou ulici a číslo popisné */}
                <span>Lysá nad Labem<br />(přesná ulice bude doplněna)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© <Year /> Máminy Makronky. Všechna práva vyhrazena.</span>
          <span>IČO: 07387245 · Makronkárna Lysá nad Labem</span>
        </div>
      </div>
    </footer>
  );
}
