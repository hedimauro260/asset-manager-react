// src/services/calculations/transactionCalculator.ts
import type { Transaction, TransactionMetrics } from "../../types";

export class TransactionCalculator {
  static calculateMetrics(transactions: Transaction[]): TransactionMetrics {
    if (transactions.length === 0) {
      return {
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalTransfers: 0,
        totalBuys: 0,
        totalSells: 0,
        totalFees: 0,
        averageTransactionValue: 0,
        largestTransaction: 0,
        smallestTransaction: 0,
      };
    }

    // Filtrar por tipo
    const deposits = transactions.filter((t) => t.type === "deposit");
    const withdrawals = transactions.filter((t) => t.type === "withdraw");
    const transfers = transactions.filter((t) => t.type === "transfer");
    const buys = transactions.filter((t) => t.type === "buy");
    const sells = transactions.filter((t) => t.type === "sell");
    const fees = transactions.filter(
      (t) => t.type === "fee" || t.type === "adjustment",
    );

    // Calcular totais
    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
    const totalTransfers = transfers.reduce((sum, t) => sum + t.amount, 0);
    const totalBuys = buys.reduce((sum, t) => sum + t.amount, 0);
    const totalSells = sells.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = fees.reduce((sum, t) => sum + (t.fee || 0), 0);

    // Calcular médias e extremos
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTransactionValue =
      transactions.length > 0 ? totalAmount / transactions.length : 0;

    const amounts = transactions.map((t) => t.amount);
    const largestTransaction = amounts.length > 0 ? Math.max(...amounts) : 0;
    const smallestTransaction = amounts.length > 0 ? Math.min(...amounts) : 0;

    return {
      totalDeposits,
      totalWithdrawals,
      totalTransfers,
      totalBuys,
      totalSells,
      totalFees,
      averageTransactionValue,
      largestTransaction,
      smallestTransaction,
    };
  }
}
