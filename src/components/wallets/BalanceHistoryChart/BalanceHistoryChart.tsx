import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
// Importa o tipo interno do Recharts para as propriedades do Tooltip
import type { TooltipProps } from 'recharts';
// Importa tipos utilitários para extrair as propriedades de valor/nome se necessário
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export interface BalanceHistoryChartProps {
    data: Array<{ date: string; value: number }>;
    color?: string;
    period?: string;
    onPeriodChange?: (period: string) => void;
    className?: string;
}

const PERIODS = ['7 Days', '30 Days', '90 Days', '1 Year', 'All'];

export const BalanceHistoryChart: React.FC<BalanceHistoryChartProps> = ({
    data,
    color = '#8B5CF6',
    period = '7 Days',
    onPeriodChange,
    className = ''
}) => {

    // ✅ CustomTooltip tipado de forma segura sem o uso de 'any'
    const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
        active,
        payload,
        label
    }) => {
        if (active && payload && payload.length && typeof payload[0].value === 'number') {
            return (
                <div className="bg-surface-elevated border border-border rounded-lg p-3 shadow-dropdown">
                    <p className="text-xs text-text-muted mb-1">{label}</p>
                    <p className="text-base font-bold text-text-primary font-mono">
                        ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header com Dropdown de Período */}
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-primary">
                    Balance History ({period})
                </h4>

                {onPeriodChange && (
                    <select
                        value={period}
                        onChange={(e) => onPeriodChange(e.target.value)}
                        className="h-8 px-3 bg-surface-elevated border border-border rounded-md text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                        {PERIODS.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Gráfico */}
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#243146"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="date"
                            stroke="#6B7280"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            stroke="#6B7280"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                            width={40}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: color,
                                stroke: '#0B1220',
                                strokeWidth: 2
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};