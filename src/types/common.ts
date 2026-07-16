// Tipos primitivos
export type UUID = string;
export type Timestamp = Date;
export type Currency = string; // 'USD', 'BRL', 'AOA', etc
export type Color = string; // Hex color ou nome de cor Tailwind
export type IconName = string; // Nome do ícone (Lucide)

// Enums como objetos const (erasable)
export const AssetType = {
  Crypto: "crypto",
  Fiat: "fiat",
  Stock: "stock",
  Commodity: "commodity",
  Token: "token",
  Other: "other",
} as const;
export type AssetType = (typeof AssetType)[keyof typeof AssetType];

export const WalletType = {
  Exchange: "exchange",
  Bank: "bank",
  Faucet: "faucet",
  ColdWallet: "cold_wallet",
  HotWallet: "hot_wallet",
  Cash: "cash",
  Other: "other",
} as const;
export type WalletType = (typeof WalletType)[keyof typeof WalletType];

export const TransactionType = {
  Deposit: "deposit",
  Withdraw: "withdraw",
  Transfer: "transfer",
  Buy: "buy",
  Sell: "sell",
  Reward: "reward",
  Adjustment: "adjustment",
  Conversion: "conversion",
  Fee: "fee", // ✅ Adicionar
} as const;
export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionStatus = {
  Pending: "pending",
  Completed: "completed",
  Cancelled: "cancelled",
  Failed: "failed",
} as const;
export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const Theme = {
  Light: "light",
  Dark: "dark",
  System: "system",
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

export const TagCategory = {
  Reward: "reward",
  Mining: "mining",
  Salary: "salary",
  Investment: "investment",
  Gift: "gift",
  Expense: "expense",
  Transfer: "transfer",
  Faucet: "faucet",
  Trading: "trading",
  P2P: "p2p",
  Staking: "staking",
  Airdrop: "airdrop",
  // ===== NOVAS CATEGORIAS =====
  Inbound: "inbound", // Para depósitos/entradas
  Outbound: "outbound", // Para saques/saídas
  Internal: "internal", // Para transferências internas
  Loan: "loan", // Para empréstimos
  Lending: "lending", // Para empréstimos concedidos
  // ===========================
  Other: "other",
} as const;
export type TagCategory = (typeof TagCategory)[keyof typeof TagCategory];

// Interfaces utilitárias
export interface BaseEntity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateDTO {
  id?: never;
  createdAt?: never;
  updatedAt?: never;
}

export interface UpdateDTO {
  id?: never;
  createdAt?: never;
  updatedAt?: never;
}
