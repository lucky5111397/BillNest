import React from 'react';
import { Server, Database } from 'lucide-react';
import { useApiLiveness, useApiReadiness } from '@/hooks/useHealth';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

export interface SystemStatusIndicatorProps {
  className?: string;
  compact?: boolean;
}

export const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({
  className,
  compact = false,
}) => {
  const { data: liveness, isError: isLiveError, isLoading: isLiveLoading } = useApiLiveness();
  const { data: readiness, isError: isReadyError, isLoading: isReadyLoading } = useApiReadiness();

  const isApiOnline = !isLiveError && !isLiveLoading && liveness?.status === 'ok';
  const isDbHealthy =
    !isReadyError && !isReadyLoading && readiness?.dependencies?.database?.status === 'healthy';

  const dbLatencyMs = readiness?.dependencies?.database?.latencyMs;

  return (
    <div className={cn('flex items-center gap-2 font-mono text-[11px]', className)}>
      {/* Backend API status */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-variant border border-border-subtle shadow-sm">
        <Server className="h-3 w-3 text-text-secondary" />
        <span className="text-text-secondary uppercase">API:</span>
        {isLiveLoading ? (
          <StatusBadge variant="neutral">CHECKING...</StatusBadge>
        ) : isApiOnline ? (
          <StatusBadge variant="success" dot>
            ONLINE
          </StatusBadge>
        ) : (
          <StatusBadge variant="danger" dot>
            OFFLINE
          </StatusBadge>
        )}
      </div>

      {/* Database status */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-variant border border-border-subtle shadow-sm">
        <Database className="h-3 w-3 text-text-secondary" />
        <span className="text-text-secondary uppercase">DB:</span>
        {isReadyLoading ? (
          <StatusBadge variant="neutral">CHECKING...</StatusBadge>
        ) : isDbHealthy ? (
          <StatusBadge variant="success" dot>
            {compact || dbLatencyMs === undefined ? 'CONNECTED' : `${dbLatencyMs}ms`}
          </StatusBadge>
        ) : (
          <StatusBadge variant="warning" dot>
            DISCONNECTED
          </StatusBadge>
        )}
      </div>
    </div>
  );
};
