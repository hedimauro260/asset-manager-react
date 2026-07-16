import React from 'react';
import { Wallet, MoreVertical } from 'lucide-react';
import { Card, CardBody } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

export interface WalletCardProps {
    id: string;
    name: string;
    balance: number;
    percentage: number;
    color: string; // Cor hexadecimal para ícone e barra de progresso
    status: 'active' | 'inactive';
    isPrimary?: boolean;
    onActionClick?: (e: React.MouseEvent) => void;
    onClick?: () => void;
    className?: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({
    name,
    balance,
    percentage,
    color,
    status,
    isPrimary = false,
    onActionClick,
    onClick,
    className = ''
}) => {
    // Garante que a porcentagem esteja entre 0 e 100 para a barra de progresso
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    return (
        <Card
            className={`cursor-pointer transition-all duration-fast hover:shadow-dropdown hover:border-primary/30 group ${className}`}
            onClick={onClick}
        >
            <CardBody className="space-y-4">
                {/* Header: Ícone, Nome, Badge e Ações */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {/* Ícone com cor dinâmica */}
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                            style={{ backgroundColor: `${color}20`, color: color }}
                        >
                            <Wallet size={20} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-text-primary">
                                    {name}
                                </h3>
                                {isPrimary && (
                                    <Badge variant="primary" className="text-[10px] px-1.5 py-0.5 h-5 font-medium">
                                        Primary
                                    </Badge>
                                )}
                            </div>

                            {/* Indicador de Status */}
                            <div className="flex items-center gap-1.5 mt-1">
                                <span
                                    className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-success' : 'bg-text-muted'
                                        }`}
                                />
                                <span className="text-xs text-text-secondary capitalize">
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Menu de Ações */}
                    {onActionClick && (
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={MoreVertical}
                            onClick={(e) => {
                                e.stopPropagation(); // Evita disparar o onClick do card
                                onActionClick(e);
                            }}
                            className="text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Wallet actions"
                        />
                    )}
                </div>

                {/* Saldo e Porcentagem */}
                <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-text-primary font-mono">
                            ${balance.toFixed(2)}
                        </span>
                        <span className="text-sm font-medium text-text-secondary font-mono">
                            {percentage.toFixed(1)}%
                        </span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-normal ease-out"
                            style={{
                                width: `${clampedPercentage}%`,
                                backgroundColor: color
                            }}
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};