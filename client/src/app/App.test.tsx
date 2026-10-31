import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

describe('BillNest Phase 1 Application Suite', () => {
  beforeEach(() => {
    // Reset path before each test
    window.history.pushState({}, '', '/');
  });

  describe('1. Public Landing Page & 3D Showcase (Preserved Functionality)', () => {
    it('renders the dark mode landing page, brand identity, and hero section', () => {
      render(<App />);

      // BillNest Brand Identity
      expect(screen.getByText('BillNest')).toBeInTheDocument();
      expect(screen.getByText('Workspace')).toBeInTheDocument();

      // Primary Hero Headline and Supporting Text
      expect(screen.getByText(/Your Subscriptions\./i)).toBeInTheDocument();
      expect(screen.getByText(/One Powerful Workspace\./i)).toBeInTheDocument();
      expect(
        screen.getByText(/Manage plans, customers, recurring invoices and payments/i),
      ).toBeInTheDocument();

      // Functional CTA
      expect(screen.getByRole('link', { name: /Explore BillNest/i })).toBeInTheDocument();

      // 3D Carousel sample subscriptions
      expect(screen.getByText('Netflix')).toBeInTheDocument();
      expect(screen.getByText('Amazon Prime')).toBeInTheDocument();
      expect(screen.getByText('Spotify')).toBeInTheDocument();
      expect(screen.getByText('YouTube Premium')).toBeInTheDocument();
      expect(screen.getByText('Disney+ Hotstar')).toBeInTheDocument();

      // Interactive controls
      expect(screen.getByRole('button', { name: /Previous subscription/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Next subscription/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Pause 3D carousel auto-rotation/i }),
      ).toBeInTheDocument();
    });
  });

  describe('2. Operational Shell & Finance Lead Executive Dashboard (Screen 1)', () => {
    it('renders OperationalShell with telemetry topbar, sidebar, and Finance Overview Page', () => {
      window.history.pushState({}, '', '/dashboard');
      render(<App />);

      // Topbar Brand
      expect(screen.getByText('BILLNEST')).toBeInTheDocument();
      expect(screen.getByText('OUTBOX')).toBeInTheDocument();

      // Sidebar sections and links
      expect(screen.getByText('REVENUE CORE')).toBeInTheDocument();
      expect(screen.getByText('ADMINISTRATION')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Finance Overview/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Subscriptions & Quotes/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Billing & Invoices/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Payments & Bank Matcher/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Products & Plans/i })).toBeInTheDocument();

      // Screen 1 Header & Telemetry Metrics
      expect(screen.getByRole('heading', { name: /Finance Overview/i })).toBeInTheDocument();
      expect(screen.getByText('1,842')).toBeInTheDocument();
      expect(screen.getByText('$148,920.00')).toBeInTheDocument();
      expect(screen.getAllByText('$132,400.00').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('$16,520.00')).toBeInTheDocument();

      // Overdue Invoices Dunning Module
      expect(screen.getByText('Overdue Invoices')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /CHASE ALL/i })).toBeInTheDocument();
    });
  });

  describe('3. Subscriptions & Quotes Management (Screen 2)', () => {
    it('renders Subscriptions & Quotes Page on /dashboard/subscriptions-and-quotes', () => {
      window.history.pushState({}, '', '/dashboard/subscriptions-and-quotes');
      render(<App />);

      // Header and Telemetry
      expect(screen.getByRole('heading', { name: /Subscriptions & Quotes/i })).toBeInTheDocument();
      expect(screen.getByText('LIVE LEDGER')).toBeInTheDocument();
      expect(screen.getByText('TOTAL SUBSCRIPTIONS')).toBeInTheDocument();
      expect(screen.getByText('2,450')).toBeInTheDocument();
      expect(screen.getByText('AVG CONTRACT VALUE (ACV)')).toBeInTheDocument();
      expect(screen.getByText('$1,820')).toBeInTheDocument();

      // Master Contracts Ledger Table
      expect(screen.getByText('Acme Technologies Inc.')).toBeInTheDocument();
      expect(screen.getByText('SUB-2026-8841')).toBeInTheDocument();
      expect(screen.getByText('Stratos Dynamics')).toBeInTheDocument();
      expect(screen.getByText('Cloudnest Ltd')).toBeInTheDocument();
    });

    it('redirects legacy /dashboard/subscriptions route to /dashboard/subscriptions-and-quotes', () => {
      window.history.pushState({}, '', '/dashboard/subscriptions');
      render(<App />);

      expect(screen.getByRole('heading', { name: /Subscriptions & Quotes/i })).toBeInTheDocument();
      expect(window.location.pathname).toBe('/dashboard/subscriptions-and-quotes');
    });
  });

  describe('4. Billing & Invoices (Screen 3)', () => {
    it('renders Billing & Invoices Page on /dashboard/billing-and-invoices', () => {
      window.history.pushState({}, '', '/dashboard/billing-and-invoices');
      render(<App />);

      // Header and Badges
      expect(screen.getByRole('heading', { name: /Billing & Invoices/i })).toBeInTheDocument();
      expect(screen.getByText(/Live Ledger & Automated Dunning/i)).toBeInTheDocument();
      expect(screen.getByText('REV-LEDGER-V4')).toBeInTheDocument();

      // Telemetry Cards
      expect(screen.getByText('TOTAL INVOICED (MTD)')).toBeInTheDocument();
      expect(screen.getByText('$184,650.00')).toBeInTheDocument();
      expect(screen.getByText('PAID & SETTLED')).toBeInTheDocument();
      expect(screen.getByText('$152,430.00')).toBeInTheDocument();

      // Invoice Ledger Table
      expect(screen.getByText('INV-2026-1094')).toBeInTheDocument();
      expect(screen.getByText('INV-2026-1095')).toBeInTheDocument();
      expect(screen.getByText('INV-2026-1096')).toBeInTheDocument();
    });

    it('redirects legacy /dashboard/invoices route to /dashboard/billing-and-invoices', () => {
      window.history.pushState({}, '', '/dashboard/invoices');
      render(<App />);

      expect(screen.getByRole('heading', { name: /Billing & Invoices/i })).toBeInTheDocument();
      expect(window.location.pathname).toBe('/dashboard/billing-and-invoices');
    });
  });

  describe('5. Payments & Bank Matcher (Screen 4)', () => {
    it('renders Payments & Bank Matcher Page on /dashboard/payments-and-bank-matcher', () => {
      window.history.pushState({}, '', '/dashboard/payments-and-bank-matcher');
      render(<App />);

      // Header
      expect(screen.getByRole('heading', { name: /Payments & Bank Matcher/i })).toBeInTheDocument();
      expect(screen.getByText(/Live FedNow \/ SWIFT \/ Stripe Sync/i)).toBeInTheDocument();

      // Telemetry
      expect(screen.getByText('NET CASH SETTLED (MTD)')).toBeInTheDocument();
      expect(screen.getAllByText('$132,400.00').length).toBeGreaterThanOrEqual(1);

      // Unmatched Inbound Feed
      expect(screen.getByText('Wells Fargo Wire Inflow')).toBeInTheDocument();
      expect(screen.getByText('SVB Inbound ACH Credit')).toBeInTheDocument();
      expect(screen.getByText('Barclays SWIFT Cross-Border')).toBeInTheDocument();

      // Payment Rail Breakdown
      expect(screen.getByText(/Inflow by Payment Rail/i)).toBeInTheDocument();
      expect(screen.getByText('FedNow & Fedwire Direct')).toBeInTheDocument();
    });
  });

  describe('6. Admin Catalog, Plans & Discount Rules (Screen 5)', () => {
    it('renders Catalog, Plans & Discount Rules on /dashboard/products-and-plans', () => {
      window.history.pushState({}, '', '/dashboard/products-and-plans');
      render(<App />);

      // Header
      expect(
        screen.getByRole('heading', { name: /Catalog, Plans & Discount Rules/i }),
      ).toBeInTheDocument();
      expect(screen.getByText('REV-PROD #108-A')).toBeInTheDocument();

      // 3 Columns
      expect(screen.getByRole('heading', { name: /Product & Variants/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Configure Plan/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Discount & Tax Rules/i })).toBeInTheDocument();

      // Field Values
      expect(screen.getByDisplayValue('Brightloop ERP Suite')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Enterprise Yearly')).toBeInTheDocument();
      expect(screen.getByText('TIER-ENT-L3')).toBeInTheDocument();
      expect(screen.getByText('EXP-2026-Q4')).toBeInTheDocument();
    });
  });

  describe('7. Customer Self-Service Portal (Screen 6)', () => {
    it('renders PortalShell and Customer Portal Overview on /portal/overview', () => {
      window.history.pushState({}, '', '/portal/overview');
      render(<App />);

      // Portal Shell Header & Tenant
      expect(screen.getByText('CUSTOMER PORTAL')).toBeInTheDocument();
      expect(screen.getAllByText('Acme Logistics Ltd.').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('DEVELOPMENT PREVIEW:')).toBeInTheDocument();

      // Welcome Banner & Key Metrics
      expect(screen.getByText(/Welcome back, Acme Logistics/i)).toBeInTheDocument();
      expect(screen.getByText('1 Active Subscription')).toBeInTheDocument();

      // Subscription Management Master Card
      expect(screen.getByRole('heading', { name: /Monthly Pro Plan/i })).toBeInTheDocument();
      expect(screen.getByText('SUB-2026-0084')).toBeInTheDocument();

      // Manage Team Seats & Dynamic Calculations
      expect(screen.getByRole('heading', { name: /Manage Team Seats/i })).toBeInTheDocument();
      expect(screen.getByText(/10 seats × \$1,760\.00 = \$17,600\.00 \/ mo/i)).toBeInTheDocument();

      // Add-on switches
      expect(screen.getByText('AI Analytics Add-on')).toBeInTheDocument();
      expect(screen.getByText('Dedicated Priority Support')).toBeInTheDocument();

      // Quotation Card
      expect(screen.getByText('QUOTE #SUB-2026-0099')).toBeInTheDocument();
      expect(screen.getByText(/Accept & Confirm Quote/i)).toBeInTheDocument();
    });

    it('interactively increments seat count and updates live math calculation', () => {
      window.history.pushState({}, '', '/portal/overview');
      render(<App />);

      // Click Add Seat button
      const addSeatBtn = screen.getByTitle('Add Seat');
      fireEvent.click(addSeatBtn);

      // Verify seat count increased to 11
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText(/11 seats × \$1,760\.00 = \$19,360\.00 \/ mo/i)).toBeInTheDocument();
    });

    it('redirects /portal root to /portal/overview', () => {
      window.history.pushState({}, '', '/portal');
      render(<App />);

      expect(screen.getByText(/Welcome back, Acme Logistics/i)).toBeInTheDocument();
      expect(window.location.pathname).toBe('/portal/overview');
    });
  });

  describe('8. Error Handling & 404 Route', () => {
    it('renders matte 404 Not Found Page on unrecognized paths', () => {
      window.history.pushState({}, '', '/unrecognized-path-404');
      render(<App />);

      expect(screen.getByText('ERROR 404: ROUTE NOT FOUND')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Public Landing/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Revenue Dashboard/i })).toBeInTheDocument();
    });
  });
});
