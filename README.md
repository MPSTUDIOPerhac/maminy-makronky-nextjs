# Máminy Makronky — Next.js verze webu

Web běží na **Next.js**, aby šel jednoduše nahrát na GitHub a nasadit
přes **Vercel**. Obsahuje i jednoduchou **administraci** (`/admin`),
přes kterou si majitel/ka může sám/sama doplňovat nabídku, ceny,
příchutě a fotky — bez nutnosti sahat do kódu.

## Co je uvnitř

```
maminy-makronky-nextjs/
├── app/
│   ├── layout.js           → společná kostra stránky (fonty, <head>)
│   ├── globals.css         → veškeré styly
│   ├── page.js             → hlavní stránka
│   ├── nabidka/page.js     → stránka s nabídkou a ceníkem (čte content/menu.json)
│   ├── galerie/page.js     → galerie fotek (čte content/gallery.json)
│   ├── admin/page.js       → administrace (přihlášení + nástěnka)
│   └── api/admin/…         → serverové funkce, které admin panel používá
├── components/             → React komponenty (menu, hero carousel,
│                              objednávkový formulář, galerie, administrace…)
├── content/
│   ├── menu.json           → nabídka a ceník (admin to upravuje)
│   └── gallery.json        → fotky v galerii (admin to upravuje)
├── lib/
│   ├── contentStore.js     → ukládání obsahu (přes GitHub API, viz níže)
│   └── auth.js             → přihlášení do administrace
├── public/images/          → logo, hero bannery a fotky z galerie/nabídky
└── package.json
```

## Jak to nahrát na GitHub

1. Rozbal tuhle složku někam na disk (pokud jsi dostal/a zip).
2. V terminálu se přepni do složky projektu a spusť:
   ```bash
   git init
   git add .
   git commit -m "Máminy Makronky — Next.js web"
   ```
3. Na GitHubu si vytvoř nové (prázdné) repository, např. `maminy-makronky`.
4. Propoj lokální složku s ním a nahraj kód (GitHub ti přesné příkazy
   ukáže hned po založení repa, budou vypadat takto):
   ```bash
   git remote add origin https://github.com/TVOJE-JMENO/maminy-makronky.git
   git branch -M main
   git push -u origin main
   ```

_Pozn.: Pro nahrání radši použij **GitHub Desktop** (desktop.github.com)
nebo terminálové `git` příkazy výše — webové „Add file → Upload files“
u víc souborů/složek najednou často rozbije strukturu složek a projekt
pak nejde nasadit. GitHub Desktop tenhle problém nemá._

## Jak to nasadit na Vercel

1. Jdi na **https://vercel.com** a přihlas se (nejjednodušší je přes GitHub účet).
2. Klikni na **„Add New…“ → „Project“**.
3. Vyber repository `maminy-makronky`, které jsi právě nahrál/a na GitHub.
4. Vercel automaticky pozná, že jde o Next.js projekt — nic není
   potřeba měnit, stačí kliknout **„Deploy“**.
5. Za chvíli dostaneš live odkaz (např. `maminy-makronky.vercel.app`),
   na kterém web běží. Při každém dalším `git push` do `main` větve (nebo
   při uložení změny přes administraci, viz níže) se web na Vercelu
   automaticky znovu nasadí.
6. V nastavení projektu na Vercelu (**Settings → Domains**) si pak
   můžeš přidat vlastní doménu (např. `maminymakronky.cz`), pokud ji
   vlastníš.

Tenhle web svou velikostí spadá do **bezplatného tarifu Vercelu** —
hosting samotný je tedy zdarma, dokud nejde o extrémně vysokou
návštěvnost. Platit se případně bude jen registrace vlastní domény
(u běžného registrátora, nezávisle na Vercelu).

## Administrace (`/admin`) — nastavení

Administrace umožňuje bez znalosti kódu:
- přidávat/upravovat/mazat položky v **Nabídce a ceníku**,
- přidávat/mazat fotky v **galerii**,
- vše včetně nahrávání fotek přímo z počítače.

Funguje tak, že každá uložená změna založí normální **git commit** do
repozitáře na GitHubu — Vercel si ho všimne a web do cca půl minuty
znovu nasadí s novým obsahem. Žádná vlastní databáze se nikde neběží.

Aby to fungovalo na nasazeném webu (ne jen lokálně u tebe na počítači),
je potřeba na Vercelu nastavit pár proměnných prostředí:

1. **Vytvoř si GitHub Personal Access Token** (jen pro tenhle repozitář):
   - Na GitHubu: `Settings` (tvého účtu, ne repozitáře) → `Developer settings`
     → `Personal access tokens` → `Fine-grained tokens` → `Generate new token`.
   - `Repository access` → `Only select repositories` → vyber `maminy-makronky`.
   - `Permissions` → `Contents` → nastav na **Read and write**.
   - Vygeneruj a **zkopíruj token** (zobrazí se jen jednou).
