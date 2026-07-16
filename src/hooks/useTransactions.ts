// src/hooks/useTransactions.ts
import { useState, useEffect, useCallback } from "react";
import { TransactionRepository } from "../database/repositories";
import { TransactionCalculator } from "../services/calculations/transactionCalculator";
import type {
  Transaction,
  TransactionFilters,
  TransactionMetrics,
} from "../types";

export function useTransactions(filters?: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<TransactionMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Memoizar a função com useCallback
  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const data = await TransactionRepository.getAll(filters);
      setTransactions(data);

      const calculatedMetrics = TransactionCalculator.calculateMetrics(data);
      setMetrics(calculatedMetrics);

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load transactions",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]); // ✅ Incluir filters como dependência

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]); // ✅ Agora loadTransactions é estável

  const addTransaction = useCallback(
    async (
      transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
    ) => {
      await TransactionRepository.create(transaction);
      await loadTransactions();
    },
    [loadTransactions],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      await TransactionRepository.delete(id);
      await loadTransactions();
    },
    [loadTransactions],
  );

  return {
    transactions,
    metrics,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    refresh: loadTransactions,
  };
}
