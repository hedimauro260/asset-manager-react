import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
    AreaChart,
    Area,
    ResponsiveContainer
} from 'recharts';
import { Card, CardBody } from '../../ui/card';

export interface BalanceCardProps {
    balance: number;
    change: number;
    changePercent: number;
    chartData: { value: number }[];
    period?: string;
    onPeriodChange?: (period: string) => void;
    className?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    change,
    changePercent,
    chartData,
    period = 'Today',
    onPeriodChange,
    className = ''
}) => {
    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = e.target.value;
        onPeriodChange?.(newPeriod);
    };
    return (
        <Card className={className}>
            <CardBody className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-text-secondary mb-2">Total Balance</p>
                        <h2 className="text-4xl font-bold text-text-primary font-mono">
                            ${balance.toFixed(2)}
                        </h2>
                    </div>

                    <select
                        value={period}
                        onChange={handlePeriodChange}
                        className="h-8 px-3 bg-surface-elevated border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Today</option>
                        <option>7 Days</option>
                        <option>30 Days</option>
                        <option>All Time</option>
                    </select>
                </div>

                {/* Change */}
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-success" />
                    <span className="text-sm font-medium text-success font-mono">
                        +${change.toFixed(2)} ({changePercent.toFixed(2)}%)
                    </span>
                    <span className="text-sm text-text-muted">today</span>
                </div>

                {/* Sparkline Chart */}
                <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#22C55E"
                                strokeWidth={2}
                                fill="url(#balanceGradient)"
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardBody>
        </Card>
    );
};