import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { seedDatabase } from "./database/seeds/initialData";
import { TagRepository } from "./database/repositories/TagRepository";
import { SettingsRepository } from "./database/repositories/SettingsRepository";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

// Inicializar dados padrão
async function initializeApp() {
  try {
    await seedDatabase();
    await TagRepository.initializeDefaults();
    await SettingsRepository.initialize();
    console.log("✅ Application initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
  }
}

initializeApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
      <SpeedInsights />
    </HelmetProvider>
    <Analytics />
  </StrictMode>,
);
