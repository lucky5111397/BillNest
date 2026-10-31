import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptimeSeconds?: number;
  dependencies?: {
    database?: {
      status: 'healthy' | 'down';
      latencyMs?: number;
      error?: string;
    };
  };
}

export function useApiLiveness() {
  return useQuery<HealthStatus>({
    queryKey: ['health', 'live'],
    queryFn: () => apiClient<HealthStatus>('/health/live'),
    retry: 1,
    refetchInterval: 30000,
  });
}

export function useApiReadiness() {
  return useQuery<HealthStatus>({
    queryKey: ['health', 'ready'],
    queryFn: () => apiClient<HealthStatus>('/health/ready'),
    retry: 1,
    refetchInterval: 30000,
  });
}
