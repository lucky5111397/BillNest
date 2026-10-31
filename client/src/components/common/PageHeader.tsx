import React from 'react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'cyan' | 'success' | 'danger' | 'neutral';
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  badgeVariant = 'neutral',
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border-subtle',
        className,
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-mono text-text-secondary uppercase tracking-wider mb-0.5"
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <span>/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-text-primary' : ''}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-sans">
            {title}
          </h1>
          {badgeText && (
            <StatusBadge variant={badgeVariant} dot pulse>
              {badgeText}
            </StatusBadge>
          )}
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-text-secondary max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">{actions}</div>
      )}
    </div>
  );
};
