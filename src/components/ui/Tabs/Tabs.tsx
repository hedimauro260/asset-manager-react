import React from 'react';

export interface Tab {
    id: string;
    label: string;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className = ''
}) => {
    return (
        <div className={`border-b border-border ${className}`}>
            <div className="flex gap-1">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${isActive
                                    ? 'text-text-primary'
                                    : 'text-text-muted hover:text-text-secondary'
                                }`}
                        >
                            {tab.label}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};