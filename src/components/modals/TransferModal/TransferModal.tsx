import React, { useState } from 'react';
import { Modal } from '../../ui/modal';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { DollarSign, Globe } from 'lucide-react';
import type { Asset } from '../../../types';
import { TransactionDateTimeFields } from '../TransactionDateTimeFields';
import { combineTransactionDateTime, getCurrentTransactionDateTime } from '../transactionDateTime';

export interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        fromWalletId: string;
        toWalletId: string;
        assetId: string;
        amount: number;
        description?: string;
        website?: string;
        date: Date;
    }) => Promise<void>;
    wallets: { id: string; name: string; balance: number }[];
    assets: Asset[];
    defaultFromWalletId?: string;
}

export const TransferModal: React.FC<TransferModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    wallets,
    assets,
    defaultFromWalletId = '', // ✅ Desestruturar com valor padrão
}) => {
    const [fromWalletId, setFromWalletId] = useState(defaultFromWalletId);
    const [toWalletId, setToWalletId] = useState('');
    const [assetId, setAssetId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [transactionTime, setTransactionTime] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            const currentDateTime = getCurrentTransactionDateTime();
            setFromWalletId(defaultFromWalletId || '');
            setToWalletId('');
            setAssetId('');
            setAmount('');
            setDescription('');
            setWebsite('');
            setTransactionDate(currentDateTime.date);
            setTransactionTime(currentDateTime.time);
        }
    }, [isOpen, defaultFromWalletId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🔵 [TransferModal] handleSubmit:', { fromWalletId, toWalletId, assetId, amount, website, transactionDate, transactionTime });

        if (!fromWalletId || !toWalletId || !assetId || !amount) return;
        if (fromWalletId === toWalletId) {
            alert('Cannot transfer to the same wallet');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                fromWalletId,
                toWalletId,
                assetId,
                amount: parseFloat(amount),
                description: description || undefined,
                website: website.trim() || undefined,
                date: combineTransactionDateTime(transactionDate, transactionTime)
            });
            console.log('🟢 [TransferModal] Sucesso!');
            onClose();
        } catch (error) {
            console.error('🔴 [TransferModal] Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <>
            <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={!fromWalletId || !toWalletId || !assetId || !amount || loading}
            >
                Transfer
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Transfer Funds"
            footer={footer}
            onSubmit={handleSubmit}
            size="lg"
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        From Wallet
                    </label>
                    <select
                        value={fromWalletId}
                        onChange={(e) => setFromWalletId(e.target.value)}
                        className="input"
                        required
                    >
                        <option value="">Select source wallet</option>
                        {wallets.map(w => (
                            <option key={w.id} value={w.id}>
                                {w.name} (${w.balance.toFixed(2)})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        To Wallet
                    </label>
                    <select
                        value={toWalletId}
                        onChange={(e) => setToWalletId(e.target.value)}
                        className="input"
                        required
                    >
                        <option value="">Select destination wallet</option>
                        {wallets.filter(w => w.id !== fromWalletId).map(w => (
                            <option key={w.id} value={w.id}>
                                {w.name}
                            </option>
                        ))}
                    </select>
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
                        label="Amount (USD)"
                        type="number"
                        step="0.01"
                        min="0.01"
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
                    placeholder="e.g., Exchange, Bridge, Internal"
                />

                <Input
                    label="Description (optional)"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Transfer to savings"
                />

                <TransactionDateTimeFields
                    dateValue={transactionDate}
                    timeValue={transactionTime}
                    onDateChange={setTransactionDate}
                    onTimeChange={setTransactionTime}
                />
            </div>
        </Modal>
    );
};
