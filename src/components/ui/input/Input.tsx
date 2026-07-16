import React, { forwardRef } from 'react';
import { type LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              <Icon size={18} />
            </div>
          )}

          <input
            ref={ref}
            className={`input ${Icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
            {...props}
          />
        </div>

        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-danger' : 'text-text-muted'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';