import { apiClient } from '@/lib/api-client';

export interface FinanceDashboardData {
  activeSubscriptionsCount: number;
  mrrMinor: number;
  mrrFormatted: string;
  arrMinor: number;
  arrFormatted: string;
  cashSettledMinor: number;
  cashSettledFormatted: string;
  totalInvoicedMinor: number;
  totalInvoicedFormatted: string;
  overdueBalanceMinor: number;
  overdueBalanceFormatted: string;
  overdueCount: number;
  overdueInvoices: Array<{
    id: string;
    days: string;
    account: string;
    amount: string;
    amountMinor: number;
  }>;
  rails: Array<{
    name: string;
    method: string;
    amount: number;
  }>;
  monthlyHistory: Array<{
    month: string;
    invoiced: number;
    collected: number;
  }>;
  recentActivity: Array<{
    id: string;
    title: string;
    time: string;
    description: string;
    type: string;
  }>;
}

export const reportsService = {
  async getDashboardMetrics(): Promise<FinanceDashboardData> {
    const res = await apiClient<{ success: boolean; data: FinanceDashboardData }>(
      '/reports/dashboard',
    );
    return res.data;
  },
};