2. **Na Vercelu** otevři projekt → `Settings` → `Environment Variables` a přidej:
   | Název | Hodnota |
   |---|---|
   | `GITHUB_TOKEN` | token z kroku 1 |
   | `GITHUB_OWNER` | tvoje uživatelské jméno/organizace na GitHubu (např. `MPSTUDIOPerhac`) |
   | `GITHUB_REPO` | název repozitáře (např. `makronky`) |
   | `GITHUB_BRANCH` | `main` |
   | `ADMIN_PASSWORD` | heslo, kterým se bude přihlašovat do `/admin` |
   | `SESSION_SECRET` | libovolný náhodný dlouhý řetězec (jen na podepsání přihlášení) |
3. Po přidání proměnných klikni na **Redeploy** (v záložce Deployments),
   ať se projeví.
4. Administrace pak poběží na `https://TVOJE-DOMENA/admin`.

**Bez těchto proměnných admin panel na Vercelu nebude fungovat** (přihlášení
vrátí chybu, že chybí `ADMIN_PASSWORD`) — je to záměrná pojistka, aby
nešlo omylem nasadit administraci bez hesla.

### Lokální vyzkoušení administrace

Při spuštění `npm run dev` u sebe na počítači bez nastavených `GITHUB_*`
proměnných se admin panel přepne do „lokálního režimu“ — změny se rovnou
zapisují do souborů na disku (`content/menu.json`, `content/gallery.json`,
`public/images/...`), ať si administraci můžeš v klidu vyzkoušet, aniž bys
musel/a mít po ruce GitHub token. Stačí mít nastavené alespoň heslo:

```bash
ADMIN_PASSWORD=test1234 npm run dev
```

## Kontaktní formulář (sekce „Na zakázku“)

Formulář je připravený na bezplatnou službu **Web3Forms**, která pošle
poptávku rovnou na e-mail, bez vlastního serveru.

Nastavení zabere 2 minuty:

1. Jdi na **https://web3forms.com**
2. Zadej e-mail, na který mají poptávky chodit → nepotřebuješ heslo
   ani plnou registraci
3. Přijde ti **Access Key** (dlouhý kód)
4. Otevři soubor `components/ContactForm.jsx` a úplně nahoře najdi řádek:
   ```js
   const WEB3FORMS_KEY = "VLOŽ-SEM-SVŮJ-WEB3FORMS-KLÍČ";
   ```
   a `VLOŽ-SEM-SVŮJ-WEB3FORMS-KLÍČ` nahraď svým klíčem (v uvozovkách).
5. Ulož soubor, nahraj změnu na GitHub (`git add .`, `git commit -m "web3forms klíč"`,
   `git push`) — Vercel web automaticky znovu nasadí s novým klíčem.

Dokud tam klíč nebude, formulář funguje jen „naoko“ (ukáže hlášku, že
zatím není napojený), ať si můžeš vyzkoušet vzhled a validaci polí.

## Co je ještě potřeba doplnit (označeno `TODO` přímo v kódu)

- **Přesná adresa prodejny** (ulice a číslo) — zatím je tam jen „Lysá
  nad Labem" jako placeholder — v `app/page.js` (sekce Prodejna) a v
  `components/Footer.jsx`
- **Odkazy na Facebook a Instagram** — ověř, že sedí přesné URL profilů
  (v `components/Footer.jsx`, `app/page.js` a `app/galerie/page.js`)
- Zkontroluj i kontaktní údaje níže — kdyby mezitím došlo ke změně, dej
  vědět a opravím

## Kontaktní údaje

- **Telefon:** +420 604 550 234
- **E-mail:** maminymakronky@gmail.com
- **IČO:** 07387245
- **Otevírací doba:** Pondělí–Úterý zavřeno, Středa–Neděle 9:00–18:00

## Spuštění lokálně (nepovinné, jen pokud si to chceš vyzkoušet u sebe na počítači)

Potřebuješ mít nainstalovaný [Node.js](https://nodejs.org) (verze 18 nebo novější).

```bash
npm install
npm run dev
```

Web pak poběží na `http://localhost:3000`.

## Hero bannery

Oba bannery v carouselu na homepage (`hero-basic.jpg` a `hero-xmas.jpg`)
jsou reálné fotky — najdeš je v `public/images/`. Pokud budeš chtít
v budoucnu banner vyměnit, stačí nahradit stejnojmenný soubor v
`public/images/` novou fotkou (ideálně podobného poměru stran, cca
2200×905 px) a případně doladit `background-position` v
`app/globals.css` (třídy `.hero-slide.slide-basic` a `.hero-slide.slide-xmas`).

## Nabídka a ceník

Stránka `/nabidka` zobrazuje kompletní nabídku (název, kategorie, cena,
příchutě, popis, fotka) — data jsou v `content/menu.json` a dají se
pohodlně spravovat přes `/admin` (záložka „Nabídka a ceník“), bez
nutnosti upravovat soubor ručně.

## Galerie

Galerie (`/galerie`) obsahuje reálné fotky s filtrem podle kategorie
(Klasické příchutě / Sezónní speciály / Zakázkové sestavy / Prodejna)
a lightboxem po kliknutí na dlaždici. Data o fotkách jsou v
`content/gallery.json` a dají se spravovat přes `/admin` (záložka
„Galerie“) — přidání i smazání fotky, bez nutnosti upravovat soubor
ručně nebo nahrávat fotky zvlášť na GitHub.
