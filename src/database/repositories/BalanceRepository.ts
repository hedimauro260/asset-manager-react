import { db } from "../db";
import type {
  Balance,
  CreateBalanceDTO,
  UpdateBalanceDTO,
  BalanceFilters,
  BalanceWithDetails,
} from "../../types";
import { v4 as uuidv4 } from "uuid";

export class BalanceRepository {
  static async create(data: CreateBalanceDTO): Promise<Balance> {
    const id = uuidv4();
    const now = new Date();

    // Validar existência da wallet e do ativo
    const wallet = await db.wallets.get(data.walletId);
    if (!wallet) throw new Error("Wallet not found");

    const asset = await db.assets.get(data.assetId);
    if (!asset) throw new Error("Asset not found");

    // Verificar se já existe balance para esta combinação wallet+asset
    const existing = await db.balances
      .where("[walletId+assetId]")
      .equals([data.walletId, data.assetId])
      .first();

    if (existing) {
      throw new Error(
        "Balance already exists for this wallet and asset combination",
      );
    }

    const balance: Balance = {
      id,
      ...data,
      availableAmount: data.availableAmount ?? data.amount,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
    };

    await db.balances.add(balance);
    return balance;
  }

  static async getAll(filters?: BalanceFilters): Promise<Balance[]> {
    let balances = await db.balances.toArray();

    if (filters?.walletId) {
      balances = balances.filter((b) => b.walletId === filters.walletId);
    }

    if (filters?.assetId) {
      balances = balances.filter((b) => b.assetId === filters.assetId);
    }

    if (filters?.minAmount !== undefined) {
      balances = balances.filter((b) => b.amount >= filters.minAmount!);
    }

    if (filters?.maxAmount !== undefined) {
      balances = balances.filter((b) => b.amount <= filters.maxAmount!);
    }

    return balances.sort(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime(),
    );
  }

  static async getById(id: string): Promise<Balance | undefined> {
    return await db.balances.get(id);
  }

  static async getByWalletAndAsset(
    walletId: string,
    assetId: string,
  ): Promise<Balance | undefined> {
    return await db.balances
      .where("[walletId+assetId]")
      .equals([walletId, assetId])
      .first();
  }

  static async getByWalletId(walletId: string): Promise<Balance[]> {
    return await db.balances.where("walletId").equals(walletId).toArray();
  }

  static async getByAssetId(assetId: string): Promise<Balance[]> {
    return await db.balances.where("assetId").equals(assetId).toArray();
  }

  static async update(
    id: string,
    data: UpdateBalanceDTO,
  ): Promise<Balance | undefined> {
    await db.balances.update(id, {
      ...data,
      lastUpdated: new Date(),
      updatedAt: new Date(),
    });

    return await db.balances.get(id);
  }

  /**
   * Incrementa o saldo de um balance existente
   */
  static async increment(
    walletId: string,
    assetId: string,
    amount: number,
  ): Promise<Balance> {
    const balance = await this.getByWalletAndAsset(walletId, assetId);

    if (!balance) {
      // Criar novo balance se não existir
      return await this.create({
        walletId,
        assetId,
        amount,
        availableAmount: amount,
        lastUpdated: new Date(),
      });
    }

    const newAmount = balance.amount + amount;
    const newAvailable = balance.availableAmount + amount;

    await db.balances.update(balance.id, {
      amount: newAmount,
      availableAmount: newAvailable,
      lastUpdated: new Date(),
      updatedAt: new Date(),
    });

    return (await db.balances.get(balance.id))!;
  }

  /**
   * Decrementa o saldo de um balance existente
   */
  static async decrement(
    walletId: string,
    assetId: string,
    amount: number,
  ): Promise<Balance> {
    const balance = await this.getByWalletAndAsset(walletId, assetId);

    if (!balance) {
      throw new Error("Balance not found for this wallet and asset");
    }

    if (balance.availableAmount < amount) {
      throw new Error("Insufficient balance");
    }

    const newAmount = balance.amount - amount;
    const newAvailable = balance.availableAmount - amount;

    await db.balances.update(balance.id, {
      amount: newAmount,
      availableAmount: newAvailable,
      lastUpdated: new Date(),
      updatedAt: new Date(),
    });

    return (await db.balances.get(balance.id))!;
  }

  /**
   * Atualiza o preço médio de compra
   */
  static async updateAverageBuyPrice(
    walletId: string,
    assetId: string,
    newAmount: number,
    newPrice: number,
  ): Promise<void> {
    const balance = await this.getByWalletAndAsset(walletId, assetId);
    if (!balance) return;

    const totalInvested =
      (balance.averageBuyPrice ?? 0) * balance.amount + newPrice * newAmount;
    const newTotalAmount = balance.amount + newAmount;
    const newAveragePrice =
      newTotalAmount > 0 ? totalInvested / newTotalAmount : 0;

    await db.balances.update(balance.id, {
      averageBuyPrice: newAveragePrice,
      updatedAt: new Date(),
    });
  }

  static async delete(id: string): Promise<void> {
    await db.balances.delete(id);
  }

  static async deleteByWalletId(walletId: string): Promise<void> {
    const balances = await this.getByWalletId(walletId);
    await db.balances.bulkDelete(balances.map((b) => b.id));
  }

  static async getWithDetails(): Promise<BalanceWithDetails[]> {
    const balances = await db.balances.toArray();
    const wallets = await db.wallets.toArray();
    const assets = await db.assets.toArray();

    return balances.map((balance) => {
      const wallet = wallets.find((w) => w.id === balance.walletId);
      const asset = assets.find((a) => a.id === balance.assetId);

      return {
        ...balance,
        walletName: wallet?.name ?? "Unknown",
        walletIcon: wallet?.icon ?? "wallet",
        assetSymbol: asset?.symbol ?? "???",
        assetName: asset?.name ?? "Unknown",
        assetIcon: asset?.icon ?? "circle",
        assetColor: asset?.color ?? "#6B7280",
      };
    });
  }

  /**
   * Calcula o saldo total de um ativo em todas as wallets
   */
  static async getTotalByAsset(assetId: string): Promise<number> {
    const balances = await this.getByAssetId(assetId);
    return balances.reduce((total, b) => total + b.amount, 0);
  }

  /**
   * Calcula o saldo total de uma wallet (soma de todos os ativos)
   */
  static async getTotalByWallet(walletId: string): Promise<number> {
    const balances = await this.getByWalletId(walletId);
    return balances.reduce((total, b) => total + b.amount, 0);
  }
}
