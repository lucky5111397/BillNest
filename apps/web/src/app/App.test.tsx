import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component Smoke Test', () => {
  it('renders the application shell without crashing', () => {
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
