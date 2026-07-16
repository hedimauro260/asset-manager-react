import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';

export interface DashboardLayoutProps {
    children: React.ReactNode;
    currentPath?: string;
    onNavigate?: (path: string) => void;
    notificationCount?: number;
    // ✅ Props para o Net Worth
    totalNetWorth?: number;
    netWorthChange?: number;
    netWorthChangePercent?: number;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    currentPath,
    onNavigate,
    notificationCount = 0,
    totalNetWorth = 0,        // ✅ Valor padrão
    netWorthChange = 0,       // ✅ Valor padrão
    netWorthChangePercent = 0 // ✅ Valor padrão
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    // Determina o path atual usando a prop ou a rota do react-router-dom
    const path = currentPath || location.pathname;

    // Gerencia a navegação mudando de rota e chamando o callback opcional
    const handleNavigate = (targetPath: string) => {
        navigate(targetPath);
        onNavigate?.(targetPath);
    };

    const handleThemeToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <Sidebar
                currentPath={path}
                onNavigate={handleNavigate} // 🔄 Alterado para usar handleNavigate
                theme={theme}
                onThemeToggle={handleThemeToggle}
                totalNetWorth={totalNetWorth}                // ✅ Dados reais
                netWorthChange={netWorthChange}              // ✅ Dados reais
                netWorthChangePercent={netWorthChangePercent} // ✅ Dados reais
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <Header
                    notificationCount={notificationCount}
                    userName="Hedi Mauro"
                    userInitials="HM"
                />

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};