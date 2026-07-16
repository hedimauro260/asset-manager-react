import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    type TooltipProps
} from 'recharts';
import type {
    ValueType,
    NameType
} from 'recharts/types/component/DefaultTooltipContent';
import { Card, CardHeader, CardBody } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';

export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}

export interface PortfolioChartProps {
    data: ChartDataPoint[];
    title?: string;
    subtitle?: string;
    loading?: boolean;
    color?: string;
    gradientFrom?: string;
    gradientTo?: string;
    height?: number;
    className?: string;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
    data,
    title = 'Portfolio Overview',
    subtitle,
    loading = false,
    color = '#7C5CFC',
    gradientFrom = '#7C5CFC',
    gradientTo = '#7C5CFC00',
    height = 300,
    className = ''
}) => {
    if (loading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <Skeleton width="150px" height="20px" />
                </CardHeader>
                <CardBody>
                    <Skeleton height={`${height}px`} />
                </CardBody>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className={className}>
                <CardHeader>
                    <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                </CardHeader>
                <CardBody>
                    <div className="flex items-center justify-center h-64 text-text-muted">
                        No data available
                    </div>
                </CardBody>
            </Card>
        );
    }

    // ✅ Tooltip tipado corretamente
    const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            const value = payload[0].value as number;
            return (
                <div className="bg-surface-elevated border border-border rounded-lg p-3 shadow-dropdown">
                    <p className="text-xs text-text-muted mb-1">{label}</p>
                    <p className="text-lg font-bold text-text-primary font-mono">
                        ${value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className={className}>
            <CardHeader className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-sm text-text-secondary mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
            </CardHeader>

            <CardBody>
                <ResponsiveContainer width="100%" height={height}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={gradientFrom} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={gradientTo} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#243146"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="date"
                            stroke="#6B7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            stroke="#6B7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            fill="url(#colorGradient)"
                            dot={false}
                            activeDot={{
                                r: 6,
                                fill: color,
                                stroke: '#0B1220',
                                strokeWidth: 2
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    );
};