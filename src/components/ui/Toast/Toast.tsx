import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

export interface ToastProps {
    toast: ToastData;
    onRemove: (id: string) => void;
}

const toastConfig: Record<ToastType, { icon: React.ElementType; bgColor: string; borderColor: string; iconColor: string }> = {
    success: {
        icon: CheckCircle2,
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        iconColor: 'text-success'
    },
    error: {
        icon: XCircle,
        bgColor: 'bg-danger/10',
        borderColor: 'border-danger/20',
        iconColor: 'text-danger'
    },
    warning: {
        icon: AlertCircle,
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        iconColor: 'text-warning'
    },
    info: {
        icon: Info,
        bgColor: 'bg-info/10',
        borderColor: 'border-info/20',
        iconColor: 'text-info'
    }
};

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
    const config = toastConfig[toast.type];
    const Icon = config.icon;

    useEffect(() => {
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                onRemove(toast.id);
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.id, toast.duration, onRemove]);

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-dropdown animate-in slide-in-from-right-full fade-in duration-300`}
            role="alert"
        >
            <Icon size={20} className={config.iconColor} shrink-0 />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                    {toast.title}
                </p>
                {toast.message && (
                    <p className="text-xs text-text-secondary mt-1">
                        {toast.message}
                    </p>
                )}
            </div>

            <button
                onClick={() => onRemove(toast.id)}
                className="p-1 rounded hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-colors"
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export interface ToastContainerProps {
    toasts: ToastData[];
    onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed top-6 right-6 space-y-3 max-w-sm w-full pointer-events-none"
            style={{ zIndex: 9999 }} // ← Z-INDEX ALTO PARA FICAR ACIMA DE TUDO
        >
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast toast={toast} onRemove={onRemove} />
                </div>
            ))}
        </div>
    );
};