import React from 'react';
import { Wallet, MoreVertical, Archive } from 'lucide-react';
import { Card, CardBody } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

export interface WalletCardProps {
    name: string;
    balance: string;
    percentage: number;
    icon?: React.ReactNode;
    color?: string;
    isArchived?: boolean;
    assetCount?: number;
    onMoreClick?: () => void;
    onClick?: () => void;
    className?: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({
    name,
    balance,
    percentage,
    icon,
    color = '#7C5CFC',
    isArchived = false,
    assetCount,
    onMoreClick,
    onClick,
    className = ''
}) => {
    return (
        <Card
            className={`cursor-pointer transition-all duration-fast hover:shadow-dropdown ${className}`}
            onClick={onClick}
        >
            <CardBody className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {icon ? (
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${color}20`, color }}
                            >
                                {icon}
                            </div>
                        ) : (
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${color}20`, color }}
                            >
                                <Wallet size={20} />
                            </div>
                        )}

                        <div>
                            <h3 className="font-semibold text-text-primary">
                                {name}
                            </h3>
                            {assetCount && (
                                <p className="text-xs text-text-muted">
                                    {assetCount} {assetCount === 1 ? 'asset' : 'assets'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isArchived && (
                            <Badge variant="warning" icon={Archive}>
                                Archived
                            </Badge>
                        )}

                        {onMoreClick && (
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={MoreVertical}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMoreClick();
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Balance */}
                <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-weight-bold text-text-primary font-family-mono">
                            {balance}
                        </span>
                        <span className="text-sm font-weight-medium text-text-secondary font-family-mono">
                            {percentage.toFixed(1)}%
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-normal"
                            style={{
                                width: `${percentage}%`,
                                backgroundColor: color
                            }}
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};