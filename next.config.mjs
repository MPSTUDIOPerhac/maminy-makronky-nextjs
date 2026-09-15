/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Statické obrázky servírujeme přímo z /public, bez Next.js image optimalizace
    // (zjednodušuje to nasazení a chování je 1:1 stejné jako u původního webu).
    unoptimized: true,
  },
};

export default nextConfig;
