import React, { useMemo } from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    ArrowRightLeft,
    Wallet,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { EmptyState } from '../../ui/empty-state';
import { Skeleton } from '../../ui/skeleton';
import type { TransactionWithDetails, TransactionType, TransactionStatus } from '../../../types/transaction';

export interface TransactionTableProps {
    transactions: TransactionWithDetails[];
    loading?: boolean;
    onRowClick?: (transaction: TransactionWithDetails) => void;
    onViewAllClick?: () => void;
    emptyMessage?: string;
    className?: string;
}

interface ProcessedTransactionRow {
    rowId: string;
    originalTransaction: TransactionWithDetails;
    displayWalletName: string;
    operationLabel: string;
    displayDirection: 'in' | 'out' | 'neutral';
    amount: number;
}

const typeConfig: Record<TransactionType, { label: string; icon: React.ElementType; variant: 'success' | 'danger' | 'info' | 'warning' }> = {
    deposit: { label: 'Deposit', icon: ArrowDownLeft, variant: 'success' },
    withdraw: { label: 'Withdraw', icon: ArrowUpRight, variant: 'danger' },
    transfer: { label: 'Transfer', icon: ArrowRightLeft, variant: 'info' },
    buy: { label: 'Buy', icon: ArrowDownLeft, variant: 'success' },
    sell: { label: 'Sell', icon: ArrowUpRight, variant: 'danger' },
    reward: { label: 'Reward', icon: Wallet, variant: 'success' },
    adjustment: { label: 'Adjustment', icon: AlertCircle, variant: 'warning' },
    conversion: { label: 'Conversion', icon: ArrowRightLeft, variant: 'info' },
    fee: { label: 'Fee', icon: ArrowRightLeft, variant: 'info' }
};

const statusConfig: Record<TransactionStatus, { label: string; icon: React.ElementType; variant: 'success' | 'warning' | 'danger' }> = {
    completed: { label: 'Completed', icon: CheckCircle2, variant: 'success' },
    pending: { label: 'Pending', icon: Clock, variant: 'warning' },
    failed: { label: 'Failed', icon: XCircle, variant: 'danger' },
    cancelled: { label: 'Cancelled', icon: XCircle, variant: 'danger' }
};

