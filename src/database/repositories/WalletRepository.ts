import { db } from "../db";
import type {
  Wallet,
  CreateWalletDTO,
  UpdateWalletDTO,
  WalletFilters,
  WalletSummary,
} from "../../types";
import { v4 as uuidv4 } from "uuid";

export class WalletRepository {
  static async create(data: CreateWalletDTO): Promise<Wallet> {
    const id = uuidv4();
    const now = new Date();

    const wallet: Wallet = {
      id,
      ...data,
      isArchived: data.isArchived ?? false,
      createdAt: now,
      updatedAt: now,
    };

    await db.wallets.add(wallet);
    return wallet;
  }

  static async getAll(filters?: WalletFilters): Promise<Wallet[]> {
    let collection = db.wallets.toCollection();

    if (filters?.type) {
      collection = db.wallets.where("type").equals(filters.type);
    }

    if (filters?.isArchived !== undefined) {
      const wallets = await collection.toArray();
      return wallets.filter((w) => w.isArchived === filters.isArchived);
    }

    let wallets = await collection.toArray();

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      wallets = wallets.filter((w) => w.name.toLowerCase().includes(query));
    }

    return wallets.sort((a, b) => a.name.localeCompare(b.name));
  }

  static async getActive(): Promise<Wallet[]> {
    return await db.wallets.filter(w => !w.isArchived).toArray();
  }

  static async getArchived(): Promise<Wallet[]> {
    return await db.wallets.filter(w => w.isArchived).toArray();
  }

  static async getById(id: string): Promise<Wallet | undefined> {
    return await db.wallets.get(id);
  }

  static async update(
    id: string,
    data: UpdateWalletDTO,
  ): Promise<Wallet | undefined> {
    await db.wallets.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    return await db.wallets.get(id);
  }

  static async archive(id: string): Promise<void> {
    await db.wallets.update(id, {
      isArchived: true,
      updatedAt: new Date(),
    });
  }

  static async unarchive(id: string): Promise<void> {
    await db.wallets.update(id, {
      isArchived: false,
      updatedAt: new Date(),
    });
  }

  static async delete(id: string): Promise<void> {
    // Verificar integridade referencial
    const balanceCount = await db.balances.where("walletId").equals(id).count();
    if (balanceCount > 0) {
      throw new Error("Cannot delete wallet: it has associated balances");
    }

    const fromTxCount = await db.transactions
      .where("fromWalletId")
      .equals(id)
      .count();
    const toTxCount = await db.transactions
      .where("toWalletId")
      .equals(id)
      .count();
    if (fromTxCount + toTxCount > 0) {
      throw new Error("Cannot delete wallet: it has transaction history");
    }

    await db.wallets.delete(id);
  }

  static async getSummaries(): Promise<WalletSummary[]> {
    const wallets = await db.wallets.toArray();
    const balances = await db.balances.toArray();
    const transactions = await db.transactions.toArray();

    return wallets.map((wallet) => {
      const walletBalances = balances.filter((b) => b.walletId === wallet.id);
      const totalBalance = walletBalances.reduce((sum, b) => sum + b.amount, 0);

      const walletTransactions = transactions.filter(
        (tx) => tx.fromWalletId === wallet.id || tx.toWalletId === wallet.id,
      );

      const lastTransaction =
        walletTransactions.length > 0
          ? walletTransactions.sort(
              (a, b) => b.date.getTime() - a.date.getTime(),
            )[0].date
          : undefined;

      return {
        id: wallet.id,
        name: wallet.name,
        icon: wallet.icon,
        color: wallet.color,
        type: wallet.type,
        isArchived: wallet.isArchived,
        totalBalance,
        assetCount: walletBalances.length,
        lastTransaction,
      };
    });
  }
}
