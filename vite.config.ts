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
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
            purpose: "any maskable",
          },
          {
            src: "android-chrome-192x192.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "any maskable",
          },
          {
            src: "android-chrome-512x512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable",
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
