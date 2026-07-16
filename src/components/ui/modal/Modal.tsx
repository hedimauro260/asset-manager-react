import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../button';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    onSubmit?: (e: React.FormEvent) => void; // <-- NOVO: Permite que o Modal seja um form
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    onSubmit
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl'
    };

    // Se onSubmit for fornecido, usamos 'form' como container. 
    // Isso faz com que qualquer botão type="submit" dentro dele dispare o onSubmit.
    const Container = onSubmit ? 'form' : 'div';

    return (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4" style={{ zIndex: 998 }}>
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <Container
                className={`relative w-full ${sizeClasses[size]} bg-surface border border-border rounded-lg shadow-modal`}
                onSubmit={onSubmit}
            >
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                    <Button variant="ghost" size="sm" icon={X} onClick={onClose} />
                </div>

                <div className="p-6">
                    {children}
                </div>

                {footer && (
                    <div className="flex justify-end gap-3 p-6 border-t border-border">
                        {footer}
                    </div>
                )}
            </Container>
        </div>
    );
};