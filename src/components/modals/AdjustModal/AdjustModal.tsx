import React, { useState } from 'react';
import { Modal } from '../../ui/modal';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { DollarSign, Globe, TrendingUp, TrendingDown } from 'lucide-react';
import type { Asset } from '../../../types';
import { TransactionDateTimeFields } from '../TransactionDateTimeFields';
import { combineTransactionDateTime, getCurrentTransactionDateTime } from '../transactionDateTime';

export interface AdjustModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        walletId: string;
        assetId: string;
        amount: number; // Positivo = adicionar, Negativo = remover
        description?: string;
        website?: string;
        date: Date;
    }) => Promise<void>;
    wallets: { id: string; name: string; balance: number }[];
    assets: Asset[];
    defaultWalletId?: string;
}

export const AdjustModal: React.FC<AdjustModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    wallets,
    assets,
    defaultWalletId
}) => {
    const [walletId, setWalletId] = useState('');
    const [assetId, setAssetId] = useState('');
    const [amount, setAmount] = useState('');
    const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [transactionTime, setTransactionTime] = useState('');
    const [loading, setLoading] = useState(false);

    const selectedWallet = wallets.find(w => w.id === walletId);

    React.useEffect(() => {
        if (isOpen) {
            const currentDateTime = getCurrentTransactionDateTime();
            setWalletId(defaultWalletId || '');
            setAssetId('');
            setAmount('');
            setAdjustType('add');
            setDescription('');
            setWebsite('');
            setTransactionDate(currentDateTime.date);
            setTransactionTime(currentDateTime.time);
        }
    }, [isOpen, defaultWalletId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🔵 [AdjustModal] handleSubmit:', { walletId, assetId, amount, adjustType, website, transactionDate, transactionTime });

        if (!walletId || !assetId || !amount) {
            console.warn('🟡 [AdjustModal] Validação falhou');
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        // Se for remover, valida saldo suficiente
        if (adjustType === 'remove' && selectedWallet && numericAmount > selectedWallet.balance) {
            alert('Insufficient balance for this adjustment');
            return;
        }

        setLoading(true);
        try {
            // Converte para valor negativo se for remoção
            const finalAmount = adjustType === 'add' ? numericAmount : -numericAmount;

            await onSubmit({
                walletId,
                assetId,
                amount: finalAmount,
                description: description || undefined,
                website: website.trim() || undefined,
                date: combineTransactionDateTime(transactionDate, transactionTime)
            });
            console.log('🟢 [AdjustModal] Sucesso!');
            onClose();
        } catch (error) {
            console.error('🔴 [AdjustModal] Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <>
            <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button
                type="submit"
                variant={adjustType === 'add' ? 'primary' : 'danger'}
                loading={loading}
                disabled={!walletId || !assetId || !amount || loading}
            >
                {adjustType === 'add' ? 'Add Balance' : 'Remove Balance'}
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manual Adjustment"
            footer={footer}
            onSubmit={handleSubmit}
            size="lg"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Wallet
                    </label>
                    <select
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                        className="input"
                        required
                    >
                        <option value="">Select wallet</option>
                        {wallets.map(w => (
                            <option key={w.id} value={w.id}>
                                {w.name} (${w.balance.toFixed(2)})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Adjustment Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setAdjustType('add')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${adjustType === 'add'
                                ? 'border-success bg-success/10 text-success'
                                : 'border-border bg-surface text-text-secondary hover:border-success/50'
                                }`}
                        >
                            <TrendingUp size={18} />
                            <span className="font-medium">Add</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setAdjustType('remove')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${adjustType === 'remove'
                                ? 'border-danger bg-danger/10 text-danger'
                                : 'border-border bg-surface text-text-secondary hover:border-danger/50'
                                }`}
                        >
                            <TrendingDown size={18} />
                            <span className="font-medium">Remove</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Coin / Asset
                        </label>
                        <select
                            value={assetId}
                            onChange={(e) => setAssetId(e.target.value)}
                            className="input"
                            required
                        >
                            <option value="">Select coin</option>
                            {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>
                                    {asset.symbol} - {asset.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label={`Amount to ${adjustType === 'add' ? 'Add' : 'Remove'} (USD)`}
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={adjustType === 'remove' ? selectedWallet?.balance : undefined}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        icon={DollarSign}
                        placeholder="0.00"
                        required
                    />
                </div>

                <Input
                    label="Website (optional)"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    icon={Globe}
                    placeholder="e.g., Manual review, Admin tool"
                />

                <Input
                    label="Reason (optional)"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Price appreciation, Manual correction"
                />

                <TransactionDateTimeFields
                    dateValue={transactionDate}
                    timeValue={transactionTime}
                    onDateChange={setTransactionDate}
                    onTimeChange={setTransactionTime}
                />

                {/* Aviso */}
                <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                    <p className="text-xs text-info">
                        This will directly adjust the wallet balance without creating a complex transaction. Use this for price appreciation/depreciation corrections.
                    </p>
                </div>
            </div>
        </Modal>
    );
};
