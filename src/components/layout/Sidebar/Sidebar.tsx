import { useNavigate } from 'react-router-dom';
import {
    Home,
    Wallet,
    Activity,
    Globe,
    FileText,
    Settings,
    TrendingUp,
    Moon,
    Sun
} from 'lucide-react';
import { Card, CardBody } from '../../ui/card';
//import { Button } from '../../ui/button/Button';
import { Switch } from '../../ui/switch/Switch';

export interface SidebarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    totalNetWorth: number;
    netWorthChange: number;
    netWorthChangePercent: number;
}

interface MenuItem {
    path: string;
    label: string;
    icon: React.ElementType;
}

const menuItems: MenuItem[] = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/wallets', label: 'Wallets', icon: Wallet },
    { path: '/activity', label: 'Activity', icon: Activity },
    { path: '/faucets', label: 'Faucets', icon: Globe },
    { path: '/transactions', label: 'Transactions', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
    currentPath,
    onNavigate,
    theme,
    onThemeToggle,
    totalNetWorth,
    netWorthChange,
    netWorthChangePercent
}) => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
        onNavigate?.(path);
    };

    return (
        <aside className="w-64 bg-sidebar border-r border-border flex flex-col h-screen sticky top-0">
            {/* Logo & User */}
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    {/* Monogram Logo */}
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary"
                        >
                            <path d="M3 21V7l6 6 6-6v14" />
                            <path d="M15 21V7l6 6v8" />
                        </svg>
                    </div>
                </div>

                <div>
                    <h1 className="text-xl font-bold text-text-primary font-mono">
                        Hedi Mauro
                    </h1>
                    <p className="text-sm text-text-muted">
                        Portfolio Manager
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;

                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNavigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-fast ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                                }`}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Net Worth Card */}
            <div className="px-3 pb-3">
                <Card className="bg-surface-elevated">
                    <CardBody className="space-y-3">
                        <p className="text-xs text-text-muted">Total Net Worth</p>
                        <p className="text-2xl font-bold text-text-primary font-mono">
                            ${totalNetWorth.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1">
                            <TrendingUp size={14} className="text-success" />
                            <span className="text-sm font-medium text-success font-mono">
                                +${netWorthChange.toFixed(2)} ({netWorthChangePercent.toFixed(2)}%)
                            </span>
                        </div>
                        <p className="text-xs text-text-muted">vs yesterday</p>
                    </CardBody>
                </Card>
            </div>

            {/* Theme Toggle & Version */}
            <div className="p-6 space-y-4 border-t border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                        <span className="text-sm text-text-secondary">Dark Mode</span>
                    </div>
                    <Switch
                        checked={theme === 'dark'}
                        onChange={onThemeToggle}
                    />
                </div>

                <p className="text-xs text-text-muted font-mono">
                    version 0.10
                </p>
            </div>
        </aside>
    );
};