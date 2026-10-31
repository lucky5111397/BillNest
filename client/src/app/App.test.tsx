import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

describe('BillNest Application Suite', () => {
  beforeEach(() => {
    // Reset path before each test
    window.history.pushState({}, '', '/');
  });

  describe('Landing Page & 3D Showcase', () => {
    it('renders the dark mode landing page and hero section without crashing', () => {
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

      // 3D Carousel sample subscriptions presence
      expect(screen.getByText('Netflix')).toBeInTheDocument();
      expect(screen.getByText('Amazon Prime')).toBeInTheDocument();
      expect(screen.getByText('Spotify')).toBeInTheDocument();
      expect(screen.getByText('YouTube Premium')).toBeInTheDocument();
      expect(screen.getByText('Disney+ Hotstar')).toBeInTheDocument();
      expect(screen.getByText('Microsoft 365')).toBeInTheDocument();
      expect(screen.getByText('Adobe Creative Cloud')).toBeInTheDocument();
      expect(screen.getByText('Google One')).toBeInTheDocument();

      // Interactive controls
      expect(screen.getByRole('button', { name: /Previous subscription/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Next subscription/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Pause 3D carousel auto-rotation/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Dashboard Platform Shell (Preserved Existing Functionality)', () => {
    it('renders the application shell without crashing when navigating to /dashboard', () => {
      window.history.pushState({}, '', '/dashboard');
      render(<App />);

      // Brand and header text
      expect(screen.getByText('Brightloop')).toBeInTheDocument();
      expect(screen.getByText('Subscription OS')).toBeInTheDocument();

      // Dashboard navigation link
      expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();

      // Foundational roadmap text
      expect(screen.getByText('Brightloop Subscription Management System')).toBeInTheDocument();
      expect(screen.getAllByText('Phase 0 Foundation').length).toBeGreaterThan(0);
    });
  });
});
