import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryClient from "@/components/GalleryClient";
import galleryItems from "@/lib/gallery-data";

export const metadata = {
  title: "Galerie — Máminy Makronky",
  description:
    "Galerie makronek Máminy Makronky z Lysé nad Labem — klasické i sezónní příchutě, zakázkové sestavy a dárkové sady.",
};

export default function GaleriePage() {
  return (
    <>
      <Header />

      {/* ===================== PAGE HERO ===================== */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">Domů</a> / Galerie</div>
          <span className="section-label">Galerie</span>
          <h1>Makronky, jak je pečeme</h1>
          <p>Od klasických příchutí po sezónní speciály a zakázkové sestavy na míru.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <GalleryClient items={galleryItems} />
        </div>
      </section>

      {/* ===================== INSTAGRAM CTA ===================== */}
      <section className="insta-band">
        <div className="container reveal">
          <h2>Sledujte náš Instagram</h2>
          <p>Nové příchutě, zákulisí výroby a akce sledujeme jako první právě tam.</p>
          <a
            href="https://www.instagram.com/maminy_makronky/"
            target="_blank"
            rel="noopener"
            className="btn btn-primary"
          >
            Sledovat na Instagramu
          </a>
          <span className="insta-handle">@maminy_makronky</span>
        </div>
      </section>

      <Footer />
    </>
  );
}
