// src/pages/Wallets.tsx
import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DashboardLayout } from '../components/layout/DashboardLayout/DashboardLayout';
import { WalletsHeader } from '../components/wallets/WalletsHeader';
import { StatsCard } from '../components/wallets/StatsCard';
import { WalletsToolbar } from '../components/wallets/WalletsToolbar';
import { WalletsGrid } from '../components/wallets/WalletsGrid';
import { WalletDetailsPanel } from '../components/wallets/WalletDetailsPanel';
import { ActivityTable } from '../components/wallets/ActivityTable';
import { WalletFormModal } from '../components/wallets/WalletFormModal';
import { DeleteWalletConfirmationModal } from '../components/wallets/DeleteWalletConfirmationModal';
import { ToastContainer } from '../components/ui/Toast';
import { Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useWallets } from '../hooks/useWallets';
import { useWalletStats } from '../hooks/useWalletStats';
import { useToast } from '../hooks/useToast';
import { useAssets } from '../hooks/useAssets';
import { WalletType, TransactionType, TransactionStatus, TagCategory } from '../types';
import { BalanceRepository, TransactionRepository } from '../database/repositories';
import type { WalletWithStats } from '../utils/walletMapper';

// Modais
import { AddFundsModal } from '../components/modals/AddFundsModal/AddFundsModal';
import { TransferModal } from '../components/modals/TransferModal/TransferModal';
import { WithdrawModal } from '../components/modals/WithdrawModal/WithdrawModal';
import { AdjustModal } from '../components/modals/AdjustModal';

