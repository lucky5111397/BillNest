import { apiClient } from '@/lib/api-client';

export interface PortalOverviewData {
  customer: {
    id: string;
    businessName: string;
    contactName: string;
    email: string;
    phone?: string;
    customerNumber: string;
    billingAddress?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  subscriptions: Array<{
    _id: string;
    subscriptionNumber: string;
    planId: {
      name: string;
      pricing: number;
      billingInterval: string;
    };
    quantity: number;
    unitPrice: number;
    startDate: string;
    nextBillingAt: string;
    status: string;
    items: Array<{
      name: string;
      unitPrice: number;
      quantity: number;
      subtotal: number;
    }>;
  }>;
  quotations: Array<{
    _id: string;
    quoteNumber: string;
    total: number;
    expiryDate: string;
    status: string;
    notes?: string;
  }>;
  recentInvoices: Array<{
    _id: string;
    invoiceNumber: string;
    total: number;
    status: string;
    dueDate: string;
  }>;
  notice: string;
}

export const portalService = {
  async getOverview(): Promise<PortalOverviewData> {
    const res = await apiClient<{ success: boolean; data: PortalOverviewData }>('/portal/overview');
    return res.data;
  },

  async updateSeats(subscriptionId: string, seats: number): Promise<{ message: string }> {
    const res = await apiClient<{ success: boolean; message: string }>(
      `/portal/subscriptions/${subscriptionId}/seats`,
      {
        method: 'POST',
        body: JSON.stringify({ seats }),
      },
    );
    return res;
  },

  async toggleAddon(
    subscriptionId: string,
    addonSku: string,
    enabled: boolean,
  ): Promise<{ message: string }> {
    const res = await apiClient<{ success: boolean; message: string }>(
      `/portal/subscriptions/${subscriptionId}/toggle-addon`,
      {
        method: 'POST',
        body: JSON.stringify({ addonSku, enabled }),
      },
    );
    return res;
  },

  async acceptQuotation(quotationId: string): Promise<{ message: string }> {
    const res = await apiClient<{ success: boolean; message: string }>(
      `/portal/quotations/${quotationId}/accept`,
      {
        method: 'POST',
      },
    );
    return res;
  },
};

