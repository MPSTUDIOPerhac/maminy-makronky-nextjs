# Máminy Makronky — Next.js verze webu

Tohle je stejný web jako předchozí statická verze (HTML/CSS/JS), jen
přepsaný do **Next.js**, aby šel jednoduše nahrát na GitHub a nasadit
přes **Vercel**.

## Co je uvnitř

```
maminy-makronky-nextjs/
├── app/
│   ├── layout.js         → společná kostra stránky (fonty, <head>)
│   ├── globals.css       → veškeré styly (1:1 stejné jako dřívější css/style.css)
│   ├── page.js           → hlavní stránka (hero, příběh, galerie náhled,
│   │                        objednávka na zakázku, prodejna, recenze, Instagram)
│   └── galerie/
│       └── page.js       → podstránka s celou galerií (filtr + lightbox)
├── components/           → React komponenty (menu, hero carousel,
│                            objednávkový formulář, galerie s filtrem…)
├── lib/gallery-data.js   → seznam všech 99 fotek v galerii (kategorie, popisky…)
├── public/images/        → logo, hero bannery a všech 99 fotek z galerie
└── package.json
```

Vizuálně a funkčně je web úplně stejný jako předtím — jen běží na
Next.js, takže ho může hostovat Vercel (nebo jakýkoliv jiný Node.js
hosting) a v budoucnu se dá snadno rozšiřovat.

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

_Pozn.: Pokud nemáš git nainstalovaný nebo nechceš pracovat v
terminálu, GitHub umí nahrání složky i přes web (tlačítko „Add file“ →
„Upload files“ v novém repu) — jen tam pak nahraj úplně všechny soubory
a složky z tohoto balíčku._

## Jak to nasadit na Vercel

1. Jdi na **https://vercel.com** a přihlas se (nejjednodušší je přes GitHub účet).
2. Klikni na **„Add New…“ → „Project“**.
3. Vyber repository `maminy-makronky`, které jsi právě nahrál/a na GitHub.
4. Vercel automaticky pozná, že jde o Next.js projekt — nic není
   potřeba měnit, stačí kliknout **„Deploy“**.
5. Za chvíli dostaneš live odkaz (např. `maminy-makronky.vercel.app`),
   na kterém web běží. Při každém dalším `git push` do `main` větve se
   web na Vercelu automaticky znovu nasadí.
6. V nastavení projektu na Vercelu (**Settings → Domains**) si pak
   můžeš přidat vlastní doménu (např. `maminymakronky.cz`), pokud ji
   vlastníš.

## Kontaktní formulář (sekce „Na zakázku“)

Stejně jako v předchozí verzi je formulář připravený na bezplatnou
službu **Web3Forms**, která pošle poptávku rovnou na e-mail, bez
vlastního serveru.

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
Jakmile budeš mít klíč, klidně mi ho pošli a doplním ho rovnou já.

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
už jsou nahrazené reálnými fotkami — najdeš je v `public/images/`.
Pokud budeš chtít v budoucnu banner vyměnit, stačí nahradit stejnojmenný
soubor v `public/images/` novou fotkou (ideálně podobného poměru stran,
cca 2200×905 px) a případně doladit `background-position` v
`app/globals.css` (třídy `.hero-slide.slide-basic` a `.hero-slide.slide-xmas`).

## Galerie

Galerie (`/galerie`) obsahuje všech **99 reálných fotek** s filtrem
podle kategorie (Klasické příchutě / Sezónní speciály / Zakázkové
sestavy / Prodejna) a lightboxem po kliknutí na dlaždici. Data o fotkách
(soubor, popisek, kategorie, poměr stran) jsou v `lib/gallery-data.js` —
pokud budeš chtít galerii časem doplnit o nové fotky, stačí přidat
soubor do `public/images/photos/` a nový záznam do tohoto souboru.
