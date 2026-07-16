import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../button';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    className = ''
}) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Gerar números de página visíveis (max 5 números + ellipsis)
    const getVisiblePages = (): (number | '...')[] => {
        const pages: (number | '...')[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className={`flex items-center justify-between ${className}`}>
            {/* Texto de informação */}
            <p className="text-sm text-text-muted">
                Showing <span className="font-medium text-text-secondary">{startItem}</span> to{' '}
                <span className="font-medium text-text-secondary">{endItem}</span> of{' '}
                <span className="font-medium text-text-secondary">{totalItems}</span> results
            </p>

            {/* Controles de navegação */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    icon={ChevronLeft}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                />

                {getVisiblePages().map((page, index) =>
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-text-muted">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-primary text-white'
                                : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    icon={ChevronRight}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                />
            </div>
        </div>
    );
};