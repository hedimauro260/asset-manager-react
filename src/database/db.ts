import Dexie, { type Table } from "dexie";
import type {
  Asset,
  Wallet,
  Balance,
  Transaction,
  Tag,
  Settings,
} from "../types";

// Estendendo a interface Global Window para tipagem segura do console de debug
declare global {
  interface Window {
    db?: PortfolioDatabase;
  }
}

export class PortfolioDatabase extends Dexie {
  assets!: Table<Asset, string>;
  wallets!: Table<Wallet, string>;
  balances!: Table<Balance, string>;
  transactions!: Table<Transaction, string>;
  tags!: Table<Tag, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super("PortfolioManagerDB");

    this.version(1).stores({
      assets: "id, symbol, name, type, isFavorite, createdAt",
      wallets: "id, name, type, isArchived, createdAt",
      balances: "id, walletId, assetId, amount, lastUpdated",
      transactions:
        "id, type, status, assetId, fromWalletId, toWalletId, date, createdAt",
      tags: "id, name, category, isCustom, usageCount",
      settings: "id, theme, currency, language",
    });

    // Versão 2: Adicionando o índice composto que estava faltando
    this.version(2)
      .stores({
        balances:
          "id, walletId, assetId, [walletId+assetId], amount, lastUpdated",
      })
      .upgrade(() => {
        // Não precisamos migrar dados, apenas adicionar o novo índice
        console.log(
          "✅ Database upgraded to version 2: Added [walletId+assetId] index",
        );
      });
  }
}

export const db = new PortfolioDatabase();

// Helper para debug em ambiente de desenvolvimento (DEV)
if (import.meta.env.DEV) {
  window.db = db;
  console.log("💾 Database instance available safely at window.db");
}
