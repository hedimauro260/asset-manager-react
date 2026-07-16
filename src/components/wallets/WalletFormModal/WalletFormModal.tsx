import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/modal';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { WalletType, type Wallet } from '../../../types';
import { Check } from 'lucide-react';

export type WalletFormMode = 'add' | 'edit';

export interface WalletFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        name: string;
        description?: string;
        type: WalletType;
        color: string;
    }) => Promise<void>;
    mode: WalletFormMode;
    wallet?: Wallet; // Apenas para modo 'edit'
    existingWalletNames?: string[]; // Para validação de nome único
    loading?: boolean;
}

// Cores predefinidas para seleção
const AVAILABLE_COLORS = [
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Emerald', value: '#10B981' },
    { name: 'Yellow', value: '#F0B90B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Pink', value: '#EC4899' }
];

// Tipos de wallet disponíveis
const WALLET_TYPES: { value: WalletType; label: string }[] = [
    { value: WalletType.Exchange, label: 'Exchange' },
    { value: WalletType.Bank, label: 'Bank' },
    { value: WalletType.Faucet, label: 'Faucet' },
    { value: WalletType.ColdWallet, label: 'Cold Wallet' },
    { value: WalletType.HotWallet, label: 'Hot Wallet' },
    { value: WalletType.Cash, label: 'Cash' },
    { value: WalletType.Other, label: 'Other' }
];

export const WalletFormModal: React.FC<WalletFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    mode,
    wallet,
    existingWalletNames = [],
    loading = false
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<WalletType>(WalletType.HotWallet);
    const [color, setColor] = useState(AVAILABLE_COLORS[0].value);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Preencher formulário quando em modo edit
    useEffect(() => {
        if (mode === 'edit' && wallet) {
            setName(wallet.name);
            setDescription(wallet.description || '');
            setType(wallet.type);
            setColor(wallet.color || AVAILABLE_COLORS[0].value);
        } else if (mode === 'add') {
            // Resetar formulário
            setName('');
            setDescription('');
            setType(WalletType.HotWallet);
            setColor(AVAILABLE_COLORS[0].value);
        }
        setErrors({});
    }, [mode, wallet, isOpen]);

    // Validação do formulário
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Nome obrigatório
        if (!name.trim()) {
            newErrors.name = 'Wallet name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Nome único (exceto no modo edit para a própria wallet)
        const trimmedName = name.trim();
        const isDuplicate = existingWalletNames.some(
            existingName => existingName.toLowerCase() === trimmedName.toLowerCase()
        );

        if (mode === 'add' && isDuplicate) {
            newErrors.name = 'A wallet with this name already exists';
        } else if (mode === 'edit' && wallet && isDuplicate && trimmedName !== wallet.name) {
            newErrors.name = 'A wallet with this name already exists';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                type,
                color
            });
            onClose();
        } catch (error) {
            console.error('Failed to save wallet:', error);
            setErrors({ submit: error instanceof Error ? error.message : 'Failed to save wallet' });
        }
    };

    const title = mode === 'add' ? 'Add New Wallet' : 'Edit Wallet';
    const submitLabel = mode === 'add' ? 'Create Wallet' : 'Save Changes';

    const footer = (
        <>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
            </Button>
            <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
                form="wallet-form"
            >
                {submitLabel}
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={footer}
            size="md"
        >
            <form id="wallet-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Campo Nome */}
                <Input
                    label="Wallet Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., My Savings Wallet"
                    error={errors.name}
                    required
                />

                {/* Campo Descrição */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Description <span className="text-text-muted">(optional)</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of this wallet..."
                        rows={3}
                        className="w-full px-4 py-2.5 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    />
                </div>

                {/* Campo Tipo */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Wallet Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as WalletType)}
                        className="w-full h-10 px-4 bg-surface border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                    >
                        {WALLET_TYPES.map(wt => (
                            <option key={wt.value} value={wt.value}>
                                {wt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Seletor de Cor */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Color
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                        {AVAILABLE_COLORS.map((c) => (
                            <button
                                key={c.value}
                                type="button"
                                onClick={() => setColor(c.value)}
                                className={`w-full aspect-square rounded-lg border-2 transition-all ${color === c.value
                                        ? 'border-text-primary scale-110 shadow-lg'
                                        : 'border-transparent hover:scale-105'
                                    }`}
                                style={{ backgroundColor: c.value }}
                                aria-label={`Select ${c.name} color`}
                                title={c.name}
                            >
                                {color === c.value && (
                                    <Check size={16} className="text-white mx-auto" strokeWidth={3} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Erro geral de submit */}
                {errors.submit && (
                    <div className="p-3 bg-danger/10 border border-danger/20 rounded-md">
                        <p className="text-sm text-danger">{errors.submit}</p>
                    </div>
                )}
            </form>
        </Modal>
    );
};