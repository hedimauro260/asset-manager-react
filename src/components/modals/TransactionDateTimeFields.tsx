import React from 'react';
import { Input } from '../ui/input';

export interface TransactionDateTimeFieldsProps {
    dateValue: string;
    timeValue: string;
    onDateChange: (value: string) => void;
    onTimeChange: (value: string) => void;
}

export const TransactionDateTimeFields: React.FC<TransactionDateTimeFieldsProps> = ({
    dateValue,
    timeValue,
    onDateChange,
    onTimeChange
}) => {
    return (
        <div className="space-y-4">
            <p className="text-sm font-medium text-text-secondary">Transaction Date &amp; Time</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Date"
                    type="date"
                    value={dateValue}
                    onChange={(e) => onDateChange(e.target.value)}
                    required
                />
                <Input
                    label="Time"
                    type="time"
                    value={timeValue}
                    onChange={(e) => onTimeChange(e.target.value)}
                    required
                />
            </div>
        </div>
    );
};
