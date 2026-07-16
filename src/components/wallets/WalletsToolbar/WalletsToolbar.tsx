import React from 'react';
import { Search, Grid3X3, List } from 'lucide-react';
import { Button } from '../../ui/button';

export const WalletsToolbar: React.FC = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-text-primary">
                All Wallets
            </h2>

            <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                        type="text"
                        placeholder="Search wallets..."
                        className="w-full h-9 pl-9 pr-4 bg-surface border border-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                </div>

                {/* View Toggle (Visual apenas por enquanto) */}
                <div className="flex bg-surface border border-border rounded-md p-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 bg-surface-elevated text-text-primary shadow-sm"
                        aria-label="Grid view"
                    >
                        <Grid3X3 size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-text-muted hover:text-text-primary"
                        aria-label="List view"
                    >
                        <List size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};