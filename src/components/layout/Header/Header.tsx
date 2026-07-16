import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Command } from 'lucide-react';
//import { Button } from '../../ui/button';
//import { Badge } from '../../ui/badge';

export interface HeaderProps {
    onSearch?: (query: string) => void;
    notificationCount?: number;
    userName?: string;
    userInitials?: string;
}

export const Header: React.FC<HeaderProps> = ({
    onSearch,
    notificationCount = 0,
    userName = 'Hedi Mauro',
    userInitials = 'HM'
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('global-search')?.focus();
        }

        if (e.key === 'Enter') {
            onSearch?.(searchValue);
        }
    };

    return (
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                        id="global-search"
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search anything..."
                        className="w-full h-10 pl-10 pr-16 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-fast"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-surface-elevated border border-border rounded text-xs text-text-muted">
                        <Command size={12} />
                        <span>K</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-surface transition-colors duration-fast">
                    <Bell size={20} className="text-text-secondary" />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-primary text-white text-xs font-medium rounded-full flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                </button>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface transition-colors duration-fast"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                                {userInitials}
                            </span>
                        </div>
                        <ChevronDown size={16} className="text-text-muted" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-surface-elevated border border-border rounded-lg shadow-dropdown py-2">
                            <div className="px-4 py-2 border-b border-border">
                                <p className="text-sm font-medium text-text-primary">{userName}</p>
                                <p className="text-xs text-text-muted">Portfolio Manager</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors">
                                Profile
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface transition-colors">
                                Settings
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors">
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};