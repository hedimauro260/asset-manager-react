import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command } from 'lucide-react';
import { Input } from '../../ui/input';

export interface SearchInputProps {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    placeholder?: string;
    shortcut?: string;
    className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value: controlledValue,
    onChange,
    onSearch,
    placeholder = 'Search anything...',
    shortcut = '⌘K',
    className = ''
}) => {
    const [internalValue, setInternalValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const shortcutKey = shortcut.includes('K') ? 'k' : shortcut.toLowerCase();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isModifierPressed = e.metaKey || e.ctrlKey;
            const key = e.key.toLowerCase();

            if (isModifierPressed && key === shortcutKey) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [shortcutKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(newValue);
    };

    const handleClear = () => {
        setInternalValue('');
        onChange?.('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch?.(value);
        }
    };

    const renderShortcut = () => {
        if (shortcut === '⌘K') {
            return (
                <>
                    <Command size={12} />
                    <span>K</span>
                </>
            );
        }
        if (shortcut === 'Ctrl+K') {
            return <span>Ctrl+K</span>;
        }
        return <span>{shortcut}</span>;
    };

    return (
        <div className={`relative ${className}`}>
            <div className={`relative transition-all duration-fast ${isFocused ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                } rounded-lg`}>
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <Input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full h-10 pl-10 pr-20 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none transition-all duration-fast"
                />

                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-12 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-surface-elevated transition-colors"
                    >
                        <X size={14} className="text-text-muted" />
                    </button>
                )}

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-surface-elevated border border-border rounded text-xs text-text-muted">
                    {renderShortcut()}
                </div>
            </div>
        </div>
    );
};