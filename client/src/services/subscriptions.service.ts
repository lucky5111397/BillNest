import { apiClient } from '@/lib/api-client';

export interface SubscriptionRecord {
  _id: string;
  subscriptionNumber: string;
  customerId: {
    _id: string;
    businessName: string;
    contactName: string;
    email: string;
    customerNumber: string;
  };
  planId: {
    _id: string;
    name: string;
    billingInterval: string;
    pricing: number;
  };
  quantity: number;
  unitPrice: number;
  startDate: string;
  nextBillingAt: string;
  billingInterval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  status: 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
  createdAt: string;
}

export interface QuotationRecord {
  _id: string;
  quoteNumber: string;
  customerId: {
    _id: string;
    businessName: string;
    contactName: string;
    email: string;
    customerNumber: string;
  };
  items: Array<{
    description: string;
    unitPrice: number;
    quantity: number;
    total: number;
  }>;
  total: number;
  currency: string;
  issueDate: string;
  expiryDate: string;
  status: 'DRAFT' | 'QUOTATION' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
}

export const subscriptionsService = {
  async getSubscriptions(params?: {
    status?: string;
    search?: string;
  }): Promise<SubscriptionRecord[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await apiClient<{ success: boolean; data: SubscriptionRecord[] }>(
      `/subscriptions${query}`,
    );
    return res.data;
  },

  async pauseSubscription(id: string): Promise<SubscriptionRecord> {
    const res = await apiClient<{ success: boolean; data: SubscriptionRecord }>(
      `/subscriptions/${id}/pause`,
      { method: 'POST' },
    );
    return res.data;
  },

  async resumeSubscription(id: string): Promise<SubscriptionRecord> {
    const res = await apiClient<{ success: boolean; data: SubscriptionRecord }>(
      `/subscriptions/${id}/resume`,
      { method: 'POST' },
    );
    return res.data;
  },

  async closeSubscription(id: string, reason?: string): Promise<SubscriptionRecord> {
    const res = await apiClient<{ success: boolean; data: SubscriptionRecord }>(
      `/subscriptions/${id}/close`,
      {
        method: 'POST',
        body: JSON.stringify({ reason }),
      },
    );
    return res.data;
  },

  async getQuotations(): Promise<QuotationRecord[]> {
    const res = await apiClient<{ success: boolean; data: QuotationRecord[] }>('/quotations');
    return res.data;
  },

  async convertQuotation(id: string): Promise<SubscriptionRecord> {
    const res = await apiClient<{ success: boolean; data: SubscriptionRecord }>(
      `/quotations/${id}/convert-to-subscription`,
      { method: 'POST' },
    );
    return res.data;
  },
};
