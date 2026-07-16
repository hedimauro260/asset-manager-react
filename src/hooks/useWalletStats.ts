import { useState, useEffect, useCallback } from "react";
import { TransactionRepository } from "../database/repositories";
import { TransactionType } from "../types";

export interface WalletStats {
  totalWallets: number;
  activeWallets: number;
  totalBalance: number;
  totalInflows: number;
  totalOutflows: number;
  inflowChangePercent: number;
  outflowChangePercent: number;
}

export interface UseWalletStatsReturn extends WalletStats {
  loading: boolean;
  error: string | null;
}

export function useWalletStats(
  totalWalletsCount: number,
  activeWalletsCount: number,
  currentTotalBalance: number,
): UseWalletStatsReturn {
  const [stats, setStats] = useState<WalletStats>({
    totalWallets: totalWalletsCount,
    activeWallets: activeWalletsCount,
    totalBalance: currentTotalBalance,
    totalInflows: 0,
    totalOutflows: 0,
    inflowChangePercent: 0,
    outflowChangePercent: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const transactions = await TransactionRepository.getAll();

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      let currentInflows = 0;
      let previousInflows = 0;
      let currentOutflows = 0;
      let previousOutflows = 0;
      let allTimeInflows = 0;
      let allTimeOutflows = 0;

      transactions.forEach((tx) => {
        const txDate = new Date(tx.date);
        const isCurrentPeriod = txDate >= thirtyDaysAgo;
        const isPreviousPeriod =
          txDate >= sixtyDaysAgo && txDate < thirtyDaysAgo;

        // Definindo o que é entrada e saída
        const isInflow =
          tx.type === TransactionType.Deposit ||
          tx.type === TransactionType.Reward;
        const isOutflow = tx.type === TransactionType.Withdraw;

        if (isInflow) {
          allTimeInflows += tx.amount;
          if (isCurrentPeriod) currentInflows += tx.amount;
          if (isPreviousPeriod) previousInflows += tx.amount;
        }

        if (isOutflow) {
          allTimeOutflows += tx.amount;
          if (isCurrentPeriod) currentOutflows += tx.amount;
          if (isPreviousPeriod) previousOutflows += tx.amount;
        }
      });

      // Cálculo seguro de porcentagem (evita divisão por zero)
      const calculatePercentChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      setStats({
        totalWallets: totalWalletsCount,
        activeWallets: activeWalletsCount,
        totalBalance: currentTotalBalance,
        totalInflows: allTimeInflows,
        totalOutflows: allTimeOutflows,
        inflowChangePercent: calculatePercentChange(
          currentInflows,
          previousInflows,
        ),
        outflowChangePercent: calculatePercentChange(
          currentOutflows,
          previousOutflows,
        ),
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to calculate wallet stats";
      setError(message);
      console.error("useWalletStats error:", err);
    } finally {
      setLoading(false);
    }
  }, [totalWalletsCount, activeWalletsCount, currentTotalBalance]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  return { ...stats, loading, error };
}