const getTransactionRowDetails = (
    tx: TransactionWithDetails,
    context?: 'sender' | 'receiver'
): { direction: 'in' | 'out' | 'neutral'; label: string } => {
    if (tx.type === 'transfer') {
        return context === 'sender'
            ? { direction: 'out', label: 'Transfer Out' }
            : { direction: 'in', label: 'Transfer In' };
    }

    const inboundTypes: TransactionType[] = ['deposit', 'buy', 'reward'];
    const outboundTypes: TransactionType[] = ['withdraw', 'sell'];

    if (inboundTypes.includes(tx.type)) return { direction: 'in', label: typeConfig[tx.type].label };
    if (outboundTypes.includes(tx.type)) return { direction: 'out', label: typeConfig[tx.type].label };

    return { direction: 'neutral', label: typeConfig[tx.type].label };
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
    transactions,
    loading = false,
    onRowClick,
    onViewAllClick,
    emptyMessage = 'No transactions found',
    className = ''
}) => {
    // ✅ LIMITAR PARA 7 TRANSAÇÕES
    const limitedTransactions = useMemo(() => {
        return transactions.slice(0, 7);
    }, [transactions]);

    const processedRows = useMemo<ProcessedTransactionRow[]>(() => {
        return limitedTransactions.flatMap((tx) => {
            if (tx.type === 'transfer') {
                const rows: ProcessedTransactionRow[] = [];

                if (tx.fromWalletName) {
                    const details = getTransactionRowDetails(tx, 'sender');
                    rows.push({
                        rowId: `${tx.id}-out`,
                        originalTransaction: tx,
                        displayWalletName: tx.fromWalletName,
                        operationLabel: details.label,
                        displayDirection: details.direction,
                        amount: tx.amount
                    });
                }

                if (tx.toWalletName) {
                    const details = getTransactionRowDetails(tx, 'receiver');
                    rows.push({
                        rowId: `${tx.id}-in`,
                        originalTransaction: tx,
                        displayWalletName: tx.toWalletName,
                        operationLabel: details.label,
                        displayDirection: details.direction,
                        amount: tx.amount
                    });
                }

                return rows;
            }

            const walletName = tx.type === 'withdraw' || tx.type === 'sell'
                ? tx.fromWalletName || 'Wallet'
                : tx.toWalletName || 'Wallet';

            const details = getTransactionRowDetails(tx);

            return [{
                rowId: tx.id,
                originalTransaction: tx,
                displayWalletName: walletName,
                operationLabel: details.label,
                displayDirection: details.direction,
                amount: tx.amount
            }];
        });
    }, [limitedTransactions]);

    if (loading) {
        return (
            <Card className={className}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <Skeleton width="120px" height="20px" />
                    <Skeleton width="60px" height="20px" />
                </CardHeader>
                <CardBody>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton variant="circular" width={32} height={32} />
                                <div className="flex-1 space-y-2">
                                    <Skeleton width="40%" />
                                    <Skeleton width="20%" />
                                </div>
                                <Skeleton width="80px" />
                                <Skeleton width="100px" />
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        );
    }

    if (processedRows.length === 0) {
        return (
            <Card className={className}>
                <CardBody>
                    <EmptyState
                        icon={Wallet}
                        title="No transactions"
                        description={emptyMessage}
                    />
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <h2 className="text-lg font-semibold text-text-primary">
                    Recent Transactions
                </h2>
                {onViewAllClick && (
                    <button
                        onClick={onViewAllClick}
                        className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                        type="button"
                    >
                        View All
                    </button>
                )}
            </CardHeader>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-surface-elevated">
                            <th className="text-left p-4 text-xs font-medium text-text-muted tracking-wider">
                                Transaction
                            </th>
                            <th className="text-right p-4 text-xs font-medium text-text-muted tracking-wider">
                                Amount
                            </th>
                            <th className="text-left p-4 text-xs font-medium text-text-muted tracking-wider">
                                Type
                            </th>
                            <th className="text-left p-4 text-xs font-medium text-text-muted tracking-wider">
                                Status
                            </th>
                            <th className="text-right p-4 text-xs font-medium text-text-muted tracking-wider">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {processedRows.map((row) => {
                            const tx = row.originalTransaction;
                            const typeInfo = typeConfig[tx.type];
                            const statusInfo = statusConfig[tx.status];
                            const TypeIcon = typeInfo.icon;
                            const StatusIcon = statusInfo.icon;

                            return (
                                <tr
                                    key={row.rowId}
                                    className={`border-b border-border transition-colors ${onRowClick ? 'cursor-pointer hover:bg-surface-elevated/50' : ''
                                        }`}
                                    onClick={() => onRowClick?.(tx)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
                                                <TypeIcon size={16} className="text-text-secondary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-text-primary">
                                                    {row.displayWalletName}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    {row.operationLabel}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4 text-right">
                                        <span className={`font-mono font-medium ${row.displayDirection === 'in'
                                            ? 'text-success'
                                            : row.displayDirection === 'out'
                                                ? 'text-danger'
                                                : 'text-text-primary'
                                            }`}>
                                            {row.displayDirection === 'in' ? '+' : row.displayDirection === 'out' ? '-' : ''}
                                            ${row.amount.toFixed(2)}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <Badge variant={typeInfo.variant}>
                                            {typeInfo.label}
                                        </Badge>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <StatusIcon
                                                size={14}
                                                className={`
                                                    ${statusInfo.variant === 'success' ? 'text-success' : ''}
                                                    ${statusInfo.variant === 'warning' ? 'text-warning' : ''}
                                                    ${statusInfo.variant === 'danger' ? 'text-danger' : ''}
                                                `}
                                            />
                                            <span className="text-sm text-text-secondary">
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-4 text-right">
                                        <span className="text-sm text-text-secondary font-mono">
                                            {new Date(tx.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <p className="text-xs text-text-muted font-mono">
                                            {new Date(tx.date).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};