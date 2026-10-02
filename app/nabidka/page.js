import Header from "@/components/Header";
import Footer from "@/components/Footer";
import menuItems from "@/content/menu.json";

export const metadata = {
  title: "Nabídka a ceník — Máminy Makronky",
  description:
    "Kompletní nabídka makronek a zákusků Máminy Makronky z Lysé nad Labem — příchutě a ceny.",
};

export default function NabidkaPage() {
  const categories = [];
  for (const item of menuItems) {
    if (!categories.includes(item.category)) categories.push(item.category);
  }

  return (
    <>
      <Header />

      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><a href="/">Domů</a> / Nabídka</div>
          <span className="section-label">Nabídka</span>
          <h1>Co u nás ochutnáte</h1>
          <p>Kompletní přehled příchutí a cen — aktuální nabídka se může podle sezóny mírně měnit.</p>
        </div>
      </section>

      <section>
        <div className="container">
          {menuItems.length === 0 ? (
            <p className="menu-empty">Nabídku zrovna aktualizujeme, mrkněte prosím později.</p>
          ) : (
            categories.map((category) => (
              <div className="menu-category reveal" key={category}>
                <h2>{category}</h2>
                <div className="menu-grid">
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <div className="menu-card" key={item.id}>
                        {item.photo && <img src={item.photo} alt={item.name} loading="lazy" />}
                        <div className="menu-card-body">
                          <div className="menu-card-top">
                            <h3>{item.name}</h3>
                            <span className="menu-card-price">{item.price}</span>
                          </div>
                          {item.flavors && <p className="menu-card-flavors">{item.flavors}</p>}
                          {item.description && <p className="menu-card-desc">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
