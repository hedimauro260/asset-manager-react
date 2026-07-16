import React from 'react';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';

export interface MoreActionsSectionProps {
    onEdit?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    className?: string;
}

export const MoreActionsSection: React.FC<MoreActionsSectionProps> = ({
    onEdit,
    onDuplicate,
    onDelete,
    className = ''
}) => {
    return (
        <div className={`space-y-4 ${className}`}>
            <h4 className="text-sm font-medium text-text-primary">More Actions</h4>

            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant="secondary"
                    icon={Pencil}
                    onClick={onEdit}
                    className="w-full justify-center text-sm"
                >
                    Edit Wallet
                </Button>

                <Button
                    variant="secondary"
                    icon={Copy}
                    onClick={onDuplicate}
                    className="w-full justify-center text-sm"
                >
                    Duplicate
                </Button>

                <Button
                    variant="danger"
                    icon={Trash2}
                    onClick={onDelete}
                    className="w-full justify-center text-sm"
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};