import React from 'react';

export interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width = '100%',
    height = 'auto'
}) => {
    const baseClasses = 'animate-pulse bg-border rounded';

    const variantClasses = {
        text: 'h-4',
        circular: 'rounded-full',
        rectangular: ''
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{ width, height }}
        />
    );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
    lines = 3,
    className = ''
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} variant="text" width={i === lines - 1 ? '60%' : '100%'} />
            ))}
        </div>
    );
};