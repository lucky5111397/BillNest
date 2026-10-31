import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './providers';

// Operational Shell & Pages
import { OperationalShell } from '@/components/layout/operational/OperationalShell';
import { FinanceOverviewPage } from '@/features/dashboard/FinanceOverviewPage';
import { SubscriptionsQuotesPage } from '@/features/subscriptions/SubscriptionsQuotesPage';
import { BillingInvoicesPage } from '@/features/invoices/BillingInvoicesPage';
import { PaymentsBankMatcherPage } from '@/features/payments/PaymentsBankMatcherPage';
import { ProductsPlansPage } from '@/features/products/ProductsPlansPage';
import { TaxesDiscountsPage } from '@/features/taxes/TaxesDiscountsPage';
import { StaffRolesPage } from '@/features/team/StaffRolesPage';
import { ReportsPage } from '@/features/reports/ReportsPage';

// Customer Portal Shell & Pages
import { PortalShell } from '@/components/layout/portal/PortalShell';
import { CustomerPortalOverviewPage } from '@/features/customer-portal/CustomerPortalOverviewPage';
import { PortalSubscriptionsPage } from '@/features/customer-portal/PortalSubscriptionsPage';
import { PortalQuotationsPage } from '@/features/customer-portal/PortalQuotationsPage';
import { PortalInvoicesPage } from '@/features/customer-portal/PortalInvoicesPage';
import { PortalSupportPage } from '@/features/customer-portal/PortalSupportPage';

// Authentication Pages & Provider
import {
  AuthProvider,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from '@/features/auth';

// Public Landing & Marketing Pages
import { LandingPage } from '@/features/landing/LandingPage';
import { PricingPage } from '@/features/pricing/PricingPage';
import { FaqPage } from '@/features/faq/FaqPage';

// Custom redesigned auth pages
import LoginPage from '@/features/auth/LoginPage';
import SignupPage from '@/features/auth/SignupPage';

// UI enhancements
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import { NotFoundPage } from '@/components/layout/NotFoundPage';

export function App() {
  return (
    <Providers>
      <SmoothCursor />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Marketing Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FaqPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/login" element={<Navigate to="/login" replace />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/register" element={<Navigate to="/signup" replace />} />

            {/* Operational Application Routes (Admin & Revenue Core Shell) */}
            <Route path="/dashboard" element={<OperationalShell />}>
              <Route index element={<FinanceOverviewPage />} />
              <Route path="subscriptions-and-quotes" element={<SubscriptionsQuotesPage />} />
              <Route path="billing-and-invoices" element={<BillingInvoicesPage />} />
              <Route path="payments-and-bank-matcher" element={<PaymentsBankMatcherPage />} />
              <Route path="products-and-plans" element={<ProductsPlansPage />} />
              <Route path="taxes-and-discounts" element={<TaxesDiscountsPage />} />
              <Route path="staff-and-roles" element={<StaffRolesPage />} />
              <Route path="reports" element={<ReportsPage />} />

              {/* Backwards Compatibility Route Aliases */}
              <Route path="subscriptions" element={<Navigate to="/dashboard/subscriptions-and-quotes" replace />} />
              <Route path="quotations" element={<Navigate to="/dashboard/subscriptions-and-quotes" replace />} />
              <Route path="invoices" element={<Navigate to="/dashboard/billing-and-invoices" replace />} />
              <Route path="payments" element={<Navigate to="/dashboard/payments-and-bank-matcher" replace />} />
              <Route path="products" element={<Navigate to="/dashboard/products-and-plans" replace />} />
              <Route path="plans" element={<Navigate to="/dashboard/products-and-plans" replace />} />
              <Route path="taxes" element={<Navigate to="/dashboard/taxes-and-discounts" replace />} />
              <Route path="discounts" element={<Navigate to="/dashboard/taxes-and-discounts" replace />} />
              <Route path="staff" element={<Navigate to="/dashboard/staff-and-roles" replace />} />
              <Route path="team" element={<Navigate to="/dashboard/staff-and-roles" replace />} />
              <Route path="customers" element={<Navigate to="/dashboard/subscriptions-and-quotes" replace />} />
              <Route path="settings" element={<Navigate to="/dashboard/products-and-plans" replace />} />
            </Route>

            {/* Customer Self-Service Portal Routes */}
            <Route path="/portal" element={<PortalShell />}>
              <Route index element={<Navigate to="/portal/overview" replace />} />
              <Route path="overview" element={<CustomerPortalOverviewPage />} />
              <Route path="subscriptions" element={<PortalSubscriptionsPage />} />
              <Route path="quotations" element={<PortalQuotationsPage />} />
              <Route path="invoices" element={<PortalInvoicesPage />} />
              <Route path="support" element={<PortalSupportPage />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Providers>
  );
}

export default App;
