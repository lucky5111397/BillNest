import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { SilverButton } from '@/components/ui/SilverButton';
import { useAuth } from './AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials or connection error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@billnest.internal');
    setPassword('BillNest@AdminMaster2026!');
  };

  return (
    <div className="min-h-screen bg-canvas-base text-text-primary flex flex-col justify-center items-center px-4 py-12 font-sans selection:bg-surface-high">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl bg-surface-lowest border border-border-subtle shadow-2xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant border border-border-subtle font-mono text-xs text-status-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-status-cyan shadow-cyanGlow animate-pulse" />
            <span>ENTERPRISE REVENUE CONSOLE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Sign in to BillNest
          </h1>
          <p className="text-xs text-text-secondary">
            Access unified subscription ledgers, bank reconciliation, and revenue analytics.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2 bg-surface-variant border border-border-subtle rounded-lg text-xs font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-specular transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-surface-variant border border-border-subtle rounded-lg text-xs font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-specular transition-colors"
              />
            </div>
          </div>

          <SilverButton
            variant="primary"
            size="md"
            className="w-full justify-center mt-2"
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </SilverButton>
        </form>

        {/* Demo Fast Fill & Registration Link */}
        <div className="space-y-4 pt-4 border-t border-border-subtle text-center text-xs">
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="w-full py-2 px-3 rounded bg-surface-variant/70 hover:bg-surface-bright border border-border-subtle text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-3 w-3 text-status-cyan" />
            <span>Fill Demo Admin Credentials</span>
          </button>

          <p className="text-text-secondary text-xs">
            New customer?{' '}
            <Link to="/auth/register" className="text-text-primary font-semibold hover:underline">
              Create customer account
            </Link>
          </p>

          <div className="pt-2">
            <Link
              to="/"
              className="text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Back to Public Showcase
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
