// Shared cross-module types and interfaces
export interface ApiResponse<T = unknown> {
  status: 'ok' | 'error' | 'degraded';
  statusCode: number;
  message?: string;
  data?: T;
  timestamp: string;
}
