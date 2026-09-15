import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import OrderSection from "@/components/OrderSection";

const heroSlides = [
  {
    key: "basic",
    className: "slide-basic",
    tag: "🧁 Makronkárna Lysá nad Labem",
    title: "Poctivé ručně vyráběné makronky",
    text: "Sladká tečka ke kávě, na oslavy i jen tak pro radost. Vyrábíme poctivě, v malých dávkách a s láskou k detailu.",
    primaryHref: "#objednavka",
    primaryLabel: "Objednat na zakázku",
    secondaryHref: "#prodejna",
    secondaryLabel: "Navštívit prodejnu",
  },
  {
    key: "xmas",
    className: "slide-xmas",
    tag: "🎄 Vánoční nabídka",
    title: "Makronky od maminky na Vánoce?",
    text: "Voňavé, křupavé a jemné makronky v zimních příchutích — perfektní dárek i sladká tečka pod stromeček pro vaše nejbližší.",
    primaryHref: "#objednavka",
    primaryLabel: "Objednat na Vánoce",
    secondaryHref: "#galerie",
    secondaryLabel: "Prohlédnout galerii",
  },
];

const galleryPreviewTiles = [
  { src: "/images/photos/klasika-vez-cervenobila.jpg", alt: "Věž z makronek v červené a bílé barvě" },
  { src: "/images/photos/klasika-cokoladovy-dort.jpg", alt: "Čokoládový dort s piškotovými kolečky" },
  { src: "/images/photos/zakazka-darkove-krabicky.jpg", alt: "Dárkové krabičky s makronkami a logem Máminy Makronky" },
  { src: "/images/photos/klasika-makronky-ruzove-4.jpg", alt: "Čtyři růžové makronky naskládané na sobě" },
];

