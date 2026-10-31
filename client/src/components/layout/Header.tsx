import { Activity, Server } from 'lucide-react';
import { useApiLiveness, useApiReadiness } from '@/hooks/useHealth';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { data: liveness, isError: isLiveError } = useApiLiveness();
  const { data: readiness, isError: isReadyError } = useApiReadiness();

  const isApiOnline = !isLiveError && liveness?.status === 'ok';
  const isDbReady = !isReadyError && readiness?.dependencies?.database?.status === 'healthy';

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-foreground">Subscription Management System</h1>
        <span className="text-xs text-muted-foreground hidden md:inline">|</span>
        <span className="text-xs text-muted-foreground hidden md:inline">
          Modular Monolith Architecture
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {/* Backend API Status */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-muted/60 text-xs">
          <Server className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">API:</span>
          {isApiOnline ? (
            <Badge variant="success" className="h-5 px-1.5 text-[10px]">
              Online
            </Badge>
          ) : (
            <Badge variant="warning" className="h-5 px-1.5 text-[10px]">
              Connecting...
            </Badge>
          )}
        </div>

        {/* Database Status */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-muted/60 text-xs">
          <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Database:</span>
          {isDbReady ? (
            <Badge variant="success" className="h-5 px-1.5 text-[10px]">
              Healthy
            </Badge>
          ) : (
            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
              Pending Check
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
