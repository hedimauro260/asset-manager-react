import { db } from "../db";
import type { Asset, Tag } from "../../types";
import { AssetType, TagCategory } from "../../types";
import { v4 as uuidv4 } from "uuid";

export async function seedDatabase(): Promise<void> {
  const assetCount = await db.assets.count();
  if (assetCount > 0) {
    console.log("📊 Database already has data, skipping seed");
    return;
  }

  console.log("🌱 Seeding database with system configuration...");

  try {
    // ===== ATIVOS PADRÃO ESSENCIAIS =====
    // Mantemos os ativos base para que o usuário possa selecioná-los ao criar carteiras
    const assets: Asset[] = [
      {
        id: "asset-usd",
        symbol: "USD",
        name: "US Dollar",
        icon: "dollar-sign",
        color: "#10B981",
        type: AssetType.Fiat,
        isFavorite: true,
        description: "United States Dollar",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "asset-brl",
        symbol: "BRL",
        name: "Brazilian Real",
        icon: "dollar-sign",
        color: "#3B82F6",
        type: AssetType.Fiat,
        isFavorite: true,
        description: "Brazilian Real",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "asset-btc",
        symbol: "BTC",
        name: "Bitcoin",
        icon: "bitcoin",
        color: "#F7931A",
        type: AssetType.Crypto,
        isFavorite: true,
        description: "Bitcoin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.assets.bulkAdd(assets);

    // ===== TAGS SISTÊMICAS =====
    const defaultTags: Tag[] = [
      {
        id: uuidv4(),
        name: "Reward",
        category: TagCategory.Reward,
        icon: "gift",
        color: "#10B981",
        isCustom: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Faucet",
        category: TagCategory.Faucet,
        icon: "droplet",
        color: "#06B6D4",
        isCustom: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Trading",
        category: TagCategory.Trading,
        icon: "candlestick-chart",
        color: "#F97316",
        isCustom: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Transfer",
        category: TagCategory.Transfer,
        icon: "arrow-right-left",
        color: "#6B7280",
        isCustom: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Expense",
        category: TagCategory.Expense,
        icon: "shopping-cart",
        color: "#EF4444",
        isCustom: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Investment",
        category: TagCategory.Investment,
        icon: "trending-up",
        color: "#8B5CF6",
        isCustom: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Inbound",
        category: TagCategory.Inbound,
        icon: "arrow-down-to-line",
        color: "#22C55E",
        isCustom: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Outbound",
        category: TagCategory.Outbound,
        icon: "arrow-up-from-line",
        color: "#EF4444",
        isCustom: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Internal",
        category: TagCategory.Internal,
        icon: "arrow-right-left",
        color: "#6B7280",
        isCustom: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.tags.bulkAdd(defaultTags);

    // ===== CONFIGURAÇÕES PADRÃO DO APP =====
    await db.settings.add({
      id: "settings-main",
      theme: "dark",
      currency: "USD",
      language: "pt-BR",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24h",
      decimalPrecision: 2,
      thousandsSeparator: ",",
      decimalSeparator: ".",
      autoBackup: false,
      enableNotifications: true,
      notificationPreferences: {
        largeTransaction: true,
        dailySummary: false,
        weeklyReport: true,
      },
      showBalances: true,
      requireConfirmation: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(
      "✅ System base configuration seeded successfully. Ready for user data.",
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

/**
 * Função utilitária opcional de desenvolvimento para limpar as stores do IndexedDB
 * e forçar uma recarga da aplicação, disparando um novo seed limpo.
 */
export async function clearDatabaseAndReload(): Promise<void> {
  if (import.meta.env.DEV) {
    console.warn("⚠️ Cleardown triggered. Purging database local tables...");
    try {
      await Promise.all([
        db.wallets.clear(),
        db.balances.clear(),
        db.assets.clear(),
        db.transactions.clear(),
        db.tags.clear(),
        db.settings.clear(),
      ]);
      console.log("💾 IndexedDB cleared successfully. Reloading page...");
      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to purge IndexedDB:", err);
    }
  } else {
    console.warn(
      "🚫 Clear operations are strictly prohibited in production builds.",
    );
  }
}
