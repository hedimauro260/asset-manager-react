import { useState, useEffect, useCallback } from "react";
import {
  TransactionRepository,
  WalletRepository,
  AssetRepository, // ✅ Importado para buscar as informações dos ativos
} from "../database/repositories";
import type { Transaction, TransactionType, TransactionStatus } from "../types";
import type {
  ActivityRow,
  ActivityType,
  ActivityStatus,
} from "../mocks/activities";

export interface WalletActivityFilters {
  walletId?: string; // undefined = todas
  type?: ActivityType; // undefined = todos
  period?: "7 Days" | "30 Days" | "90 Days" | "All Time";
}

// ✅ Estendendo a estrutura do retorno para suportar todas as propriedades opcionais adicionadas
export interface WalletActivityRow extends ActivityRow {
  assetSymbol?: string;
  website?: string;
  fromWalletName?: string; // ✅ Nova propriedade opcional
  toWalletName?: string; // ✅ Nova propriedade opcional
}

export interface UseWalletActivityReturn {
  activities: WalletActivityRow[]; // ✅ Mantém a lista tipada unificada
  loading: boolean;
  error: string | null;
  filters: WalletActivityFilters;
  setFilters: (filters: WalletActivityFilters) => void;
  refresh: () => Promise<void>;
}

// Mapeamento TransactionType → ActivityType
const mapTransactionType = (type: TransactionType): ActivityType => {
  const typeMap: Record<TransactionType, ActivityType> = {
    deposit: "Deposit",
    withdraw: "Withdraw",
    transfer: "Transfer",
    buy: "Buy",
    sell: "Sell",
    reward: "Deposit", // Rewards aparecem como depósitos
    adjustment: "Edit",
    conversion: "Transfer",
    fee: "Fee",
  };
  return typeMap[type] || "Edit";
};

// Mapeamento TransactionStatus → ActivityStatus
const mapTransactionStatus = (status: TransactionStatus): ActivityStatus => {
  const statusMap: Record<TransactionStatus, ActivityStatus> = {
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    cancelled: "Failed",
  };
  return statusMap[status] || "Completed";
};

// Calcular data de corte baseada no período
const getCutoffDate = (period: string): Date | null => {
  if (period === "All Time") return null;

  const daysMap: Record<string, number> = {
    "7 Days": 7,
    "30 Days": 30,
    "90 Days": 90,
  };

  const days = daysMap[period] || 7;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

// Mapear Transaction → WalletActivityRow com os novos campos de Carteiras, Assets e Website
const mapTransactionToActivity = (
  tx: Transaction,
  walletNames: Map<string, string>,
  assetSymbols: Map<string, string>,
): WalletActivityRow => {
  const activityType = mapTransactionType(tx.type);
  const status = mapTransactionStatus(tx.status);

  // ✅ Descobrir nomes de origem e destino usando o mapa carregado
  const fromWalletName = tx.fromWalletId
    ? walletNames.get(tx.fromWalletId) || "Unknown"
    : undefined;
  const toWalletName = tx.toWalletId
    ? walletNames.get(tx.toWalletId) || "Unknown"
    : undefined;

  let amount = tx.amount;
  let defaultWalletName = "Unknown";

  // ✅ LÓGICA CORRIGIDA PARA ADIÇÃO E REMOÇÃO (ADJUSTMENT)
  if (tx.type === "adjustment") {
    if (tx.fromWalletId) {
      // É uma REMOÇÃO de saldo
      defaultWalletName = fromWalletName || "Unknown";
      amount = -tx.amount; // Força o valor a ser negativo para exibição correta (vermelho)
    } else {
      // É uma ADIÇÃO de saldo
      defaultWalletName = toWalletName || "Unknown";
      // amount já é positivo, mantém como está
    }
  } else if (
    tx.type === "withdraw" ||
    tx.type === "sell" ||
    tx.type === "transfer"
  ) {
    defaultWalletName = fromWalletName || "Unknown";
    if (tx.type === "withdraw" || tx.type === "sell") {
      amount = -tx.amount;
    }
  } else {
    defaultWalletName = toWalletName || "Unknown";
  }

  // Descrição: usa a descrição da transação ou gera uma dinâmica baseada nas carteiras mapeadas
  let description = tx.description || "";
  if (!description) {
    if (tx.type === "transfer" && fromWalletName && toWalletName) {
      description = `From ${fromWalletName} to ${toWalletName}`;
    } else {
      description = `${activityType} transaction`;
    }
  }

  return {
    id: tx.id,
    date: new Date(tx.date),
    walletName: defaultWalletName,
    fromWalletName,
    toWalletName,
    type: activityType,
    description,
    amount,
    status,
    assetSymbol: assetSymbols.get(tx.assetId) || "USD",
    website: tx.reference || undefined,
  };
};

export function useWalletActivity(
  initialFilters?: WalletActivityFilters,
): UseWalletActivityReturn {
  const [filters, setFilters] = useState<WalletActivityFilters>(
    initialFilters || {},
  );
  const [activities, setActivities] = useState<WalletActivityRow[]>([]); // ✅ Utilizando a interface estendida limpa
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar todas as transações, wallets e assets em paralelo no BD
      const [transactions, wallets, assets] = await Promise.all([
        TransactionRepository.getAll(),
        WalletRepository.getAll(),
        AssetRepository.getAll(),
      ]);

      // Criar mapa de IDs → nomes de wallets
      const walletNamesMap = new Map<string, string>();
      wallets.forEach((w) => walletNamesMap.set(w.id, w.name));

      // Criar mapa de IDs → símbolos de assets
      const assetSymbolsMap = new Map<string, string>();
      assets.forEach((a) => assetSymbolsMap.set(a.id, a.symbol));

      // Mapear transações para atividades utilizando ambos os mapas carregados
      let mappedActivities = transactions.map((tx) =>
        mapTransactionToActivity(tx, walletNamesMap, assetSymbolsMap),
      );

      // Aplicar filters no cliente
      const cutoffDate = getCutoffDate(filters.period || "All Time");

      if (cutoffDate) {
        mappedActivities = mappedActivities.filter((a) => a.date >= cutoffDate);
      }

      if (filters.walletId) {
        const walletName = walletNamesMap.get(filters.walletId);
        if (walletName) {
          mappedActivities = mappedActivities.filter(
            (a) => a.walletName === walletName,
          );
        } else {
          mappedActivities = mappedActivities.filter(
            (a) => a.walletName === filters.walletId,
          );
        }
      }

      if (filters.type && filters.type !== "All Types") {
        mappedActivities = mappedActivities.filter(
          (a) => a.type === filters.type,
        );
      }

      // Ordenar por data (mais recente primeiro)
      mappedActivities.sort((a, b) => b.date.getTime() - a.date.getTime());

      setActivities(mappedActivities);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load activities";
      setError(message);
      console.error("useWalletActivity error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    loading,
    error,
    filters,
    setFilters,
    refresh: loadActivities,
  };
}
