import type {
  BaseEntity,
  WalletType,
  Color,
  IconName,
  UUID,
  Timestamp,
} from "./common";

// Entidade principal
export interface Wallet extends BaseEntity {
  name: string; // AirTM, Binance, Trust Wallet
  description?: string; // Descrição opcional
  icon: IconName; // Ícone da wallet
  color: Color; // Cor associada
  type: WalletType; // exchange, bank, faucet, etc
  isArchived: boolean; // Arquivada ou ativa
  notes?: string; // Notas adicionais
}

// DTOs
export type CreateWalletDTO = Omit<Wallet, "id" | "createdAt" | "updatedAt">;

export type UpdateWalletDTO = Partial<
  Omit<Wallet, "id" | "createdAt" | "updatedAt">
>;

// Tipo derivado com saldo calculado
export interface WalletSummary {
  id: UUID;
  name: string;
  icon: IconName;
  color: Color;
  type: WalletType;
  isArchived: boolean;
  totalBalance: number; // Soma de todos os balances
  assetCount: number; // Quantos ativos diferentes
  lastTransaction?: Timestamp;
}

// Filtros
export interface WalletFilters {
  type?: WalletType;
  isArchived?: boolean;
  search?: string;
}
