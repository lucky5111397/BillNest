import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'success' | 'danger' | 'warning' | 'neutral' | 'outline';
  status?: 'cyan' | 'success' | 'danger' | 'warning' | 'neutral' | 'outline';
  dot?: boolean;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  className,
  variant,
  status,
  dot = false,
  pulse = false,
  children,
  ...props
}) => {
  const resolvedVariant = status || variant || 'neutral';
  const variantStyles = {
    cyan: 'bg-surface-variant text-status-cyan border border-status-cyan/30 shadow-[0_0_8px_rgba(103,232,249,0.15)]',
    success:
      'bg-surface-variant text-status-success border border-status-success/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
    danger:
      'bg-surface-variant text-status-danger border border-status-danger/30 shadow-[0_0_8px_rgba(244,63,94,0.15)]',
    warning:
      'bg-surface-variant text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
    neutral: 'bg-surface-variant text-text-primary border border-border-subtle',
    outline: 'bg-transparent text-text-secondary border border-border-subtle',
  };

  const dotColors = {
    cyan: 'bg-status-cyan shadow-[0_0_6px_rgba(103,232,249,0.9)]',
    success: 'bg-status-success shadow-[0_0_6px_rgba(16,185,129,0.9)]',
    danger: 'bg-status-danger shadow-[0_0_6px_rgba(244,63,94,0.9)]',
    warning: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.9)]',
    neutral: 'bg-metallic-light shadow-[0_0_6px_rgba(248,250,252,0.8)]',
    outline: 'bg-text-secondary',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold select-none',
        variantStyles[resolvedVariant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColors[resolvedVariant],
            pulse && 'animate-pulse',
          )}
        />
      )}
      {children}
    </span>
  );
};