export default function HomePage() {
  return (
    <>
      <Header />

      <HeroCarousel slides={heroSlides} />

      {/* ===================== PŘÍBĚH ===================== */}
      <section className="story" id="pribeh">
        <div className="container">
          <div className="story-grid reveal">
            <div className="story-media">
              <img
                src="/images/photos/pribeh-makronky-ruze.jpg"
                alt="Ručně vyráběné makronky Máminy Makronky ozdobené sušenými květy"
                loading="lazy"
              />
            </div>
            <div className="story-text">
              <span className="section-label">Náš příběh</span>
              <h2>Jak vznikla Makronkárna</h2>
              <p>
                Všechno začalo v roce 2020 v obyčejné domácí kuchyni — s troubou, kterou jsme si museli osahat pokus
                po pokusu, a s pevným rozhodnutím, že francouzská makronka nemusí být jen sladkost z cukrárny ve
                velkém městě. Chtěli jsme, aby si i v Lysé nad Labem mohli lidé dopřát makronku, která chutná stejně
                dobře, jako vypadá.
              </p>
              <p>
                Z pár plechů pro rodinu a kamarády se postupně stala malá řemeslná makronkárna s vlastní prodejnou.
                Recepturu jsme ladili měsíce — poměr mandlové mouky, doba stání korpusů, teplota náplně — dokud jsme
                nedosáhli toho, o co nám šlo od začátku: křupavý povrch, jemný vlhký střed a náplň, která chuťově
                nezůstane pozadu za korpusem.
              </p>
              <p>
                Dodnes pečeme v malých dávkách, ručně a bez zbytečných zkratek. Každá makronka, která opustí naši
                kuchyni, je taková, jakou bychom rádi servírovali doma u vlastního stolu.
              </p>
              <p className="story-signature">S láskou (a špetkou perfekcionismu), Máminy Makronky</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== GALERIE (náhled) ===================== */}
      <section className="gallery-preview" id="galerie">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-label">Galerie</span>
            <h2>Nahlédněte k nám do kuchyně</h2>
            <p>Výběr z toho, co u nás vzniká — od klasických příchutí po sezónní speciály.</p>
          </div>
          <div className="gallery-grid reveal">
            {galleryPreviewTiles.map((tile) => (
              <div className="gallery-tile" key={tile.src}>
                <img src={tile.src} alt={tile.alt} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="gallery-cta reveal">
            <a href="/galerie" className="btn btn-outline">Zobrazit celou galerii</a>
          </div>
        </div>
      </section>

      {/* ===================== OBJEDNÁVKA NA ZAKÁZKU ===================== */}
      <section className="order" id="objednavka">
        <div className="container">
          <OrderSection />
        </div>
      </section>

      {/* ===================== PRODEJNA ===================== */}
      <section className="store" id="prodejna">
        <div className="container">
          <div className="store-grid">
            <div className="store-media reveal">
              <img
                src="/images/photos/prodejna-interier.jpg"
                alt="Interiér prodejny Máminy Makronky s posezením"
                loading="lazy"
              />
            </div>
            <div className="reveal">
              <span className="section-label">Prodejna</span>
              <h2>Přijďte na kávu a makronku osobně</h2>
              <p>
                Nejlépe se makronka ochutná čerstvá, přímo u nás v Lysé nad Labem. Zastavte se, poradíme s výběrem a
                rádi vám k tomu uvaříme kávu.
              </p>

              <div className="store-facts">
                <div className="store-fact">
                  <div className="ic">📍</div>
                  <div>
                    <h4>Kde nás najdete</h4>
                    {/* TODO: doplnit přesnou adresu prodejny */}
                    <p>Lysá nad Labem<br />(přesná adresa bude doplněna)</p>
                  </div>
                </div>
                <div className="store-fact">
                  <div className="ic">🕘</div>
                  <div>
                    <h4>Otevírací doba</h4>
                    <table className="store-hours">
                      <tbody>
                        <tr><td>Pondělí – Úterý</td><td>zavřeno</td></tr>
                        <tr><td>Středa – Neděle</td><td>9:00 – 18:00</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <a href="#objednavka" className="btn btn-plum">Domluvit vyzvednutí</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== RECENZE ===================== */}
      <section className="reviews">
        <div className="container">
          <div className="section-head reveal">
            <span className="section-label">Recenze</span>
            <h2>Co říkají spokojení zákazníci</h2>
          </div>
        </div>

        <div className="reviews-track-wrap">
          <div className="reviews-track">
            {[...Array(2)].map((_, dup) => (
              <ReviewCards key={dup} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== INSTAGRAM CTA ===================== */}
      <section className="insta-band">
        <div className="container reveal">
          <h2>Sledujte náš Instagram</h2>
          <p>Nové příchutě, zákulisí výroby a akce sledujeme jako první právě tam.</p>
          {/* TODO: ověřit přesný odkaz na Instagram profil */}
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

      <Footer withKontaktId />
    </>
  );
}

const reviews = [
  {
    text: "Makronky na dceřiny narozeniny byly nejen krásné, ale hlavně skvěle chutnaly. Určitě nebyla poslední objednávka.",
    name: "Petra K.",
    place: "Lysá nad Labem",
  },
  {
    text: "Konečně makronky, které nejsou jen o cukru — cítíte v nich poctivou práci. Vánoční příchutě byly bomba.",
    name: "Martin S.",
    place: "Milovice",
  },
  {
    text: "Objednávala jsem na svatbu a paní majitelka mi ochotně poradila s barvami i příchutěmi. Hosté byli nadšení.",
    name: "Tereza V.",
    place: "Nymburk",
  },
  {
    text: "Prodejna má famózní atmosféru, ke kávě jsme si dali makronku a už se těšíme na další návštěvu.",
    name: "Jakub H.",
    place: "Lysá nad Labem",
  },
  {
    text: "Skvělý dárek pro babičku k narozeninám — krásně zabalené a chuťově famózní.",
    name: "Lucie M.",
    place: "Čelákovice",
  },
];

function ReviewCards() {
  return (
    <>
      {reviews.map((r, i) => (
        <div className="review-card" key={i}>
          <div className="review-stars">★★★★★</div>
          <p>„{r.text}“</p>
          <div className="review-name">
            {r.name}
            <span>{r.place}</span>
          </div>
        </div>
      ))}
    </>
  );
}
