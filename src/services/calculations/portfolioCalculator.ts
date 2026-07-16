// src/utils/portfolioCalculator.ts
import type { Wallet, Balance, Asset, Transaction } from "../../types";
import { TransactionType } from "../../types";

export interface PortfolioMetrics {
  totalNetWorth: number;
  totalInvested: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  netProfitPercentage: number;
  assetCount: number;
  walletCount: number;
  transactionCount: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
}

export class PortfolioCalculator {
  /**
   * Calcula o patrimônio total baseado nos saldos das wallets
   */
  static calculateNetWorth(
    balances: Balance[],
    assets: Asset[],
    currentPrices: Record<string, number>,
  ): number {
    return balances.reduce((total, balance) => {
      const asset = assets.find((a) => a.id === balance.assetId);
      if (!asset) return total;

      const price = currentPrices[asset.symbol] || 1; // Default 1 para fiat
      return total + balance.amount * price;
    }, 0);
  }

  /**
   * Calcula métricas completas do portfolio
   */
  static calculateMetrics(
    balances: Balance[],
    assets: Asset[],
    transactions: Transaction[],
    currentPrices: Record<string, number>,
  ): PortfolioMetrics {
    const totalNetWorth = this.calculateNetWorth(
      balances,
      assets,
      currentPrices,
    );

    // Calcular total investido (soma de todas as compras)
    const buyTransactions = transactions.filter(
      (t) => t.type === TransactionType.Buy,
    );
    const totalInvested = buyTransactions.reduce((sum, t) => {
      return sum + t.amount * (t.price || 0);
    }, 0);

    // ===== NOVOS CÁLCULOS =====
    // Calcular total de depósitos
    const depositTransactions = transactions.filter(
      (t) => t.type === TransactionType.Deposit,
    );
    const totalDeposits = depositTransactions.reduce((sum, t) => {
      return sum + t.amount;
    }, 0);

    // Calcular total de saques
    const withdrawTransactions = transactions.filter(
      (t) => t.type === TransactionType.Withdraw,
    );
    const totalWithdrawals = withdrawTransactions.reduce((sum, t) => {
      return sum + t.amount;
    }, 0);

    // Calcular total de transferências
    const transferTransactions = transactions.filter(
      (t) => t.type === TransactionType.Transfer,
    );
    const totalTransfers = transferTransactions.reduce((sum, t) => {
      return sum + t.amount;
    }, 0);
    // =========================

    // Calcular lucro/prejuízo baseado em vendas
    const sellTransactions = transactions.filter(
      (t) => t.type === TransactionType.Sell,
    );
    let totalProfit = 0;
    let totalLoss = 0;

    sellTransactions.forEach((tx) => {
      const revenue = tx.amount * (tx.price || 0);
      const avgBuyPrice = this.calculateAverageBuyPrice(
        transactions,
        tx.assetId,
      );
      const cost = tx.amount * avgBuyPrice;

      if (revenue > cost) {
        totalProfit += revenue - cost;
      } else {
        totalLoss += Math.abs(cost - revenue);
      }
    });

    const netProfit = totalProfit - totalLoss;
    const netProfitPercentage =
      totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;

    return {
      totalNetWorth,
      totalInvested,
      totalProfit,
      totalLoss,
      netProfit,
      netProfitPercentage,
      assetCount: assets.length,
      walletCount: new Set(balances.map((b) => b.walletId)).size,
      transactionCount: transactions.length,
      totalDeposits, // ✅ Adicionado
      totalWithdrawals, // ✅ Adicionado
      totalTransfers, // ✅ Adicionado
    };
  }

  /**
   * Calcula preço médio de compra de um ativo
   */
  static calculateAverageBuyPrice(
    transactions: Transaction[],
    assetId: string,
  ): number {
    const buys = transactions.filter(
      (t) => t.assetId === assetId && t.type === TransactionType.Buy,
    );

    if (buys.length === 0) return 0;

    const totalAmount = buys.reduce((sum, t) => sum + t.amount, 0);
    const totalCost = buys.reduce(
      (sum, t) => sum + t.amount * (t.price || 0),
      0,
    );

    return totalAmount > 0 ? totalCost / totalAmount : 0;
  }

  /**
   * Calcula distribuição do portfolio por wallet
   */
  static calculateWalletDistribution(
    balances: Balance[],
    wallets: Wallet[],
    assets: Asset[],
    currentPrices: Record<string, number>,
  ) {
    const totalNetWorth = this.calculateNetWorth(
      balances,
      assets,
      currentPrices,
    );

    return wallets
      .map((wallet) => {
        const walletBalances = balances.filter((b) => b.walletId === wallet.id);
        const walletValue = walletBalances.reduce((sum, balance) => {
          const asset = assets.find((a) => a.id === balance.assetId);
          if (!asset) return sum;
          const price = currentPrices[asset.symbol] || 1;
          return sum + balance.amount * price;
        }, 0);

        const percentage =
          totalNetWorth > 0 ? (walletValue / totalNetWorth) * 100 : 0;

        return {
          wallet,
          value: walletValue,
          percentage,
          balanceCount: walletBalances.length,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * Calcula métricas adicionais para o Dashboard
   */
  static calculateDashboardMetrics(
    balances: Balance[],
    assets: Asset[],
    transactions: Transaction[],
    currentPrices: Record<string, number>,
  ) {
    const metrics = this.calculateMetrics(
      balances,
      assets,
      transactions,
      currentPrices,
    );

    // Calcular crescimento de transações (exemplo: comparar com período anterior)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentTransactions = transactions.filter(
      (t) => new Date(t.date) >= thirtyDaysAgo,
    );
    const previousTransactions = transactions.filter(
      (t) => new Date(t.date) < thirtyDaysAgo,
    );

    const transactionGrowth =
      previousTransactions.length > 0
        ? ((recentTransactions.length - previousTransactions.length) /
            previousTransactions.length) *
          100
        : 0;

    // Calcular income growth (exemplo simplificado)
    const recentDeposits = transactions
      .filter(
        (t) =>
          t.type === TransactionType.Deposit &&
          new Date(t.date) >= thirtyDaysAgo,
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const previousDeposits = transactions
      .filter(
        (t) =>
          t.type === TransactionType.Deposit &&
          new Date(t.date) < thirtyDaysAgo,
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const incomeGrowth =
      previousDeposits > 0
        ? ((recentDeposits - previousDeposits) / previousDeposits) * 100
        : 0;

    return {
      ...metrics,
      transactionGrowth,
      incomeGrowth,
      expenseGrowth: 0, // Calcular baseado em saques
      walletGrowth: 0, // Calcular baseado em novas wallets
      totalIncome: metrics.totalDeposits,
      totalExpenses: metrics.totalWithdrawals,
    };
  }
}
