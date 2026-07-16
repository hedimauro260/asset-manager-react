import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardBody } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Pagination } from '../../ui/Pagination';
import { ActivityToolbar } from '../ActivityToolbar';
import { useWalletActivity } from '../../../hooks/useWalletActivity';
import { WALLETS_LIST, TYPES_LIST, PERIODS_LIST } from '../../../mocks/activities';
import type { ActivityType } from '../../../mocks/activities';
import type { WalletActivityFilters } from '../../../hooks/useWalletActivity';

// Tipagem restrita para o Period com base no filtro do Hook
type ActivityPeriod = NonNullable<WalletActivityFilters['period']>;

export interface ActivityTableProps {
    walletId?: string;
    className?: string;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
    walletId,
    className = ''
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedType, setSelectedType] = useState<string>('All Types');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('7 Days');
    const itemsPerPage = 7;

    // Converte a string do estado para o tipo estrito esperado pelo hook
    const periodFilter = selectedPeriod as ActivityPeriod;

    const { activities, loading, error, setFilters, refresh } = useWalletActivity({
        walletId,
        type: selectedType === 'All Types' ? undefined : (selectedType as ActivityType),
        period: periodFilter
    });

    // ✅ DUPLICAR TRANSFERÊNCIAS COM NOMES DE WALLET CORRETOS
    const processedActivities = useMemo(() => {
        const result: Array<typeof activities[0] & {
            rowId: string;
            displayDirection: 'in' | 'out' | 'neutral';
            displayWalletName: string;
        }> = [];

        activities.forEach((activity) => {
            if (activity.type === 'Transfer') {
                // Transfer Out (origem)
                result.push({
                    ...activity,
                    rowId: `${activity.id}-out`,
                    displayDirection: 'out',
                    displayWalletName: activity.fromWalletName || activity.walletName || 'Unknown' // ← USA ORIGEM
                });

                // Transfer In (destino) - cria uma cópia com sinal de valor invertido
                result.push({
                    ...activity,
                    rowId: `${activity.id}-in`,
                    amount: -activity.amount, // Inverte o sinal para mostrar como entrada
                    displayDirection: 'in',
                    displayWalletName: activity.toWalletName || 'Unknown' // ← USA DESTINO
                });
            } else {
                const direction = activity.amount >= 0 ? 'in' : 'out';
                result.push({
                    ...activity,
                    rowId: activity.id,
                    displayDirection: direction,
                    displayWalletName: activity.walletName || 'Unknown'
                });
            }
        });

        return result;
    }, [activities]);

    const totalPages = Math.ceil(processedActivities.length / itemsPerPage);
    const paginatedActivities = useMemo(() => {
        return processedActivities.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [processedActivities, currentPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [walletId, selectedType, selectedPeriod]);

    const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'primary' => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Pending': return 'warning';
            case 'Failed': return 'danger';
            default: return 'primary';
        }
    };

    const getTypeVariant = (type: string): 'success' | 'danger' | 'info' | 'warning' | 'primary' => {
        switch (type) {
            case 'Deposit':
            case 'Buy': return 'success';
            case 'Withdraw':
            case 'Sell': return 'danger';
            case 'Transfer': return 'info';
            case 'Edit':
            case 'Adjustment': return 'warning';
            default: return 'primary';
        }
    };

    if (loading) {
        return (
            <Card className={className}>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="h-5 w-32 bg-border rounded animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-9 w-32 bg-border rounded animate-pulse" />
                        <div className="h-9 w-28 bg-border rounded animate-pulse" />
                        <div className="h-9 w-28 bg-border rounded animate-pulse" />
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-4 w-24 bg-border rounded animate-pulse" />
                                <div className="h-4 w-20 bg-border rounded animate-pulse" />
                                <div className="h-4 w-16 bg-border rounded animate-pulse" />
                                <div className="h-4 w-32 bg-border rounded animate-pulse" />
                                <div className="h-4 w-16 bg-border rounded animate-pulse" />
                                <div className="h-4 w-20 bg-border rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={className}>
                <CardBody>
                    <div className="text-center py-8">
                        <p className="text-danger font-medium">Failed to load activities</p>
                        <p className="text-sm text-text-muted mt-1">{error}</p>
                        <button
                            onClick={refresh}
                            className="mt-4 text-sm text-primary hover:text-primary-hover"
                        >
                            Try again
                        </button>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-text-primary">
                    Global Activity
                </h2>
                <ActivityToolbar
                    selectedWallet={walletId || 'All Wallets'}
                    selectedType={selectedType}
                    selectedPeriod={selectedPeriod}
                    wallets={WALLETS_LIST}
                    types={TYPES_LIST}
                    periods={PERIODS_LIST}
                    onWalletChange={(wallet) => {
                        setFilters({
                            walletId: wallet === 'All Wallets' ? undefined : wallet,
                            type: selectedType === 'All Types' ? undefined : (selectedType as ActivityType),
                            period: periodFilter
                        });
                    }}
                    onTypeChange={setSelectedType}
                    onPeriodChange={setSelectedPeriod}
                />
            </CardHeader>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-surface-elevated">
                            <th className="text-left p-4 text-xs font-medium text-text-muted tracking-wider">
                                Date
                            </th>
                            <th className="text-left p-4 text-xs font-medium text-text-muted tracking-wider">
                                Wallet
                            </th>
                            <th className="text-right p-4 text-xs font-medium text-text-muted tracking-wider">
                                Amount
                            </th>
                            <th className="text-left p-4 text-xs font-medium text-text-muted tracking-wider">
                                Type
                            </th>
                            <th className="text-left p-4 text-xs font-medium text-text-muted tracking-wider">
                                Coin
                            </th>
                            <th className="text-left p-4 text-xs font-medium text-text-muted tracking-wider">
                                Website
                            </th>
                            <th className="text-left p-4 text-xs font-medium text-text-muted tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedActivities.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-text-muted">
                                    <div className="space-y-2">
                                        <p className="text-text-secondary font-medium">No activities found</p>
                                        <p className="text-sm">Try adjusting your filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedActivities.map((activity) => (
                                <tr
                                    key={activity.rowId}
                                    className="border-b border-border transition-colors hover:bg-surface-elevated/50"
                                >
                                    <td className="p-4">
                                        <span className="text-sm text-text-secondary font-mono">
                                            {activity.date.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <p className="text-xs text-text-muted font-mono mt-0.5">
                                            {activity.date.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-medium text-text-primary">
                                            {activity.displayWalletName}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`text-sm font-mono font-medium ${activity.displayDirection === 'in'
                                            ? 'text-success'
                                            : activity.displayDirection === 'out'
                                                ? 'text-danger'
                                                : 'text-text-primary'
                                            }`}>
                                            {activity.displayDirection === 'in' ? '+' : activity.displayDirection === 'out' ? '-' : ''}
                                            ${Math.abs(activity.amount).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={getTypeVariant(activity.type)}>
                                            {activity.type === 'Transfer' && activity.rowId.endsWith('-out')
                                                ? 'Transfer Out'
                                                : activity.type === 'Transfer' && activity.rowId.endsWith('-in')
                                                    ? 'Transfer In'
                                                    : activity.type}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-medium text-text-primary font-mono">
                                            {activity.assetSymbol || 'USD'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {activity.website ? (
                                            <span className="text-sm text-text-secondary">
                                                {activity.website}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-text-muted italic">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={getStatusVariant(activity.status)}>
                                            {activity.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {processedActivities.length > 0 && (
                <div className="p-4 border-t border-border">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={processedActivities.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </Card>
    );
};