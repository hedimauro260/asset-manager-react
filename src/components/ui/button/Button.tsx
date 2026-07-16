// src/components/ui/button/Button.tsx
import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { Spinner } from '../spinner/Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  loading?: boolean;
  children?: React.ReactNode; // 👈 OPACIONAL
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-danger text-white hover:bg-danger-hover'
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const hasChildren = children !== undefined && children !== null && children !== '';
  const hasIcon = !!Icon && !loading;
  const isIconOnly = !hasChildren && hasIcon;

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 
        font-medium rounded-md transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary/50 
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${isIconOnly ? 'aspect-square' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'sm' ? 16 : 20} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : 20} />
      ) : null}
      {hasChildren && children}
    </button>
  );
};