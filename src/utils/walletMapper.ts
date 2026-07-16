import type { Wallet, Balance } from "../types";
//import type { WalletCardProps } from "../components/wallets/WalletCard";

// Paleta de cores para wallets sem cor definida
const WALLET_COLORS = [
  "#8B5CF6", // violet
  "#3B82F6", // blue
  "#06B6D4", // cyan
  "#F97316", // orange
  "#10B981", // emerald
  "#F0B90B", // yellow
  "#EF4444", // red
  "#EC4899", // pink
];

export interface WalletWithStats {
  id: string;
  name: string;
  balance: number;
  percentage: number;
  color: string;
  status: "active" | "inactive";
  isPrimary: boolean;
}

/**
 * Mapeia wallets + balances para o formato do WalletCard
 */
export const mapWalletsToCards = (
  wallets: Wallet[],
  balances: Balance[],
  //colorIndex: Record<string, number> = {},
): WalletWithStats[] => {
  // 1. Calcular saldo total de cada wallet
  const walletBalances = new Map<string, number>();
  balances.forEach((balance) => {
    const current = walletBalances.get(balance.walletId) || 0;
    walletBalances.set(balance.walletId, current + balance.amount);
  });

  // 2. Calcular patrimônio total do portfolio
  const totalPortfolio = Array.from(walletBalances.values()).reduce(
    (sum, balance) => sum + balance,
    0,
  );

  // 3. Encontrar wallet com maior saldo (será a Primary)
  let maxBalance = 0;
  let primaryWalletId: string | null = null;
  walletBalances.forEach((balance, walletId) => {
    if (balance > maxBalance) {
      maxBalance = balance;
      primaryWalletId = walletId;
    }
  });

  // 4. Mapear para o formato final
  return wallets
    .filter((w) => !w.isArchived) // Ocultar wallets arquivadas por padrão
    .map((wallet, index) => {
      const balance = walletBalances.get(wallet.id) || 0;
      const percentage =
        totalPortfolio > 0 ? (balance / totalPortfolio) * 100 : 0;

      // Cor: usa a do wallet se existir, senão gera da paleta
      const color = wallet.color || WALLET_COLORS[index % WALLET_COLORS.length];

      return {
        id: wallet.id,
        name: wallet.name,
        balance,
        percentage,
        color,
        // ✅ Usar as const para garantir os literais
        status: wallet.isArchived ? ("inactive" as const) : ("active" as const),
        isPrimary: wallet.id === primaryWalletId && balance > 0,
      };
    })
    .sort((a, b) => b.balance - a.balance); // Ordenar por saldo decrescente
};
