import React from 'react';
import { Modal } from '../../ui/modal';
import { Button } from '../../ui/button';
import { AlertTriangle, Wallet, TrendingUp, FileText } from 'lucide-react';

export interface DeleteWalletConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    walletName: string;
    walletBalance: number;
    transactionCount: number;
    loading?: boolean;
}

export const DeleteWalletConfirmationModal: React.FC<DeleteWalletConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    walletName,
    walletBalance,
    transactionCount,
    loading = false
}) => {
    const hasBalance = walletBalance > 0;
    const hasTransactions = transactionCount > 0;

    const handleConfirm = async () => {
        try {
            await onConfirm();
        } catch (error) {
            console.error('Failed to delete wallet:', error);
        }
    };

    const footer = (
        <>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
            </Button>
            <Button
                variant="danger"
                onClick={handleConfirm}
                loading={loading}
                disabled={loading}
            >
                Delete Wallet
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Wallet"
            footer={footer}
            size="sm"
        >
            <div className="space-y-4">
                {/* Alerta principal */}
                <div className="flex items-start gap-3 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                    <AlertTriangle size={20} className="text-danger shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-text-primary">
                            Are you sure you want to delete this wallet?
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                            This action cannot be undone. All data associated with this wallet will be permanently removed.
                        </p>
                    </div>
                </div>

                {/* Informações da wallet */}
                <div className="p-4 bg-surface-elevated border border-border rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-text-muted" />
                        <span className="text-sm font-medium text-text-primary">{walletName}</span>
                    </div>

                    {hasBalance && (
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-warning" />
                            <span className="text-sm text-text-secondary">
                                Current balance: <span className="font-mono font-medium text-text-primary">${walletBalance.toFixed(2)}</span>
                            </span>
                        </div>
                    )}

                    {hasTransactions && (
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-info" />
                            <span className="text-sm text-text-secondary">
                                {transactionCount} {transactionCount === 1 ? 'transaction' : 'transactions'} in history
                            </span>
                        </div>
                    )}
                </div>

                {/* Avisos adicionais */}
                {(hasBalance || hasTransactions) && (
                    <div className="space-y-2">
                        {hasBalance && (
                            <p className="text-xs text-warning">
                                ️ This wallet has a balance of ${walletBalance.toFixed(2)}. Make sure to transfer funds before deleting.
                            </p>
                        )}
                        {hasTransactions && (
                            <p className="text-xs text-info">
                                ℹ️ Transaction history will be preserved but will no longer be linked to this wallet.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};