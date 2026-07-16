import { db } from "../db";
import type {
  Asset,
  CreateAssetDTO,
  UpdateAssetDTO,
  AssetFilters,
  AssetSummary,
} from "../../types";
import { v4 as uuidv4 } from "uuid";

export class AssetRepository {
  static async create(data: CreateAssetDTO): Promise<Asset> {
    const id = uuidv4();
    const now = new Date();

    // Validar se símbolo já existe
    const existing = await db.assets
      .where("symbol")
      .equals(data.symbol)
      .first();
    if (existing) {
      throw new Error(`Asset with symbol "${data.symbol}" already exists`);
    }

    const asset: Asset = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    await db.assets.add(asset);
    return asset;
  }

  static async getAll(filters?: AssetFilters): Promise<Asset[]> {
    let collection = db.assets.toCollection();

    if (filters?.type) {
      collection = db.assets.where("type").equals(filters.type);
    }

    if (filters?.isFavorite !== undefined) {
      const assets = await collection.toArray();
      return assets.filter((a) => a.isFavorite === filters.isFavorite);
    }

    let assets = await collection.toArray();

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      assets = assets.filter(
        (a) =>
          a.symbol.toLowerCase().includes(query) ||
          a.name.toLowerCase().includes(query),
      );
    }

    return assets.sort((a, b) => a.symbol.localeCompare(b.symbol));
  }

  static async getById(id: string): Promise<Asset | undefined> {
    return await db.assets.get(id);
  }

  static async getBySymbol(symbol: string): Promise<Asset | undefined> {
    return await db.assets.where("symbol").equalsIgnoreCase(symbol).first();
  }

  static async update(
    id: string,
    data: UpdateAssetDTO,
  ): Promise<Asset | undefined> {
    // Se estiver mudando o símbolo, validar unicidade
    if (data.symbol) {
      const existing = await db.assets
        .where("symbol")
        .equals(data.symbol)
        .first();
      if (existing && existing.id !== id) {
        throw new Error(`Asset with symbol "${data.symbol}" already exists`);
      }
    }

    await db.assets.update(id, {
      ...data,
      updatedAt: new Date(),
    });

    return await db.assets.get(id);
  }

  static async delete(id: string): Promise<void> {
    // Verificar integridade referencial
    const balanceCount = await db.balances.where("assetId").equals(id).count();
    if (balanceCount > 0) {
      throw new Error("Cannot delete asset: it has associated balances");
    }

    const transactionCount = await db.transactions
      .where("assetId")
      .equals(id)
      .count();
    if (transactionCount > 0) {
      throw new Error("Cannot delete asset: it has associated transactions");
    }

    await db.assets.delete(id);
  }

  static async toggleFavorite(id: string): Promise<void> {
    const asset = await db.assets.get(id);
    if (!asset) throw new Error("Asset not found");

    await db.assets.update(id, {
      isFavorite: !asset.isFavorite,
      updatedAt: new Date(),
    });
  }

  static async getSummaries(): Promise<AssetSummary[]> {
    const assets = await db.assets.toArray();
    const balances = await db.balances.toArray();

    return assets.map((asset) => {
      const assetBalances = balances.filter((b) => b.assetId === asset.id);
      const totalBalance = assetBalances.reduce((sum, b) => sum + b.amount, 0);

      return {
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        icon: asset.icon,
        color: asset.color,
        type: asset.type,
        totalBalance,
        totalValue: 0, // Será calculado com preços
        walletCount: assetBalances.length,
      };
    });
  }
}
