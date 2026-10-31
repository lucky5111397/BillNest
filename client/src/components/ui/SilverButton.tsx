import React from 'react';
import { cn } from '@/lib/utils';

export interface SilverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const SilverButton = React.forwardRef<HTMLButtonElement, SilverButtonProps>(
  ({ className, variant = 'primary', size = 'sm', icon, children, ...props }, ref) => {
    const sizeClasses = {
      xs: 'h-7 px-2.5 text-[10px] gap-1 font-semibold uppercase tracking-wider',
      sm: 'h-8 px-3 text-xs gap-1.5 font-semibold uppercase tracking-wider',
      md: 'h-9 px-4 text-xs gap-2 font-semibold uppercase tracking-wider',
      lg: 'h-10 px-5 text-sm gap-2 font-semibold uppercase tracking-wider',
    };

    const variantClasses = {
      primary:
        'silver-button-primary rounded text-canvas-base border border-white/20 active:scale-[0.98]',
      secondary:
        'bg-surface-variant text-text-primary hover:bg-surface-bright border border-border-subtle rounded hover:border-border-specular active:scale-[0.98] transition-colors',
      ghost:
        'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-variant rounded transition-colors',
      outline:
        'bg-transparent text-text-primary border border-border-subtle hover:border-border-specular hover:bg-surface-variant rounded transition-colors',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-mono select-none disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  },
);

SilverButton.displayName = 'SilverButton';
