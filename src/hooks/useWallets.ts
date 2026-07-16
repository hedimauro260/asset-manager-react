import { useState, useEffect, useCallback } from "react";
import { WalletRepository, BalanceRepository } from "../database/repositories";
import type { Wallet, Balance, WalletFilters } from "../types";
import { mapWalletsToCards, type WalletWithStats } from "../utils/walletMapper";

// Interface explícita para garantir compatibilidade estrita nas importações
export interface UseWalletsReturn {
  wallets: Wallet[];
  balances: Balance[];
  walletCards: WalletWithStats[];
  loading: boolean;
  error: string | null;
  addWallet: (
    wallet: Omit<Wallet, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateWallet: (id: string, updates: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  addBalance: (
    balance: Omit<Balance, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useWallets(filters?: WalletFilters): UseWalletsReturn {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [walletCards, setWalletCards] = useState<WalletWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ loadWallets preservado com useCallback para evitar loops infinitos em outros arquivos
  const loadWallets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [walletsData, balancesData] = await Promise.all([
        WalletRepository.getAll(filters),
        BalanceRepository.getAll(),
      ]);

      setWallets(walletsData);
      setBalances(balancesData);

      // ✅ Processamento reativo dos cards sem mocks, utilizando a função utilitária pura
      const cards = mapWalletsToCards(walletsData, balancesData);
      setWalletCards(cards);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load wallets";
      setError(message);
      console.error("useWallets error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]); // ✅ Mantém filters como única dependência de mutação estrutural

  useEffect(() => {
    loadWallets();
  }, [loadWallets]); // ✅ loadWallets agora é estável e seguro para disparar o efeito

  const addWallet = async (
    wallet: Omit<Wallet, "id" | "createdAt" | "updatedAt">,
  ) => {
    await WalletRepository.create(wallet);
    await loadWallets();
  };

  const updateWallet = async (id: string, updates: Partial<Wallet>) => {
    await WalletRepository.update(id, updates);
    await loadWallets();
  };

  const deleteWallet = async (id: string) => {
    await WalletRepository.delete(id);
    await loadWallets();
  };

  const addBalance = async (
    balance: Omit<Balance, "id" | "createdAt" | "updatedAt">,
  ) => {
    await BalanceRepository.create(balance);
    await loadWallets();
  };

  return {
    wallets,
    balances,
    walletCards,
    loading,
    error,
    addWallet,
    updateWallet,
    deleteWallet,
    addBalance,
    refresh: loadWallets,
  };
}
