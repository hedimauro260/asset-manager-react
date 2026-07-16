import React, { useState, useMemo } from 'react';
import {
    Plus,
    ArrowRightLeft,
    TrendingUp,
    TrendingDown,
    ArrowLeftRight,
    ShieldCheck,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout/DashboardLayout';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { ActionButtons } from '../components/dashboard/ActionButtons';
import { PortfolioDistribution } from '../components/dashboard/PortfolioDistribution';
import { PortfolioChart } from '../components/dashboard/PortfolioChart';
import { TransactionTable } from '../components/dashboard/TransactionTable';
import { StatCard } from '../components/dashboard/StatCard';

// Modais
import { AddFundsModal } from '../components/modals/AddFundsModal/AddFundsModal';
import { TransferModal } from '../components/modals/TransferModal/TransferModal';
import { WithdrawModal } from '../components/modals/WithdrawModal/WithdrawModal';

// UI Feedback
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';

// Hooks
import { usePortfolio } from '../hooks/usePortfolio';
import { useTransactions } from '../hooks/useTransactions';
import { useWallets } from '../hooks/useWallets';
//import { useAssets } from '../hooks/useAssets';

// Repositórios e Tipos
import { TransactionRepository, BalanceRepository, AssetRepository } from '../database/repositories';
import { TransactionType, TransactionStatus, TagCategory } from '../types';
import type { TransactionWithDetails } from '../types/transaction';

export const Dashboard: React.FC = () => {
    // Estado dos modais
    const [addFundsOpen, setAddFundsOpen] = useState(false);
    const [transferOpen, setTransferOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);

    // Sistema de Toast
    const { toasts, removeToast, success, error: showError } = useToast();

    // Hooks de dados reais
    const {
        metrics,
        balances,
        wallets,
        assets,
        loading: portfolioLoading,
        error: portfolioError,
        refresh: refreshPortfolio
    } = usePortfolio();

    const {
        transactions: rawTransactions,
        loading: transactionsLoading,
        refresh: refreshTransactions
    } = useTransactions();

    const {
        wallets: allWallets,
        refresh: refreshWallets
    } = useWallets();

    // ===== DADOS DERIVADOS =====
    const transactions: TransactionWithDetails[] = useMemo(() => {
        if (!rawTransactions || rawTransactions.length === 0) return [];
        return rawTransactions.map((tx) => {
            const fromWallet = allWallets.find(w => w.id === tx.fromWalletId);
            const toWallet = allWallets.find(w => w.id === tx.toWalletId);
            const asset = assets.find(a => a.id === tx.assetId);
            return {
                ...tx,
                fromWalletName: fromWallet?.name,
                toWalletName: toWallet?.name,
                assetSymbol: asset?.symbol || 'USD', // ← Garante que sempre tenha um símbolo
                assetName: asset?.name || 'Unknown',
                assetIcon: asset?.icon || 'circle',
                assetColor: asset?.color || '#6B7280'
            };
        });
    }, [rawTransactions, allWallets, assets]);

    const sparklineData = useMemo(() => {
        const baseValue = metrics?.totalNetWorth || 0;
        return Array.from({ length: 20 }, (_, i) => ({
            value: baseValue * (0.85 + Math.random() * 0.3 + (i * 0.008))
        }));
    }, [metrics?.totalNetWorth]);

    const chartData = useMemo(() => {
        const currentValue = metrics?.totalNetWorth || 0;
        const days = ['Jul 04', 'Jul 05', 'Jul 06', 'Jul 07', 'Jul 08', 'Jul 09', 'Jul 10'];
        return days.map((date, i) => ({
            date,
            value: i === 6 ? currentValue : currentValue * (0.7 + (i / 6) * 0.3)
        }));
    }, [metrics?.totalNetWorth]);

    const walletDistribution = useMemo(() => {
        const totalNetWorth = metrics?.totalNetWorth || 0;
        const colors = ['#8B5CF6', '#3B82F6', '#06B6D4', '#F97316', '#10B981'];
        if (!wallets || wallets.length === 0) return [];

        return wallets.map((wallet, index) => {
            const walletBalances = balances.filter(b => b.walletId === wallet.id);
            const totalBalance = walletBalances.reduce((sum, b) => sum + b.amount, 0);
            const percentage = totalNetWorth > 0 ? (totalBalance / totalNetWorth) * 100 : 0;

            return {
                id: wallet.id,
                name: wallet.name,
                balance: totalBalance,
                percentage,
                color: wallet.color || colors[index % colors.length]
            };
        });
    }, [wallets, balances, metrics?.totalNetWorth]);

    const walletOptions = useMemo(() => {
        if (!wallets || wallets.length === 0) return [];
        return wallets.map(w => {
            const walletBalances = balances.filter(b => b.walletId === w.id);
            const totalBalance = walletBalances.reduce((sum, b) => sum + b.amount, 0);
            return { id: w.id, name: w.name, balance: totalBalance };
        });
    }, [wallets, balances]);

    // ===== HANDLERS COM TOAST E LOGS DE RASTREAMENTO =====
    const refreshAll = async () => {
        await Promise.all([refreshPortfolio(), refreshTransactions(), refreshWallets()]);
    };

    const handleAddFunds = async (data: { walletId: string; assetId: string; amount: number; description?: string; website?: string; date: Date; }) => {
        try {
            console.log('🚀 [Dashboard] Iniciando handleAddFunds:', data);
            const balance = balances.find(b => b.walletId === data.walletId);
            let assetId = balance?.assetId;

            if (!assetId) {
                console.log('⚠️ [Dashboard] Wallet sem assetId, buscando USD padrão...');
                const defaultAsset = await AssetRepository.getBySymbol('USD');
                if (!defaultAsset) throw new Error('No default asset available');
                assetId = defaultAsset.id;
                await BalanceRepository.create({
                    walletId: data.walletId,
                    assetId,
                    amount: data.amount,
                    availableAmount: data.amount,
                    lastUpdated: new Date()
                });
            } else {
                console.log('✅ [Dashboard] Incrementando saldo existente...');
                await BalanceRepository.increment(data.walletId, assetId, data.amount);
            }

            console.log('✅ [Dashboard] Criando registro de transação de depósito...');
            await TransactionRepository.create({
                type: TransactionType.Deposit,
                status: TransactionStatus.Completed,
                amount: data.amount,
                toWalletId: data.walletId,
                assetId,
                description: data.description,
                reference: data.website?.trim() || undefined,
                tags: [TagCategory.Reward],
                date: data.date
            });

            console.log('🎉 [Dashboard] Depósito concluído com sucesso! Disparando Toast e Refresh...');
            success('Funds Added', `Successfully added $${data.amount.toFixed(2)}`);
            await refreshAll();
        } catch (err) {
            console.error('🔴 [Dashboard] Erro crítico no handleAddFunds:', err);
            showError('Failed to Add Funds', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    };

    const handleTransfer = async (data: { fromWalletId: string; toWalletId: string; assetId: string; amount: number; description?: string; website?: string; date: Date }) => {
        try {
            console.log('🚀 [Dashboard] Iniciando handleTransfer:', data);
            if (data.fromWalletId === data.toWalletId) {
                throw new Error('Cannot transfer to the same wallet');
            }

            const fromBalance = balances.find(b => b.walletId === data.fromWalletId);
            if (!fromBalance) throw new Error('Source wallet has no balance record');

            if (fromBalance.availableAmount < data.amount) {
                throw new Error('Insufficient balance in source wallet');
            }

            console.log('✅ [Dashboard] Decrementando saldo da origem...');
            await BalanceRepository.decrement(data.fromWalletId, fromBalance.assetId, data.amount);

            console.log('🔍 [Dashboard] Buscando registro de saldo no destino...');
            const toBalance = balances.find(b => b.walletId === data.toWalletId);
            if (toBalance && toBalance.assetId === fromBalance.assetId) {
                console.log('✅ [Dashboard] Destino possui o mesmo ativo. Incrementando saldo...');
                await BalanceRepository.increment(data.toWalletId, toBalance.assetId, data.amount);
            } else {
                console.log('⚠️ [Dashboard] Destino sem saldo desse ativo. Criando nova relação de saldo...');
                await BalanceRepository.create({
                    walletId: data.toWalletId,
                    assetId: fromBalance.assetId,
                    amount: data.amount,
                    availableAmount: data.amount,
                    lastUpdated: new Date()
                });
            }

            console.log('✅ [Dashboard] Criando registro de transação de transferência...');
            await TransactionRepository.create({
                type: TransactionType.Transfer,
                status: TransactionStatus.Completed,
                amount: data.amount,
                fromWalletId: data.fromWalletId,
                toWalletId: data.toWalletId,
                assetId: fromBalance.assetId,
                description: data.description,
                reference: data.website?.trim() || undefined,
                tags: [TagCategory.Transfer],
                date: data.date
            });

            console.log('🎉 [Dashboard] Transferência concluída com sucesso! Disparando Toast e Refresh...');
            success('Transfer Complete', `Successfully transferred $${data.amount.toFixed(2)}`);
            await refreshAll();
        } catch (err) {
            console.error('🔴 [Dashboard] Erro crítico no handleTransfer:', err);
            showError('Failed to Transfer', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    };

    const handleWithdraw = async (data: { walletId: string; assetId: string; amount: number; description?: string; website?: string; date: Date }) => {
        try {
            console.log('🚀 [Dashboard] Iniciando handleWithdraw:', data);
            const balance = balances.find(b => b.walletId === data.walletId);
            if (!balance) throw new Error('Wallet has no balance record');

            if (balance.availableAmount < data.amount) {
                throw new Error('Insufficient balance');
            }

            console.log('✅ [Dashboard] Decrementando saldo da carteira...');
            await BalanceRepository.decrement(data.walletId, balance.assetId, data.amount);

            console.log('✅ [Dashboard] Criando registro de transação de saque...');
            await TransactionRepository.create({
                type: TransactionType.Withdraw,
                status: TransactionStatus.Completed,
                amount: data.amount,
                fromWalletId: data.walletId,
                assetId: balance.assetId,
                description: data.description,
                reference: data.website?.trim() || undefined,
                tags: [TagCategory.Expense],
                date: data.date
            });

            console.log('🎉 [Dashboard] Saque concluído com sucesso! Disparando Toast e Refresh...');
            success('Withdrawal Complete', `Successfully withdrew $${data.amount.toFixed(2)}`);
            await refreshAll();
        } catch (err) {
            console.error('🔴 [Dashboard] Erro crítico no handleWithdraw:', err);
            showError('Failed to Withdraw', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    };

    // ===== RENDER =====
    return (
        <DashboardLayout
            currentPath="/"
            totalNetWorth={metrics?.totalNetWorth ?? 0}
            netWorthChange={metrics?.netProfit ?? 0}
            netWorthChangePercent={metrics?.netProfitPercentage ?? 0}
        >
            <div className="space-y-6">
                {portfolioError && (
                    <div className="flex items-center justify-between p-4 rounded-xl border border-danger/20 bg-danger/10 text-danger text-sm shadow-sm">
                        <div className="flex items-center gap-3">
                            <AlertTriangle size={18} className="shrink-0" />
                            <span className="font-semibold">Database Error:</span> Falha ao sincronizar dados.
                        </div>
                        <button onClick={refreshAll} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-danger/20 hover:bg-danger/30 font-medium text-xs transition-colors">
                            <RefreshCw size={12} /> Tentar Novamente
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <BalanceCard
                            balance={metrics?.totalNetWorth ?? 0}
                            change={metrics?.netProfit ?? 0}
                            changePercent={metrics?.netProfitPercentage ?? 0}
                            chartData={sparklineData}
                        />
                        <ActionButtons
                            actions={[
                                { icon: Plus, label: 'Add Funds', description: 'Deposit assets', onClick: () => setAddFundsOpen(true) },
                                { icon: ArrowRightLeft, label: 'Transfer', description: 'Send to wallet', onClick: () => setTransferOpen(true) },
                                { icon: ArrowRightLeft, label: 'Withdraw', description: 'Cash out', onClick: () => setWithdrawOpen(true) }
                            ]}
                        />
                    </div>
                    <PortfolioDistribution wallets={walletDistribution} onViewAll={() => console.log('View all wallets')} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <PortfolioChart
                            data={chartData}
                            title="Portfolio Overview"
                            subtitle={`$${(metrics?.totalNetWorth ?? 0).toFixed(2)}`}
                            height={300}
                            loading={portfolioLoading}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                            <StatCard
                                title="Income"
                                value={(metrics?.totalNetWorth ?? 0).toFixed(2)}
                                prefix="$"
                                icon={TrendingUp}
                                color="success"
                                loading={portfolioLoading}
                                trend={{
                                    value: Math.abs(metrics?.netProfitPercentage ?? 0),
                                    direction: (metrics?.netProfit ?? 0) >= 0 ? 'up' : 'down',
                                    label: 'vs last month'
                                }}
                            />
                            <StatCard
                                title="Expenses"
                                value={(metrics?.totalInvested ?? 0).toFixed(2)}
                                prefix="$"
                                icon={TrendingDown}
                                color="danger"
                                loading={portfolioLoading}
                                trend={{
                                    value: 4.2, // Exemplo de valor estático se você não tiver esse dado
                                    direction: 'down',
                                    label: 'vs last week'
                                }}
                            />
                            <StatCard
                                title="Transactions"
                                value={String(metrics?.transactionCount ?? 0)}
                                icon={ArrowLeftRight}
                                color="info"
                                loading={portfolioLoading}
                                trend={{
                                    value: 12.5,
                                    direction: 'up',
                                    label: 'activity increase'
                                }}
                            />
                            <StatCard
                                title="Success Rate"
                                value={metrics?.transactionCount ? "98.2" : "0.0"}
                                suffix="%"
                                icon={ShieldCheck}
                                color="success"
                                loading={portfolioLoading}
                                trend={{
                                    value: 0.5,
                                    direction: 'stable',
                                    label: 'stable'
                                }}
                            />
                        </div>
                    </div>
                    <TransactionTable
                        transactions={transactions}
                        onRowClick={(tx) => console.log('Transaction clicked:', tx)}
                        onViewAllClick={() => console.log('View all transactions')}
                        loading={transactionsLoading || portfolioLoading}
                    />
                </div>
            </div>

            {/* Modais */}
            <AddFundsModal isOpen={addFundsOpen} onClose={() => setAddFundsOpen(false)} onSubmit={handleAddFunds} wallets={walletOptions} assets={assets} />
            <TransferModal isOpen={transferOpen} onClose={() => setTransferOpen(false)} onSubmit={handleTransfer} wallets={walletOptions} assets={assets} />
            <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} onSubmit={handleWithdraw} wallets={walletOptions} assets={assets} />

            {/* Container de Toasts */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </DashboardLayout>
    );
};
