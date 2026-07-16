import { type BaseEntity, Theme } from "./common";

/**
 * Settings armazena preferências do usuário.
 * Pode ser expandido no futuro sem quebrar compatibilidade.
 */
export interface Settings extends BaseEntity {
  // Aparência
  theme: Theme;

  // Localização
  currency: string; // Moeda padrão (USD, BRL, AOA)
  language: string; // Idioma (pt-BR, en-US)
  dateFormat: string; // DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
  timeFormat: string; // 12h, 24h

  // Formatação numérica
  decimalPrecision: number; // Casas decimais (2, 4, 6, 8)
  thousandsSeparator: string;
  decimalSeparator: string;

  // Backup
  autoBackup: boolean;
  backupFrequency?: "daily" | "weekly" | "monthly";
  lastBackup?: Date;

  // Notificações
  enableNotifications: boolean;
  notificationPreferences?: {
    largeTransaction?: boolean;
    dailySummary?: boolean;
    weeklyReport?: boolean;
  };

  // Privacidade
  showBalances: boolean; // Mostrar ou ocultar saldos
  requireConfirmation: boolean; // Confirmar antes de deletar
}

// DTOs
export type CreateSettingsDTO = Omit<
  Settings,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateSettingsDTO = Partial<
  Omit<Settings, "id" | "createdAt" | "updatedAt">
>;

// Settings padrão
export const DEFAULT_SETTINGS: Omit<
  Settings,
  "id" | "createdAt" | "updatedAt"
> = {
  theme: Theme.Dark,
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
};
