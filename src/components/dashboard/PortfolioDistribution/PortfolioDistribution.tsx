import React from 'react';
import { Wallet, MoreHorizontal } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../ui/card';
import { Button } from '../../ui/button';

export interface WalletDistribution {
    id: string;
    name: string;
    balance: number;
    percentage: number;
    color: string;
    icon?: React.ReactNode;
}

export interface PortfolioDistributionProps {
    wallets: WalletDistribution[];
    onViewAll?: () => void;
    className?: string;
}

export const PortfolioDistribution: React.FC<PortfolioDistributionProps> = ({
    wallets,
    onViewAll,
    className = ''
}) => {
    return (
        <Card className={className}>
            <CardHeader className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">
                    Portfolio Distribution
                </h2>
                <button
                    onClick={onViewAll}
                    className="text-sm text-primary hover:text-primary-hover transition-colors"
                >
                    View all wallets
                </button>
            </CardHeader>

            <CardBody className="space-y-4">
                {wallets.map((wallet) => (
                    <div
                        key={wallet.id}
                        className="flex items-center gap-4 group"
                    >
                        {/* Icon */}
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${wallet.color}20` }}
                        >
                            {wallet.icon || <Wallet size={16} style={{ color: wallet.color }} />}
                        </div>

                        {/* Name */}
                        <span className="text-sm font-medium text-text-primary w-24 truncate">
                            {wallet.name}
                        </span>

                        {/* Progress bar */}
                        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-normal"
                                style={{
                                    width: `${wallet.percentage}%`,
                                    backgroundColor: wallet.color
                                }}
                            />
                        </div>

                        {/* Balance */}
                        <span className="text-sm font-medium text-text-primary font-mono w-20 text-right">
                            ${wallet.balance.toFixed(2)}
                        </span>

                        {/* Percentage */}
                        <span className="text-sm text-text-secondary font-mono w-12 text-right">
                            {wallet.percentage.toFixed(2)}%
                        </span>

                        {/* Actions */}
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={MoreHorizontal}
                            className="opacity-40 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};