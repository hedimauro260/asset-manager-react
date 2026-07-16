import React from 'react';
import { WalletCard } from '../WalletCard';
import { Skeleton } from '../../ui/skeleton';
import type { WalletWithStats } from '../../../utils/walletMapper'; // ✅ Importar tipo correto

export interface WalletsGridProps {
    wallets: WalletWithStats[]; // ✅ Usar WalletWithStats
    onWalletClick?: (wallet: WalletWithStats) => void;
    onActionClick?: (wallet: WalletWithStats, e: React.MouseEvent) => void;
    loading?: boolean; // ✅ Adicionar prop loading
}

export const WalletsGrid: React.FC<WalletsGridProps> = ({
    wallets,
    onWalletClick,
    onActionClick,
    loading = false // ✅ Valor padrão
}) => {
    // Estado de carregamento: mostra skeletons
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <Skeleton variant="circular" width={40} height={40} />
                            <div className="space-y-2 flex-1">
                                <Skeleton width="60%" height={16} />
                                <Skeleton width="30%" height={12} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Skeleton width="40%" height={28} />
                            <Skeleton width="100%" height={8} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Estado vazio
    if (wallets.length === 0) {
        return (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <p className="text-text-secondary">No wallets found</p>
                <p className="text-sm text-text-muted mt-2">
                    Create your first wallet to get started
                </p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet) => (
                <WalletCard
                    key={wallet.id}
                    id={wallet.id}
                    name={wallet.name}
                    balance={wallet.balance}
                    percentage={wallet.percentage}
                    color={wallet.color}
                    status={wallet.status}
                    isPrimary={wallet.isPrimary}
                    onClick={() => onWalletClick?.(wallet)}
                    onActionClick={(e) => onActionClick?.(wallet, e)}
                />
            ))}
        </div>
    );
};