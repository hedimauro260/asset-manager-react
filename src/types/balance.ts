import type { BaseEntity, UUID, Timestamp } from "./common";

/**
 * Balance representa a relação entre Wallet e Asset.
 * Uma wallet pode ter múltiplos ativos, cada um com seu próprio saldo.
 *
 * Exemplo:
 * Wallet "Binance" pode ter:
 * - Balance 1: 0.5 BTC
 * - Balance 2: 1000 USDT
 * - Balance 3: 500 USD
 */
export interface Balance extends BaseEntity {
  walletId: UUID; // Qual wallet
  assetId: UUID; // Qual ativo
  amount: number; // Quantidade do ativo
  lockedAmount?: number; // Quantidade bloqueada (em staking, etc)
  availableAmount: number; // amount - lockedAmount
  averageBuyPrice?: number; // Preço médio de compra (calculado)
  lastUpdated: Timestamp; // Última atualização do saldo
}

// DTOs
export type CreateBalanceDTO = Omit<Balance, "id" | "createdAt" | "updatedAt">;

export type UpdateBalanceDTO = Partial<
  Omit<Balance, "id" | "createdAt" | "updatedAt">
>;

// Tipo derivado para exibição
export interface BalanceWithDetails extends Balance {
  walletName: string;
  walletIcon: string;
  assetSymbol: string;
  assetName: string;
  assetIcon: string;
  assetColor: string;
  currentValue?: number; // amount * preço atual
  profitLoss?: number; // Valor atual - valor investido
  profitLossPercentage?: number;
}

// Filtros
export interface BalanceFilters {
  walletId?: UUID;
  assetId?: UUID;
  minAmount?: number;
  maxAmount?: number;
}
