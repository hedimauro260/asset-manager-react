import React from 'react';
import { type LucideIcon } from 'lucide-react';

export type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  icon: Icon,
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    info: 'badge-info'
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${className}`} {...props}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
};
