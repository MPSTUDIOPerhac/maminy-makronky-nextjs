import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Máminy Makronky — Makronkárna Lysá nad Labem",
  description:
    "Poctivé ručně vyráběné makronky z Lysé nad Labem. Na oslavy, ke kávě i jen tak pro radost. Osobní odběr, výroba na zakázku.",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;0,700;1,500&family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
