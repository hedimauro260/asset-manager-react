import React from 'react';
import { Pencil } from 'lucide-react';

export interface WalletInfoSectionProps {
    walletName: string;
    type: string;
    createdAt: string;
    currency: string;
    status: 'active' | 'inactive';
    notes?: string;
    onEditName?: () => void;
    onEditNotes?: () => void;
    className?: string;
}

export const WalletInfoSection: React.FC<WalletInfoSectionProps> = ({
    walletName,
    type,
    createdAt,
    currency,
    status,
    notes,
    onEditName,
    onEditNotes,
    className = ''
}) => {
    const rows = [
        { label: 'Wallet Name', value: walletName, editable: true, onEdit: onEditName },
        { label: 'Type', value: type, editable: false },
        { label: 'Created', value: createdAt, editable: false },
        { label: 'Currency', value: currency, editable: false },
        {
            label: 'Status',
            value: status === 'active' ? 'Active' : 'Inactive',
            editable: false,
            isBadge: true,
            badgeVariant: status === 'active' ? 'success' : 'warning'
        }
    ];

    return (
        <div className={`space-y-4 ${className}`}>
            <h4 className="text-sm font-medium text-text-primary">Wallet Info</h4>

            <div className="space-y-3">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                        <span className="text-sm text-text-muted">{row.label}</span>

                        <div className="flex items-center gap-2">
                            {row.isBadge ? (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${row.badgeVariant === 'success'
                                        ? 'bg-success/10 text-success'
                                        : 'bg-warning/10 text-warning'
                                    }`}>
                                    {row.value}
                                </span>
                            ) : (
                                <span className="text-sm text-text-primary">{row.value}</span>
                            )}

                            {row.editable && row.onEdit && (
                                <button
                                    onClick={row.onEdit}
                                    className="p-1 rounded hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors"
                                    aria-label={`Edit ${row.label}`}
                                >
                                    <Pencil size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Notas (campo separado por ser multiline) */}
            {notes !== undefined && (
                <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-muted">Notes</span>
                        {onEditNotes && (
                            <button
                                onClick={onEditNotes}
                                className="p-1 rounded hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors"
                                aria-label="Edit notes"
                            >
                                <Pencil size={14} />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        {notes || <span className="text-text-muted italic">No notes</span>}
                    </p>
                </div>
            )}
        </div>
    );
};