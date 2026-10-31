import { apiClient } from '@/lib/api-client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  customerId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
  customer?: {
    id: string;
    businessName: string;
    customerNumber: string;
  };
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    businessName?: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const res = await apiClient<{ success: boolean; data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.data?.accessToken) {
      localStorage.setItem('billnest_access_token', res.data.accessToken);
    }
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient<{ success: boolean; data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.data?.accessToken) {
      localStorage.setItem('billnest_access_token', res.data.accessToken);
    }
    return res.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('billnest_access_token');
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
  },

  async getMe(): Promise<AuthUser | null> {
    const token = localStorage.getItem('billnest_access_token');
    if (!token) return null;

    try {
      const res = await apiClient<{ success: boolean; data: { user: AuthUser } }>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.user;
    } catch {
      localStorage.removeItem('billnest_access_token');
      return null;
    }
  },

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    return apiClient<{ success: boolean; message: string; resetToken?: string }>(
      '/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
    );
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiClient<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  async createStaff(data: { name: string; email: string; password: string }): Promise<AuthUser> {
    const token = localStorage.getItem('billnest_access_token');
    const res = await apiClient<{ success: boolean; data: AuthUser }>('/auth/staff', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async listStaff(): Promise<AuthUser[]> {
    const token = localStorage.getItem('billnest_access_token');
    const res = await apiClient<{ success: boolean; data: AuthUser[] }>('/auth/staff', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  },
};

