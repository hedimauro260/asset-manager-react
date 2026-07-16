import React from 'react';
import { Filter } from 'lucide-react';

export interface ActivityToolbarProps {
    selectedWallet: string;
    selectedType: string;
    selectedPeriod: string;
    wallets: string[];
    types: string[];
    periods: string[];
    onWalletChange: (wallet: string) => void;
    onTypeChange: (type: string) => void;
    onPeriodChange: (period: string) => void;
    className?: string;
}

export const ActivityToolbar: React.FC<ActivityToolbarProps> = ({
    selectedWallet,
    selectedType,
    selectedPeriod,
    wallets,
    types,
    periods,
    onWalletChange,
    onTypeChange,
    onPeriodChange,
    className = ''
}) => {
    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            <Filter size={16} className="text-text-muted" />

            {/* Filtro de Wallet */}
            <select
                value={selectedWallet}
                onChange={(e) => onWalletChange(e.target.value)}
                className="h-9 px-3 bg-surface-elevated border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                {wallets.map(wallet => (
                    <option key={wallet} value={wallet}>{wallet}</option>
                ))}
            </select>

            {/* Filtro de Tipo */}
            <select
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                className="h-9 px-3 bg-surface-elevated border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>

            {/* Filtro de Período */}
            <select
                value={selectedPeriod}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="h-9 px-3 bg-surface-elevated border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
                {periods.map(period => (
                    <option key={period} value={period}>{period}</option>
                ))}
            </select>
        </div>
    );
};