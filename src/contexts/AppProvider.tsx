// AppProvider.tsx
import React from 'react';
import { AppContext } from './AppContext';
import type { AppContextValue } from './AppContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const value: AppContextValue = {};

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}