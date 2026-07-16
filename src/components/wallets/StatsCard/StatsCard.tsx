import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardBody } from '../../ui/card';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatsCardProps {
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
    color?: 'primary' | 'success' | 'danger' | 'warning';
    loading?: boolean;
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
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
        warning: 'text-warning bg-warning/10'
    };

    const trendIcon = {
        up: TrendingUp,
        down: TrendingDown,
        neutral: Minus
    };

    const TrendIcon = trend ? trendIcon[trend.direction] : null;

    return (
        <Card className={className}>
            <CardBody className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
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
                                <span className="text-2xl font-bold text-text-primary font-mono">
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

                    <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                        <Icon size={20} />
                    </div>
                </div>

                {/* Trend */}
                {trend && !loading && (
                    <div className="flex items-center gap-2">
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
                            className={`text-sm font-medium font-mono ${trend.direction === 'up'
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
                            <span className="text-xs text-text-muted">
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