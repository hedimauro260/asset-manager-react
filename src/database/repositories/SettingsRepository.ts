import { db } from "../db";
import type { Settings, UpdateSettingsDTO } from "../../types";
import { DEFAULT_SETTINGS } from "../../types";

const SETTINGS_ID = "settings-main";

export class SettingsRepository {
  /**
   * Inicializa as configurações padrão se não existirem
   */
  static async initialize(): Promise<Settings> {
    const existing = await db.settings.get(SETTINGS_ID);
    if (existing) return existing;

    const settings: Settings = {
      id: SETTINGS_ID,
      ...DEFAULT_SETTINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.settings.add(settings);
    return settings;
  }

  static async get(): Promise<Settings> {
    const settings = await db.settings.get(SETTINGS_ID);
    if (!settings) {
      return await this.initialize();
    }
    return settings;
  }

  static async update(data: UpdateSettingsDTO): Promise<Settings> {
    await db.settings.update(SETTINGS_ID, {
      ...data,
      updatedAt: new Date(),
    });

    const settings = await db.settings.get(SETTINGS_ID);
    if (!settings) throw new Error("Settings not found after update");
    return settings;
  }

  static async updateTheme(theme: Settings["theme"]): Promise<Settings> {
    return await this.update({ theme });
  }

  static async updateCurrency(currency: string): Promise<Settings> {
    return await this.update({ currency });
  }

  static async updateLanguage(language: string): Promise<Settings> {
    return await this.update({ language });
  }

  static async toggleShowBalances(): Promise<Settings> {
    const settings = await this.get();
    return await this.update({ showBalances: !settings.showBalances });
  }

  static async recordBackup(): Promise<Settings> {
    return await this.update({ lastBackup: new Date() });
  }

  static async reset(): Promise<Settings> {
    await db.settings.delete(SETTINGS_ID);
    return await this.initialize();
  }
}
