import { apiClient } from '@/lib/api-client';

export interface InvoiceRecord {
  _id: string;
  invoiceNumber: string;
  customerId: {
    _id: string;
    businessName: string;
    contactName: string;
    email: string;
    customerNumber: string;
  };
  issueDate: string;
  dueDate: string;
  itemSnapshots: Array<{
    name: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    tax: number;
    total: number;
  }>;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  paidAmount: number;
  outstandingBalance: number;
  status: 'DRAFT' | 'CONFIRMED' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'VOID';
  paidAt?: string;
  payments?: Array<{
    _id: string;
    paymentNumber: string;
    amount: number;
    method: string;
    paidAt: string;
  }>;
}

export const invoicesService = {
  async getInvoices(params?: { status?: string; search?: string }): Promise<InvoiceRecord[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await apiClient<{ success: boolean; data: InvoiceRecord[] }>(`/invoices${query}`);
    return res.data;
  },

  async getInvoiceById(id: string): Promise<InvoiceRecord> {
    const res = await apiClient<{ success: boolean; data: InvoiceRecord }>(`/invoices/${id}`);
    return res.data;
  },

  async chaseAll(): Promise<{ message: string; dispatchedCount: number }> {
    const res = await apiClient<{ success: boolean; message: string; dispatchedCount: number }>(
      '/invoices/chase-all',
      { method: 'POST' },
    );
    return res;
  },

  async runRecurringBilling(): Promise<{
    message: string;
    data: { invoicesCreated: number; skippedCount: number; processedCount: number };
  }> {
    const res = await apiClient<{
      success: boolean;
      message: string;
      data: { invoicesCreated: number; skippedCount: number; processedCount: number };
    }>('/billing/run', { method: 'POST' });
    return res;
  },
};

