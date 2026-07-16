// src/mocks/transactions.ts
import type { TransactionWithDetails } from "../types";
import { TagCategory } from "../types/common";

// Função helper para criar datas
const now = new Date();
const oneHourAgo = new Date(now.getTime() - 3600000);
const twoHoursAgo = new Date(now.getTime() - 7200000);
const oneDayAgo = new Date(now.getTime() - 86400000);

export const MOCK_TRANSACTIONS: TransactionWithDetails[] = [
  {
    id: "tx-101",
    type: "deposit",
    status: "completed",
    amount: 2500.0,
    toWalletId: "wallet-main-uuid",
    toWalletName: "Carteira Principal",
    assetId: "asset-usdt-uuid",
    assetSymbol: "USDT",
    assetName: "Tether",
    assetIcon: "usdt-icon-url",
    assetColor: "#26A17B",
    tags: [TagCategory.Inbound],
    date: oneHourAgo,
    createdAt: oneHourAgo,
    updatedAt: oneHourAgo,
  },
  {
    id: "tx-102",
    type: "transfer",
    status: "completed",
    amount: 350.0,
    fromWalletId: "wallet-main-uuid",
    fromWalletName: "Carteira Principal",
    toWalletId: "wallet-savings-uuid",
    toWalletName: "Reserva de Emergência",
    assetId: "asset-btc-uuid",
    assetSymbol: "BTC",
    assetName: "Bitcoin",
    assetIcon: "btc-icon-url",
    assetColor: "#F7931A",
    tags: [TagCategory.Internal],
    date: twoHoursAgo,
    createdAt: twoHoursAgo,
    updatedAt: twoHoursAgo,
  },
  {
    id: "tx-103",
    type: "withdraw",
    status: "pending",
    amount: 120.5,
    fromWalletId: "wallet-savings-uuid",
    fromWalletName: "Reserva de Emergência",
    assetId: "asset-usdc-uuid",
    assetSymbol: "USDC",
    assetName: "USD Coin",
    assetIcon: "usdc-icon-url",
    assetColor: "#2775CA",
    tags: [TagCategory.Outbound],
    date: oneDayAgo,
    createdAt: oneDayAgo,
    updatedAt: oneDayAgo,
  },
];
