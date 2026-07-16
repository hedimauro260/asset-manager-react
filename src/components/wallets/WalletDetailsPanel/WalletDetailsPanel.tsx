import React, { useEffect, useState } from 'react';
import { X, Plus, ArrowRightLeft, ArrowDownToLine, Settings, Wallet as WalletIcon } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { BalanceHistoryChart } from '../BalanceHistoryChart';
import { WalletInfoSection } from '../WalletInfoSection';
import { MoreActionsSection } from '../MoreActionsSection';
import type { WalletWithStats } from '../../../utils/walletMapper';
import { Tabs } from '../../ui/Tabs';

export interface WalletDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    wallet: WalletWithStats | null;
    onQuickAction?: (action: 'add' | 'transfer' | 'withdraw' | 'adjust') => void;
    onEditWallet?: (walletId: string) => void;
    onDuplicateWallet?: (walletId: string) => void;
    onDeleteWallet?: (walletId: string) => void;
}

//! Mock de histórico de saldo - será substituído por dados reais no futuro
// ✅ Parâmetro 'color' removido pois não era utilizado na geração dos dados
const generateMockHistory = (baseValue: number) => {
    const data = [];
    const now = new Date();
    let currentValue = baseValue * 0.6;

    for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        // Simula uma tendência de alta com variação
        currentValue = currentValue + (baseValue - currentValue) * 0.3 + (Math.random() - 0.4) * 0.5;
        currentValue = Math.max(0, currentValue);

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: parseFloat(currentValue.toFixed(2))
        });
    }

    // Garante que o último valor seja o saldo atual
    if (data.length > 0) {
        data[data.length - 1].value = baseValue;
    }

    return data;
};

const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'History' },
    { id: 'assets', label: 'Assets' },
    { id: 'settings', label: 'Settings' }
];

export const WalletDetailsPanel: React.FC<WalletDetailsPanelProps> = ({
    isOpen,
    onClose,
    wallet,
    onQuickAction,
    onEditWallet,
    onDuplicateWallet,
    onDeleteWallet
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [chartPeriod, setChartPeriod] = useState('7 Days');

    // Bloquear scroll do body quando o painel estiver aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setActiveTab('overview'); // Reset para overview ao abrir
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Fechar com a tecla ESC
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!wallet) return null;

    // ✅ Chamada simplificada sem passar o wallet.color
    const historyData = generateMockHistory(wallet.balance);

    return (
        <>
            {/* Backdrop (Overlay) */}
            <div
                className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Painel Lateral - Responsivo: tela cheia em mobile, 400px em desktop */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-120 bg-surface border-l border-border shadow-modal z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="panel-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${wallet.color}20`, color: wallet.color }}
                        >
                            <WalletIcon size={20} />
                        </div>
                        <div>
                            <h2 id="panel-title" className="text-lg font-semibold text-text-primary">
                                {wallet.name}
                            </h2>
                            <Badge
                                variant={wallet.status === 'active' ? 'success' : 'warning'}
                                className="mt-1"
                            >
                                {wallet.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors"
                        aria-label="Close panel"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-6 space-y-6">

                        {/* Seção Principal: Saldo e Ações Rápidas */}
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <p className="text-sm text-text-secondary">Current Balance</p>
                                <h3 className="text-4xl font-bold text-text-primary font-mono">
                                    ${wallet.balance.toFixed(2)}
                                </h3>
                                <p className="text-sm text-text-muted">
                                    {wallet.percentage.toFixed(1)}% of total portfolio
                                </p>
                            </div>

                            {/* 4 Botões de Ação Rápida */}
                            <div className="grid grid-cols-4 gap-3">
                                <QuickActionButton
                                    icon={Plus}
                                    label="Add Funds"
                                    color="text-success"
                                    onClick={() => onQuickAction?.('add')}
                                />
                                <QuickActionButton
                                    icon={ArrowRightLeft}
                                    label="Transfer"
                                    color="text-info"
                                    onClick={() => onQuickAction?.('transfer')}
                                />
                                <QuickActionButton
                                    icon={ArrowDownToLine}
                                    label="Withdraw"
                                    color="text-danger"
                                    onClick={() => onQuickAction?.('withdraw')}
                                />
                                <QuickActionButton
                                    icon={Settings}
                                    label="Adjust"
                                    color="text-text-secondary"
                                    onClick={() => onQuickAction?.('adjust')}
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs
                            tabs={TABS}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />

                        {/* Conteúdo das Tabs */}
                        <div className="space-y-6">
                            {activeTab === 'overview' && (
                                <>
                                    {/* Gráfico de Histórico */}
                                    <BalanceHistoryChart
                                        data={historyData}
                                        color={wallet.color}
                                        period={chartPeriod}
                                        onPeriodChange={setChartPeriod}
                                    />

                                    {/* Informações da Wallet */}
                                    <WalletInfoSection
                                        walletName={wallet.name}
                                        type="Exchange"
                                        createdAt="Jun 15, 2026"
                                        currency="USD"
                                        status={wallet.status}
                                        notes="My main crypto wallet for trading savings."
                                        onEditName={() => console.log('Edit name')}
                                        onEditNotes={() => console.log('Edit notes')}
                                    />

                                    {/* Mais Ações */}
                                    <MoreActionsSection
                                        onEdit={() => onEditWallet?.(wallet.id)}
                                        onDuplicate={() => onDuplicateWallet?.(wallet.id)}
                                        onDelete={() => onDeleteWallet?.(wallet.id)}
                                    />
                                </>
                            )}

                            {activeTab === 'history' && (
                                <div className="text-center py-12 text-text-muted">
                                    <p className="text-sm">Transaction history coming in Group 2.4...</p>
                                </div>
                            )}

                            {activeTab === 'assets' && (
                                <div className="text-center py-12 text-text-muted">
                                    <p className="text-sm">Assets breakdown coming soon...</p>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="text-center py-12 text-text-muted">
                                    <p className="text-sm">Wallet settings coming soon...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Sub-componente para os botões de ação rápida
interface QuickActionButtonProps {
    icon: React.ElementType;
    label: string;
    color: string;
    onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon: Icon, label, color, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-surface-elevated border border-border hover:border-primary/50 hover:bg-surface transition-all duration-fast group"
        >
            <Icon size={20} className={`${color} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary">
                {label}
            </span>
        </button>
    );
};