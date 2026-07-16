import React, { useState } from 'react';
import { Modal } from '../../ui/modal';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { DollarSign, Globe } from 'lucide-react';
import type { Asset } from '../../../types';
import { TransactionDateTimeFields } from '../TransactionDateTimeFields';
import { combineTransactionDateTime, getCurrentTransactionDateTime } from '../transactionDateTime';

export interface AddFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        walletId: string;
        assetId: string;
        amount: number;
        description?: string;
        website?: string;
        date: Date;
    }) => Promise<void>;
    wallets: { id: string; name: string; balance?: number }[];
    assets: Asset[];
    defaultWalletId?: string;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    wallets,
    assets,
    defaultWalletId = '', // ✅ Desestruturar com valor padrão
}) => {
    const [walletId, setWalletId] = useState(defaultWalletId); // ✅ Usar default diretamente
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
            setWalletId(defaultWalletId || '');
            setAssetId('');
            setAmount('');
            setDescription('');
            setWebsite('');
            setTransactionDate(currentDateTime.date);
            setTransactionTime(currentDateTime.time);
        }
    }, [isOpen, defaultWalletId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🔵 [AddFundsModal] handleSubmit:', { walletId, assetId, amount, website, transactionDate, transactionTime });

        if (!walletId || !assetId || !amount) {
            console.warn('🟡 [AddFundsModal] Validação falhou');
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                walletId,
                assetId,
                amount: parseFloat(amount),
                description: description || undefined,
                website: website.trim() || undefined,
                date: combineTransactionDateTime(transactionDate, transactionTime)
            });
            console.log('🟢 [AddFundsModal] Sucesso!');
            onClose();
        } catch (error) {
            console.error(' [AddFundsModal] Erro:', error);
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
                disabled={!walletId || !assetId || !amount || loading}
            >
                Add Funds
            </Button>
        </>
    );

    return (
            <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Funds"
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
                        {wallets.map(wallet => (
                            <option key={wallet.id} value={wallet.id}>
                                {wallet.name}
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
                    placeholder="e.g., FreeBitcoin, FaucetPay, Coinbase"
                />

                <Input
                    label="Description (optional)"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Daily reward, Sign-up bonus"
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