export const Wallets: React.FC = () => {
    // Estado para o Painel Lateral
    const [selectedWallet, setSelectedWallet] = useState<WalletWithStats | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Estados dos modais
    const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);

    const [walletToEdit, setWalletToEdit] = useState<WalletWithStats | null>(null);
    const [walletToDelete, setWalletToDelete] = useState<WalletWithStats | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hooks
    const { walletCards, wallets, balances, loading: walletsLoading, addWallet, updateWallet, deleteWallet, refresh } = useWallets();
    const { assets } = useAssets();
    const { toasts, removeToast, success, error: showError, warning } = useToast();

    // 2. Calcular totais básicos para passar ao hook de stats
    const activeWalletsCount = useMemo(
        () => walletCards.filter(w => w.status === 'active').length,
        [walletCards]
    );

    const totalBalance = useMemo(
        () => walletCards.reduce((sum, w) => sum + w.balance, 0),
        [walletCards]
    );

    // 3. Buscar estatísticas de transações (inflows/outflows)
    const {
        totalInflows,
        totalOutflows,
        inflowChangePercent,
        outflowChangePercent,
        loading: statsLoading
    } = useWalletStats(walletCards.length, activeWalletsCount, totalBalance);

    const isLoading = walletsLoading || statsLoading;

    // Lista de nomes existentes para validação
    const existingWalletNames = useMemo(
        () => wallets.map(w => w.name),
        [wallets]
    );

    const walletOptions = useMemo(() => {
        return wallets.map(w => {
            const walletBalances = balances.filter(b => b.walletId === w.id);
            const totalBalance = walletBalances.reduce((sum, b) => sum + b.amount, 0);
            return { id: w.id, name: w.name, balance: totalBalance };
        });
    }, [wallets, balances]);

    // Handlers do Painel
    const handleWalletClick = (wallet: WalletWithStats) => {
        setSelectedWallet(wallet);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setTimeout(() => setSelectedWallet(null), 300);
    };

    // Handler para ações rápidas do painel lateral
    const handleQuickAction = (action: 'add' | 'transfer' | 'withdraw' | 'adjust') => {
        if (!selectedWallet) return;

        switch (action) {
            case 'add':
                setIsAddFundsModalOpen(true);
                break;
            case 'transfer':
                setIsTransferModalOpen(true);
                break;
            case 'withdraw':
                setIsWithdrawModalOpen(true);
                break;
            case 'adjust':
                setIsAdjustModalOpen(true);
                break;
        }
    };

    // Handler para abrir modal de Add Wallet
    const handleOpenAddWalletModal = () => {
        setIsAddWalletModalOpen(true);
    };

    // Handler para abrir modal de Edit
    const handleOpenEditModal = (walletId: string) => {
        const wallet = walletCards.find(w => w.id === walletId);
        if (wallet) {
            setWalletToEdit(wallet);
            setIsEditModalOpen(true);
            setIsPanelOpen(false);
        }
    };

    // Handler para abrir modal de Delete
    const handleOpenDeleteModal = (walletId: string) => {
        const wallet = walletCards.find(w => w.id === walletId);
        if (wallet) {
            setWalletToDelete(wallet);
            setIsDeleteModalOpen(true);
            setIsPanelOpen(false);
        }
    };

    // Handler Add Funds
    const handleAddFunds = async (data: {
        walletId: string;
        assetId: string;
        amount: number;
        description?: string;
        website?: string;
        date: Date;
    }) => {
        setIsSubmitting(true);
        try {
            const balance = balances.find(
                b => b.walletId === data.walletId && b.assetId === data.assetId
            );

            if (!balance) {
                await BalanceRepository.create({
                    walletId: data.walletId,
                    assetId: data.assetId,
                    amount: data.amount,
                    availableAmount: data.amount,
                    lastUpdated: new Date()
                });
            } else {
                await BalanceRepository.increment(data.walletId, data.assetId, data.amount);
            }

            await TransactionRepository.create({
                type: TransactionType.Deposit,
                status: TransactionStatus.Completed,
                amount: data.amount,
                toWalletId: data.walletId,
                assetId: data.assetId,
                description: data.description,
                reference: data.website?.trim() || undefined,
                tags: [TagCategory.Reward],
                date: data.date
            });

            success('Funds Added', `Successfully added $${data.amount.toFixed(2)}`);
            setIsAddFundsModalOpen(false);
            handleClosePanel();
            await refresh();
        } catch (err) {
            showError('Failed to Add Funds', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler Transfer
    const handleTransfer = async (data: {
        fromWalletId: string;
        toWalletId: string;
        assetId: string;
        amount: number;
        description?: string;
        website?: string;
        date: Date;
    }) => {
        setIsSubmitting(true);
        try {
            if (data.fromWalletId === data.toWalletId) {
                throw new Error('Cannot transfer to the same wallet');
            }

            const fromBalance = balances.find(
                b => b.walletId === data.fromWalletId && b.assetId === data.assetId
            );

            if (!fromBalance) {
                throw new Error('No balance found for this coin in source wallet');
            }

            if (fromBalance.availableAmount < data.amount) {
                throw new Error('Insufficient balance');
            }

            await BalanceRepository.decrement(data.fromWalletId, data.assetId, data.amount);

            const toBalance = balances.find(
                b => b.walletId === data.toWalletId && b.assetId === data.assetId
            );

            if (toBalance) {
                await BalanceRepository.increment(data.toWalletId, data.assetId, data.amount);
            } else {
                await BalanceRepository.create({
                    walletId: data.toWalletId,
                    assetId: data.assetId,
                    amount: data.amount,
                    availableAmount: data.amount,
                    lastUpdated: new Date()
                });
            }

            await TransactionRepository.create({
                type: TransactionType.Transfer,
                status: TransactionStatus.Completed,
                amount: data.amount,
                fromWalletId: data.fromWalletId,
                toWalletId: data.toWalletId,
                assetId: data.assetId,
                description: data.description,
                reference: data.website?.trim() || undefined,
                tags: [TagCategory.Transfer],
                date: data.date
            });

            success('Transfer Complete', `Successfully transferred $${data.amount.toFixed(2)}`);
            setIsTransferModalOpen(false);
            handleClosePanel();
            await refresh();
        } catch (err) {
            showError('Failed to Transfer', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler Withdraw
    const handleWithdraw = async (data: {
        walletId: string;
        assetId: string;
        amount: number;
        description?: string;
        website?: string;
        date: Date;
    }) => {
        setIsSubmitting(true);
        try {
            const balance = balances.find(
                b => b.walletId === data.walletId && b.assetId === data.assetId
            );

            if (!balance) {
                throw new Error('No balance found for this coin in wallet');
            }

            if (balance.availableAmount < data.amount) {
                throw new Error('Insufficient balance');
            }

            await BalanceRepository.decrement(data.walletId, data.assetId, data.amount);

            await TransactionRepository.create({
                type: TransactionType.Withdraw,
                status: TransactionStatus.Completed,
                amount: data.amount,
                fromWalletId: data.walletId,
                assetId: data.assetId,
                description: data.description,
                reference: data.website?.trim() || undefined,
                tags: [TagCategory.Expense],
                date: data.date
            });

            success('Withdrawal Complete', `Successfully withdrew $${data.amount.toFixed(2)}`);
            setIsWithdrawModalOpen(false);
            handleClosePanel();
            await refresh();
        } catch (err) {
            showError('Failed to Withdraw', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler Adjust
    const handleAdjust = async (data: {
        walletId: string;
        assetId: string;
        amount: number;
        description?: string;
        website?: string;
        date: Date;
    }) => {
        setIsSubmitting(true);
        try {
            const balance = balances.find(
                b => b.walletId === data.walletId && b.assetId === data.assetId
            );

            if (data.amount > 0) {
                if (!balance) {
                    await BalanceRepository.create({
                        walletId: data.walletId,
                        assetId: data.assetId,
                        amount: data.amount,
                        availableAmount: data.amount,
                        lastUpdated: new Date()
                    });
                } else {
                    await BalanceRepository.increment(data.walletId, data.assetId, data.amount);
                }
            } else {
                if (!balance) {
                    throw new Error('No balance found to remove from');
                }

                const removeAmount = Math.abs(data.amount);
                if (balance.availableAmount < removeAmount) {
                    throw new Error('Insufficient balance for this adjustment');
                }

                await BalanceRepository.decrement(data.walletId, data.assetId, removeAmount);
            }

            await TransactionRepository.create({
                type: TransactionType.Adjustment,
                status: TransactionStatus.Completed,
                amount: Math.abs(data.amount),
                fromWalletId: data.amount < 0 ? data.walletId : undefined,
                toWalletId: data.amount > 0 ? data.walletId : undefined,
                assetId: data.assetId,
                description: data.description || `Manual adjustment: ${data.amount > 0 ? 'added' : 'removed'} $${Math.abs(data.amount).toFixed(2)}`,
                reference: data.website?.trim() || undefined,
                tags: [TagCategory.Other],
                date: data.date
            });

            const actionText = data.amount > 0 ? 'added to' : 'removed from';
            success('Balance Adjusted', `$${Math.abs(data.amount).toFixed(2)} ${actionText} wallet`);
            setIsAdjustModalOpen(false);
            handleClosePanel();
            await refresh();
        } catch (err) {
            showError('Failed to Adjust Balance', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler para Add Wallet
    const handleAddWallet = async (data: {
        name: string;
        description?: string;
        type: WalletType;
        color: string;
    }) => {
        setIsSubmitting(true);
        try {
            await addWallet({
                name: data.name,
                description: data.description,
                icon: 'wallet',
                color: data.color,
                type: data.type,
                isArchived: false
            });
            success('Wallet created', `${data.name} has been added successfully`);
            setIsAddWalletModalOpen(false);
            await refresh();
        } catch (err) {
            showError('Failed to create wallet', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler para Edit Wallet
    const handleEditWallet = async (data: {
        name: string;
        description?: string;
        type: WalletType;
        color: string;
    }) => {
        if (!walletToEdit) return;

        setIsSubmitting(true);
        try {
            await updateWallet(walletToEdit.id, {
                name: data.name,
                description: data.description,
                color: data.color,
                type: data.type
            });
            success('Wallet updated', `${data.name} has been updated successfully`);
            setIsEditModalOpen(false);
            setWalletToEdit(null);
            await refresh();
        } catch (err) {
            showError('Failed to update wallet', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteWallet = async () => {
        if (!walletToDelete) return;

        setIsSubmitting(true);
        try {
            await deleteWallet(walletToDelete.id);
            success('Wallet deleted', `${walletToDelete.name} has been removed`);
            setIsDeleteModalOpen(false);
            setWalletToDelete(null);
            handleClosePanel();
            await refresh();
        } catch (err) {
            showError('Failed to delete wallet', err instanceof Error ? err.message : 'Unknown error');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDuplicateWallet = async (walletId: string) => {
        const wallet = walletCards.find(w => w.id === walletId);
        if (!wallet) return;

        setIsSubmitting(true);
        try {
            const copyName = `${wallet.name} Copy`;
            const existingCopy = wallets.find(w => w.name === copyName);

            if (existingCopy) {
                warning('Copy exists', `A wallet named "${copyName}" already exists`);
                return;
            }

            const originalWallet = wallets.find(w => w.id === walletId);
            if (!originalWallet) throw new Error('Original wallet not found');

            await addWallet({
                name: copyName,
                description: originalWallet.description,
                icon: originalWallet.icon,
                color: originalWallet.color,
                type: originalWallet.type,
                isArchived: false
            });

            success('Wallet duplicated', `${copyName} has been created with zero balance`);
            await refresh();
        } catch (err) {
            showError('Failed to duplicate wallet', err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calcular transações da wallet para o modal de deleção
    const transactionCount = useMemo(() => {
        if (!walletToDelete) return 0;
        return 0;
    }, [walletToDelete]);

    return (
        <DashboardLayout
            currentPath="/wallets"
            totalNetWorth={totalBalance}
            netWorthChange={totalInflows - totalOutflows}
            netWorthChangePercent={inflowChangePercent}
        >
            <Helmet>
                <title>Wallets | Active Portfolio Manager - Hedi Mauro</title>
            </Helmet>
            <div className="space-y-8">
                {/* Header Principal */}
                <WalletsHeader onAddWallet={handleOpenAddWalletModal} />

                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Wallets"
                        value={walletCards.length}
                        subtitle={`${activeWalletsCount} active wallets`}
                        icon={Wallet}
                        color="primary"
                        loading={isLoading}
                    />

                    <StatsCard
                        title="Total Balance"
                        value={totalBalance.toFixed(2)}
                        prefix="$"
                        trend={{
                            value: 8.21,
                            direction: 'up',
                            label: '+$2.13'
                        }}
                        icon={TrendingUp}
                        color="success"
                        loading={isLoading}
                    />

                    <StatsCard
                        title="Total Inflows"
                        value={totalInflows.toFixed(2)}
                        prefix="$"
                        trend={{
                            value: Math.abs(inflowChangePercent),
                            direction: inflowChangePercent >= 0 ? 'up' : 'down',
                            label: 'vs last 30 days'
                        }}
                        icon={ArrowDownToLine}
                        color="success"
                        loading={isLoading}
                    />

                    <StatsCard
                        title="Total Outflows"
                        value={totalOutflows.toFixed(2)}
                        prefix="$"
                        trend={{
                            value: Math.abs(outflowChangePercent),
                            direction: outflowChangePercent <= 0 ? 'down' : 'up',
                            label: 'vs last 30 days'
                        }}
                        icon={ArrowUpFromLine}
                        color="danger"
                        loading={isLoading}
                    />
                </div>

                {/* Wallets Section */}
                <section>
                    <WalletsToolbar />
                    <WalletsGrid
                        wallets={walletCards}
                        loading={walletsLoading}
                        onWalletClick={handleWalletClick}
                        onActionClick={(wallet, e) => {
                            e.stopPropagation();
                            console.log('Action clicked for:', wallet.name);
                        }}
                    />
                </section>

                {/* Tabela Global Activity */}
                <section>
                    <ActivityTable />
                </section>
            </div>

            {/* Painel Lateral */}
            <WalletDetailsPanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                wallet={selectedWallet}
                onQuickAction={handleQuickAction}
                onEditWallet={handleOpenEditModal}
                onDuplicateWallet={handleDuplicateWallet}
                onDeleteWallet={handleOpenDeleteModal}
            />

            {/* Modais de Transações */}
            <AddFundsModal
                isOpen={isAddFundsModalOpen}
                onClose={() => setIsAddFundsModalOpen(false)}
                onSubmit={handleAddFunds}
                wallets={walletOptions}
                assets={assets}
                defaultWalletId={selectedWallet?.id}
            />

            <TransferModal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                onSubmit={handleTransfer}
                wallets={walletOptions}
                assets={assets}
                defaultFromWalletId={selectedWallet?.id} // ← Pré-seleciona origem
            />

            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onSubmit={handleWithdraw}
                wallets={walletOptions}
                assets={assets}
                defaultWalletId={selectedWallet?.id}
            />

            <AdjustModal
                isOpen={isAdjustModalOpen}
                onClose={() => setIsAdjustModalOpen(false)}
                onSubmit={handleAdjust}
                wallets={walletOptions}
                assets={assets}
                defaultWalletId={selectedWallet?.id}
            />

            {/* Modais de Gestão de Wallets */}
            <WalletFormModal
                isOpen={isAddWalletModalOpen}
                onClose={() => setIsAddWalletModalOpen(false)}
                onSubmit={handleAddWallet}
                mode="add"
                existingWalletNames={existingWalletNames}
                loading={isSubmitting}
            />

            <WalletFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setWalletToEdit(null);
                }}
                onSubmit={handleEditWallet}
                mode="edit"
                wallet={walletToEdit ? wallets.find(w => w.id === walletToEdit.id) : undefined}
                existingWalletNames={existingWalletNames}
                loading={isSubmitting}
            />

            <DeleteWalletConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setWalletToDelete(null);
                }}
                onConfirm={handleDeleteWallet}
                walletName={walletToDelete?.name || ''}
                walletBalance={walletToDelete?.balance || 0}
                transactionCount={transactionCount}
                loading={isSubmitting}
            />

            {/* Container de Toasts */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </DashboardLayout>
    );
};
