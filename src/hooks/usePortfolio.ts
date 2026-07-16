import { useState, useEffect } from "react";
import {
  AssetRepository,
  WalletRepository,
  BalanceRepository,
  TransactionRepository,
} from "../database/repositories";
import { PortfolioCalculator } from "../services/calculations/portfolioCalculator";
import type { PortfolioMetrics, Wallet, Balance, Asset } from "../types";

export function usePortfolio() {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const [balancesData, walletsData, assetsData, transactionsData] =
        await Promise.all([
          BalanceRepository.getAll(),
          WalletRepository.getActive(),
          AssetRepository.getAll(),
          TransactionRepository.getAll(),
        ]);

      setBalances(balancesData);
      setWallets(walletsData);
      setAssets(assetsData);

      // Mock prices - em produção, buscar de uma API
      const mockPrices: Record<string, number> = {
        USD: 1,
        BRL: 0.2,
        BTC: 50000,
        ETH: 3000,
      };

      const calculatedMetrics = PortfolioCalculator.calculateMetrics(
        balancesData,
        assetsData,
        transactionsData,
        mockPrices,
      );

      setMetrics(calculatedMetrics);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refresh = () => loadData();

  return {
    metrics,
    balances,
    wallets,
    assets,
    loading,
    error,
    refresh,
  };
}
