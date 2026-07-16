import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // Atualiza o app automaticamente quando há uma nova versão
      includeAssets: [
        "favicon.ico",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
      ],
      manifest: {
        name: "Asset Portfolio Manager",
        short_name: "APM",
        description:
          "Personal project built to manage digital assets distributed across multiple wallets.",
        theme_color: "#111827",
        background_color: "#0b1220",
        display: "standalone", // OBRIGATÓRIO para ativar o botão de instalar
        start_url: "/", // OBRIGATÓRIO para o PWA saber por onde começar
        icons: [
          {
            src: "/favicon.ico", // Adicionada a barra inicial
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon", // Removido o purpose problemático
          },
          {
            src: "/android-chrome-192x192.png", // Adicionada a barra inicial
            type: "image/png",
            sizes: "192x192",
            purpose: "any", // Mudado de "any maskable" para "any" para evitar erros se a imagem não for perfeitamente quadrada/preenchida
          },
          {
            src: "/android-chrome-512x512.png", // Adicionada a barra inicial
            type: "image/png",
            sizes: "512x512",
            purpose: "any",
          },
        ],
        screenshots: [
          {
            src: "/screenshot-desktop.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide", // Indica que é para ecrãs de computador
            label: "Home Screen no Computador",
          },
          {
            src: "/screenshot-mobile.png",
            sizes: "390x844",
            type: "image/png",
            form_factor: "narrow", // Indica que é para ecrãs de telemóvel
            label: "Interface Mobile do App",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});
