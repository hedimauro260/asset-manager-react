import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { Button } from '../button/Button';

export interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-surface-elevated flex items-center justify-center">
                <Icon size={32} className="text-text-muted" />
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-text-secondary mb-6 max-w-sm">
                    {description}
                </p>
            )}

            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};