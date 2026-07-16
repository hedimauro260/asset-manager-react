import { type UUID, type Timestamp } from "./common";

/**
 * Tipos derivados para estatísticas e gráficos.
 * Estes tipos NÃO são persistidos no banco.
 * São calculados sob demanda a partir dos dados reais.
 */

// Resumo do portfolio
export interface PortfolioSummary {
  totalNetWorth: number;
  totalInvested: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  netProfitPercentage: number;
  assetCount: number;
  walletCount: number;
  transactionCount: number;
  lastUpdated: Timestamp;
}

// Resumo por wallet
export interface WalletStatistics {
  walletId: UUID;
  walletName: string;
  totalBalance: number;
  totalValue: number;
  percentage: number; // % do portfolio total
  assetCount: number;
  transactionCount: number;
  profitLoss: number;
  profitLossPercentage: number;
}

// Performance de ativo
export interface AssetPerformance {
  assetId: UUID;
  assetSymbol: string;
  totalAmount: number;
  totalValue: number;
  averageBuyPrice: number;
  currentPrice?: number;
  profitLoss: number;
  profitLossPercentage: number;
  walletCount: number;
  transactionCount: number;
}

// Saldo diário (para gráficos de linha)
export interface DailyBalance {
  date: string; // YYYY-MM-DD
  balance: number;
  profitLoss: number;
  transactionCount: number;
}

// Ponto de gráfico
export interface ChartPoint {
  x: string | number;
  y: number;
  label?: string;
}

// Distribuição de portfolio
export interface PortfolioDistribution {
  assetId: UUID;
  assetSymbol: string;
  value: number;
  percentage: number;
  color: string;
}

// Métricas de transações
export interface TransactionMetrics {
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
  totalBuys: number;
  totalSells: number;
  totalFees: number;
  averageTransactionValue: number;
  largestTransaction: number;
  smallestTransaction: number;
}

// Comparação temporal
export interface PeriodComparison {
  currentPeriod: number;
  previousPeriod: number;
  change: number;
  changePercentage: number;
  trend: "up" | "down" | "stable";
}
