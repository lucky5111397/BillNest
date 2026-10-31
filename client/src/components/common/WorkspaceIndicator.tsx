import React from 'react';
import { ChevronsUpDown, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkspaceIndicatorProps {
  className?: string;
  name?: string;
  environment?: string;
}

export const WorkspaceIndicator: React.FC<WorkspaceIndicatorProps> = ({
  className,
  name = 'BillNest Global HQ',
  environment = 'PRECISION-PROD',
}) => {
  return (
    <div
      className={cn(
        'p-2 rounded-lg bg-surface-variant border border-border-subtle flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] select-none group cursor-pointer hover:border-border-specular transition-colors',
        className,
      )}
      role="button"
      tabIndex={0}
      aria-label="Active Workspace"
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-1">
        <div className="w-6 h-6 rounded bg-surface-bright border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
          <Building2 className="w-3.5 h-3.5 text-status-cyan" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest leading-none">
            WORKSPACE
          </span>
          <span className="font-sans text-xs font-semibold text-text-primary truncate mt-0.5">
            {name}
          </span>
          <span className="font-mono text-[9px] text-status-cyan tracking-wider leading-none">
            {environment}
          </span>
        </div>
      </div>
      <ChevronsUpDown className="w-3.5 h-3.5 text-text-secondary group-hover:text-text-primary shrink-0 transition-colors" />
    </div>
  );
};
