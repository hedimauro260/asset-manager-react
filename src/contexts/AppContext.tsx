// AppContext.ts
import { createContext } from 'react';

export type AppContextValue = Record<string, unknown>;

export const AppContext = createContext<AppContextValue | undefined>(undefined);