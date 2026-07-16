import React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardBody } from '../../ui/card';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        direction: TrendDirection;
        label?: string;
    };
    subtitle?: string;
    prefix?: string;
    suffix?: string;
    color?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
    loading?: boolean;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    subtitle,
    prefix,
    suffix,
    color = 'primary',
    loading = false,
    className = ''
}) => {
    const colorClasses = {
        primary: 'text-primary bg-primary/10',
        success: 'text-success bg-success/10',
        danger: 'text-danger bg-danger/10',
        warning: 'text-warning bg-warning/10',
        info: 'text-info bg-info/10'
    };

    const trendIcon = {
        up: TrendingUp,
        down: TrendingDown,
        stable: Minus
    };

    const TrendIcon = trend ? trendIcon[trend.direction] : null;

    return (
        <Card className={className}>
            <CardBody className="space-y-4">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-1">
                    <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                        <Icon size={20} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-text-secondary">
                            {title}
                        </p>

                        {loading ? (
                            <div className="h-8 w-32 animate-pulse bg-border rounded" />
                        ) : (
                            <div className="flex items-baseline gap-1">
                                {prefix && (
                                    <span className="text-lg font-medium text-text-muted">
                                        {prefix}
                                    </span>
                                )}
                                <span className="text-2xl font-weight-bold text-text-primary font-family-mono">
                                    {value}
                                </span>
                                {suffix && (
                                    <span className="text-sm font-medium text-text-muted">
                                        {suffix}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>


                </div>

                {/* Trend */}
                {trend && !loading && (
                    <div className="flex flex-wrap items-start">
                        {TrendIcon && (
                            <TrendIcon
                                size={16}
                                className={
                                    trend.direction === 'up'
                                        ? 'text-success'
                                        : trend.direction === 'down'
                                            ? 'text-danger'
                                            : 'text-text-muted'
                                }
                            />
                        )}
                        <span
                            className={`ml-1.5 flex-1 text-sm font-medium font-mono ${trend.direction === 'up'
                                ? 'text-success'
                                : trend.direction === 'down'
                                    ? 'text-danger'
                                    : 'text-text-muted'
                                }`}
                        >
                            {trend.direction === 'up' ? '+' : ''}
                            {trend.value}%
                        </span>
                        {trend.label && (
                            <span className="w-full flex-none text-xs text-text-muted">
                                {trend.label}
                            </span>
                        )}
                    </div>
                )}

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-xs text-text-muted">
                        {subtitle}
                    </p>
                )}
            </CardBody>
        </Card>
    );
};