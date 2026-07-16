import type {
  BaseEntity,
  TransactionType,
  TransactionStatus,
  TagCategory,
  UUID,
  Timestamp,
} from "./common";

export type { TransactionType, TransactionStatus } from "./common";

// Entidade principal
export interface Transaction extends BaseEntity {
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  price?: number; // Preço unitário (para buy/sell)
  fee?: number; // Taxa da transação
  totalValue?: number; // amount * price (calculado)

  // Relacionamentos
  fromWalletId?: UUID; // Origem (transfer/withdraw/sell)
  toWalletId?: UUID; // Destino (transfer/deposit/buy)
  assetId: UUID; // Qual ativo

  // Metadados
  description?: string;
  reference?: string; // ID externo ou referência
  tags: TagCategory[]; // Categorias/tags
  date: Timestamp; // Data da transação (pode ser diferente de createdAt)

  // Dados adicionais (flexível)
  metadata?: Record<string, unknown>;
}

// DTOs
export type CreateTransactionDTO = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateTransactionDTO = Partial<
  Omit<Transaction, "id" | "createdAt" | "updatedAt">
>;

// Tipo derivado para exibição
export interface TransactionWithDetails extends Transaction {
  fromWalletName?: string;
  toWalletName?: string;
  assetSymbol: string;
  assetName: string;
  assetIcon: string;
  assetColor: string;
}

// Filtros avançados
export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  assetId?: UUID;
  walletId?: UUID; // Busca em fromWalletId E toWalletId
  fromWalletId?: UUID;
  toWalletId?: UUID;
  tags?: TagCategory[];
  startDate?: Timestamp;
  endDate?: Timestamp;
  minAmount?: number;
  maxAmount?: number;
  search?: string; // Busca em description e reference
}

// Agrupamento para relatórios
export interface TransactionGroup {
  date: string; // YYYY-MM-DD
  type: TransactionType;
  count: number;
  totalAmount: number;
  totalFees: number;
  transactions: Transaction[];
}
