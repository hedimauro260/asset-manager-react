import type { BaseEntity, AssetType, Color, IconName, UUID } from "./common";

// Entidade principal
export interface Asset extends BaseEntity {
  symbol: string; // BTC, ETH, USD, BRL
  name: string; // Bitcoin, Ethereum, US Dollar
  icon: IconName; // Nome do ícone Lucide ou emoji
  color: Color; // Cor associada ao ativo
  type: AssetType; // crypto, fiat, stock, etc
  isFavorite: boolean; // Favorito pelo usuário
  description?: string; // Descrição opcional
}

// DTOs para criação e atualização
export type CreateAssetDTO = Omit<Asset, "id" | "createdAt" | "updatedAt">;

export type UpdateAssetDTO = Partial<
  Omit<Asset, "id" | "createdAt" | "updatedAt">
>;

// Tipo derivado para exibição
export interface AssetSummary {
  id: UUID;
  symbol: string;
  name: string;
  icon: IconName;
  color: Color;
  type: AssetType;
  totalBalance: number; // Calculado
  totalValue: number; // Calculado (se tiver preço)
  walletCount: number; // Quantas wallets possuem este ativo
}

// Filtros para busca
export interface AssetFilters {
  type?: AssetType;
  isFavorite?: boolean;
  search?: string;
}
