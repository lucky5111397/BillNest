import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './providers';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { LandingPage } from '@/features/landing/LandingPage';

export function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          {/* Public Dark Mode Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Platform Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="customers" element={<PlaceholderPage />} />
            <Route path="products" element={<PlaceholderPage />} />
            <Route path="plans" element={<PlaceholderPage />} />
            <Route path="quotations" element={<PlaceholderPage />} />
            <Route path="subscriptions" element={<PlaceholderPage />} />
            <Route path="invoices" element={<PlaceholderPage />} />
            <Route path="payments" element={<PlaceholderPage />} />
            <Route path="discounts" element={<PlaceholderPage />} />
            <Route path="reports" element={<PlaceholderPage />} />
            <Route path="settings" element={<PlaceholderPage />} />
          </Route>

          {/* Top-level Dashboard feature routes (preserved backwards compatibility) */}
          <Route element={<DashboardLayout />}>
            <Route path="/customers" element={<PlaceholderPage />} />
            <Route path="/products" element={<PlaceholderPage />} />
            <Route path="/plans" element={<PlaceholderPage />} />
            <Route path="/quotations" element={<PlaceholderPage />} />
            <Route path="/subscriptions" element={<PlaceholderPage />} />
            <Route path="/invoices" element={<PlaceholderPage />} />
            <Route path="/payments" element={<PlaceholderPage />} />
            <Route path="/discounts" element={<PlaceholderPage />} />
            <Route path="/reports" element={<PlaceholderPage />} />
            <Route path="/settings" element={<PlaceholderPage />} />
          </Route>

          {/* Catch-all redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
