import { apiClient } from '@/lib/api-client';

export interface BankTransactionRecord {
  _id: string;
  source: string;
  externalReference?: string;
  transactionDate: string;
  description: string;
  amount: number;
  direction: 'INBOUND' | 'OUTBOUND';
  matchingStatus: 'UNMATCHED' | 'MATCHED' | 'IGNORED';
  matchedInvoiceId?: {
    _id: string;
    invoiceNumber: string;
    total: number;
    outstandingBalance: number;
  };
  confidence?: number;
  notes?: string;
}

export const reconciliationService = {
  async getTransactions(params?: { status?: string }): Promise<BankTransactionRecord[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await apiClient<{ success: boolean; data: BankTransactionRecord[] }>(
      `/reconciliation/transactions${query}`,
    );
    return res.data;
  },

  async runAutoMatcher(): Promise<{ message: string; matchedCandidatesCount: number }> {
    const res = await apiClient<{
      success: boolean;
      message: string;
      matchedCandidatesCount: number;
    }>('/reconciliation/auto-match', { method: 'POST' });
    return res;
  },

  async confirmMatch(transactionId: string, invoiceId: string): Promise<{ message: string }> {
    const res = await apiClient<{ success: boolean; message: string }>(
      '/reconciliation/confirm-match',
      {
        method: 'POST',
        body: JSON.stringify({ transactionId, invoiceId }),
      },
    );
    return res;
  },

  async importCsv(csvContent: string): Promise<{ importedCount: number; duplicateCount: number }> {
    const res = await apiClient<{
      success: boolean;
      importedCount: number;
      duplicateCount: number;
    }>('/reconciliation/import-csv', {
      method: 'POST',
      body: JSON.stringify({ csvContent }),
    });
    return res;
  },
};

