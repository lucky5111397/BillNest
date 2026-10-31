import React from 'react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  label?: string;
  title?: string;
  value: string;
  valueSubtext?: string;
  trend?:
    | string
    | {
        value: string;
        isPositive?: boolean;
        label?: string;
      };
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  sparkline?: React.ReactNode;
  footer?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  className?: string;
  previewNote?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  title,
  value,
  valueSubtext,
  trend,
  trendDirection,
  icon,
  sparkline,
  footer,
  footerLeft,
  footerRight,
  className,
  previewNote,
}) => {
  const displayLabel = label || title || '';

  const renderTrend = () => {
    if (!trend) return null;
    if (typeof trend === 'string') {
      const isPositive =
        trendDirection === 'up' ||
        trend.startsWith('+') ||
        trend.includes('uptime') ||
        trend.includes('Rate') ||
        trend.includes('OK');
      const isNegative =
        trendDirection === 'down' || (trend.includes('risk') && !trend.startsWith('+'));
      return (
        <span
          className={cn(
            'inline-flex items-center gap-0.5 font-mono text-xs font-semibold',
            isPositive
              ? 'text-status-success'
              : isNegative
                ? 'text-status-danger'
                : 'text-text-primary',
          )}
        >
          {trend}
        </span>
      );
    }

    return (
      <span
        className={cn(
          'inline-flex items-center gap-0.5 font-mono text-xs font-semibold',
          trend.isPositive ? 'text-status-success' : 'text-text-primary',
        )}
      >
        {trend.value}
      </span>
    );
  };

  const hasFooter = footer || footerLeft || footerRight;

  return (
    <div
      className={cn(
        'flex flex-col justify-between p-4 rounded-xl bg-surface-lowest border border-border-subtle shadow-panel relative overflow-hidden group hover:border-border-specular transition-all',
        className,
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest font-medium">
              {displayLabel}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-2xl font-bold text-text-primary tracking-tight tabular-nums">
                {value}
              </span>
              {valueSubtext && (
                <span className="font-mono text-xs text-text-secondary font-normal">
                  {valueSubtext}
                </span>
              )}
              {renderTrend()}
            </div>
          </div>
          {icon && (
            <div className="w-8 h-8 rounded bg-surface-variant border border-border-subtle flex items-center justify-center text-text-primary shrink-0 shadow-sm">
              {icon}
            </div>
          )}
        </div>

        {sparkline && <div className="w-full my-2">{sparkline}</div>}
      </div>

      {hasFooter && (
        <div className="mt-3 pt-2 bg-surface-variant/50 -mx-4 -mb-4 px-3 py-2 border-t border-border-subtle rounded-b-xl text-xs font-mono text-text-secondary flex items-center justify-between">
          {footer ? (
            footer
          ) : (
            <>
              <span>{footerLeft}</span>
              <span className="text-text-primary font-semibold">{footerRight}</span>
            </>
          )}
        </div>
      )}

      {previewNote && (
        <div className="sr-only" aria-hidden="true">
          {previewNote}
        </div>
      )}
    </div>
  );
};
