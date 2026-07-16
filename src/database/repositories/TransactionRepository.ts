import { db } from "../db";
import type {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilters,
  TransactionWithDetails,
  TransactionGroup,
} from "../../types";
import { TransactionType, TransactionStatus } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class TransactionRepository {
  static async create(data: CreateTransactionDTO): Promise<Transaction> {
    const id = uuidv4();
    const now = new Date();

    // Validações de integridade
    if (data.fromWalletId) {
      const wallet = await db.wallets.get(data.fromWalletId);
      if (!wallet) throw new Error("Source wallet not found");
    }

    if (data.toWalletId) {
      const wallet = await db.wallets.get(data.toWalletId);
      if (!wallet) throw new Error("Destination wallet not found");
    }

    const asset = await db.assets.get(data.assetId);
    if (!asset) throw new Error("Asset not found");

    // Validações específicas por tipo
    if (
      data.type === TransactionType.Transfer &&
      (!data.fromWalletId || !data.toWalletId)
    ) {
      throw new Error("Transfer requires both source and destination wallets");
    }

    if (data.type === TransactionType.Withdraw && !data.fromWalletId) {
      throw new Error("Withdraw requires a source wallet");
    }

    if (data.type === TransactionType.Deposit && !data.toWalletId) {
      throw new Error("Deposit requires a destination wallet");
    }

    const transaction: Transaction = {
      id,
      ...data,
      tags: data.tags ?? [],
      status: data.status ?? TransactionStatus.Completed,
      date: data.date ?? now,
      createdAt: now,
      updatedAt: now,
    };

    await db.transactions.add(transaction);
    return transaction;
  }

  static async getAll(filters?: TransactionFilters): Promise<Transaction[]> {
    let transactions = await db.transactions.toArray();

    // Aplicar filtros
    if (filters?.type) {
      transactions = transactions.filter((tx) => tx.type === filters.type);
    }

    if (filters?.status) {
      transactions = transactions.filter((tx) => tx.status === filters.status);
    }

    if (filters?.assetId) {
      transactions = transactions.filter(
        (tx) => tx.assetId === filters.assetId,
      );
    }

    if (filters?.walletId) {
      transactions = transactions.filter(
        (tx) =>
          tx.fromWalletId === filters.walletId ||
          tx.toWalletId === filters.walletId,
      );
    }

    if (filters?.fromWalletId) {
      transactions = transactions.filter(
        (tx) => tx.fromWalletId === filters.fromWalletId,
      );
    }

    if (filters?.toWalletId) {
      transactions = transactions.filter(
        (tx) => tx.toWalletId === filters.toWalletId,
      );
    }

    if (filters?.tags && filters.tags.length > 0) {
      transactions = transactions.filter((tx) =>
        tx.tags.some((tag) => filters.tags!.includes(tag)),
      );
    }

    if (filters?.startDate) {
      transactions = transactions.filter((tx) => tx.date >= filters.startDate!);
    }

    if (filters?.endDate) {
      transactions = transactions.filter((tx) => tx.date <= filters.endDate!);
    }

    if (filters?.minAmount !== undefined) {
      transactions = transactions.filter(
        (tx) => tx.amount >= filters.minAmount!,
      );
    }

    if (filters?.maxAmount !== undefined) {
      transactions = transactions.filter(
        (tx) => tx.amount <= filters.maxAmount!,
      );
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      transactions = transactions.filter(
        (tx) =>
          tx.description?.toLowerCase().includes(query) ||
          tx.reference?.toLowerCase().includes(query),
      );
    }

    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  static async getById(id: string): Promise<Transaction | undefined> {
    return await db.transactions.get(id);
  }

  static async update(
    id: string,
    data: UpdateTransactionDTO,
  ): Promise<Transaction | undefined> {
    await db.transactions.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    return await db.transactions.get(id);
  }

  static async delete(id: string): Promise<void> {
    await db.transactions.delete(id);
  }

  static async getRecent(limit: number = 10): Promise<Transaction[]> {
    return await db.transactions
      .orderBy("date")
      .reverse()
      .limit(limit)
      .toArray();
  }

  static async getByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Transaction[]> {
    return await db.transactions
      .filter((tx) => tx.date >= startDate && tx.date <= endDate)
      .toArray();
  }

  static async getWithDetails(
    limit?: number,
  ): Promise<TransactionWithDetails[]> {
    let transactions = await db.transactions
      .orderBy("date")
      .reverse()
      .toArray();

    if (limit) {
      transactions = transactions.slice(0, limit);
    }

    const wallets = await db.wallets.toArray();
    const assets = await db.assets.toArray();

    return transactions.map((tx) => {
      const fromWallet = wallets.find((w) => w.id === tx.fromWalletId);
      const toWallet = wallets.find((w) => w.id === tx.toWalletId);
      const asset = assets.find((a) => a.id === tx.assetId);

      return {
        ...tx,
        fromWalletName: fromWallet?.name,
        toWalletName: toWallet?.name,
        assetSymbol: asset?.symbol ?? "???",
        assetName: asset?.name ?? "Unknown",
        assetIcon: asset?.icon ?? "circle",
        assetColor: asset?.color ?? "#6B7280",
      };
    });
  }

  static async groupByDate(
    transactions: Transaction[],
  ): Promise<TransactionGroup[]> {
    const groups: Record<string, TransactionGroup> = {};

    transactions.forEach((tx) => {
      const date = tx.date.toISOString().split("T")[0];
      const key = `${date}-${tx.type}`;

      if (!groups[key]) {
        groups[key] = {
          date,
          type: tx.type,
          count: 0,
          totalAmount: 0,
          totalFees: 0,
          transactions: [],
        };
      }

      groups[key].count++;
      groups[key].totalAmount += tx.amount;
      groups[key].totalFees += tx.fee ?? 0;
      groups[key].transactions.push(tx);
    });

    return Object.values(groups).sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.totalAmount - a.totalAmount;
    });
  }

  static async getTotalByType(type: TransactionType): Promise<number> {
    const transactions = await db.transactions
      .where("type")
      .equals(type)
      .toArray();

    return transactions.reduce((total, tx) => total + tx.amount, 0);
  }

  static async getTotalFees(): Promise<number> {
    const transactions = await db.transactions.toArray();
    return transactions.reduce((total, tx) => total + (tx.fee ?? 0), 0);
  }
}
