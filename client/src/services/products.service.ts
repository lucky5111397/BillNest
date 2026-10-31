import { apiClient } from '@/lib/api-client';

export interface ProductVariant {
  name: string;
  brand?: string;
  SKU: string;
  priceAdjustment: number;
  active: boolean;
}

export interface Product {
  _id: string;
  name: string;
  SKU: string;
  type: 'SOFTWARE' | 'SERVICE' | 'PHYSICAL' | 'CONSUMABLE';
  description?: string;
  salesPrice: number; // In minor units (cents)
  currency: string;
  variants: ProductVariant[];
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export interface Plan {
  _id: string;
  name: string;
  productId: Product | string;
  pricing: number; // In minor units
  currency: string;
  billingInterval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  intervalCount: number;
  minimumQuantity: number;
  autoClose: boolean;
  allowEarlyClose: boolean;
  allowPause: boolean;
  allowRenewal: boolean;
  active: boolean;
}

export const productsService = {
  async getProducts(params?: {
    status?: string;
    type?: string;
    search?: string;
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await apiClient<{ success: boolean; data: Product[] }>(`/products${query}`);
    return res.data;
  },

  async createProduct(data: {
    name: string;
    SKU: string;
    type: string;
    description?: string;
    salesPrice: number; // In dollars
    costPrice?: number;
    variants?: Array<{ name: string; brand?: string; SKU: string; priceAdjustment: number }>;
  }): Promise<Product> {
    const res = await apiClient<{ success: boolean; data: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async getPlans(): Promise<Plan[]> {
    const res = await apiClient<{ success: boolean; data: Plan[] }>('/plans');
    return res.data;
  },

  async createPlan(data: {
    name: string;
    productId: string;
    pricing: number; // In dollars
    billingInterval: string;
    intervalCount?: number;
    minimumQuantity?: number;
  }): Promise<Plan> {
    const res = await apiClient<{ success: boolean; data: Plan }>('/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
};
