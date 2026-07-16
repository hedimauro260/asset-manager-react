import React from 'react';
//import { Plus, ArrowRightLeft, ArrowDownToLine } from 'lucide-react';
//import { Card, CardBody } from '../../ui/card';

export interface ActionButton {
    icon: React.ElementType;
    label: string;
    description: string;
    onClick: () => void;
    color?: string;
}

export interface ActionButtonsProps {
    actions: ActionButton[];
    className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    actions,
    className = ''
}) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
            {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg hover:bg-surface-elevated hover:border-primary/30 transition-all duration-fast group text-left"
                    >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon size={24} className="text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-text-primary">{action.label}</p>
                            <p className="text-xs text-text-muted">{action.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};