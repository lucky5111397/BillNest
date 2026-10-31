import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, User, ArrowRight, AlertCircle } from 'lucide-react';
import { SilverButton } from '@/components/ui/SilverButton';
import { useAuth } from './AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Real-time password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Password does not satisfy all enterprise security requirements.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await register({
        name,
        businessName: businessName || name,
        email,
        password,
      });
      navigate('/portal/overview');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base text-text-primary flex flex-col justify-center items-center px-4 py-12 font-sans selection:bg-surface-high">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl bg-surface-lowest border border-border-subtle shadow-2xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant border border-border-subtle font-mono text-xs text-status-success">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success shadow-successGlow" />
            <span>CUSTOMER SELF-SERVICE PORTAL</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Create Your Account
          </h1>
          <p className="text-xs text-text-secondary">
            Manage your subscriptions, view quotations, download invoices, and provision team seats.
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
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full pl-9 pr-3 py-2 bg-surface-variant border border-border-subtle rounded-lg text-xs font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-specular transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
              Business / Company Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Logistics Ltd."
                className="w-full pl-9 pr-3 py-2 bg-surface-variant border border-border-subtle rounded-lg text-xs font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-specular transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ops@acmelogistics.com"
                className="w-full pl-9 pr-3 py-2 bg-surface-variant border border-border-subtle rounded-lg text-xs font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-specular transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
              Password
            </label>
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

            {/* Password Policy Real-Time Checklist */}
            <div className="p-2.5 rounded bg-surface-variant/40 border border-border-subtle space-y-1 font-mono text-[10px]">
              <div
                className={`flex items-center gap-1.5 ${hasMinLength ? 'text-status-success' : 'text-text-secondary'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>At least 8 characters</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-status-success' : 'text-text-secondary'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>Uppercase &amp; lowercase letters</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${hasNumber && hasSpecial ? 'text-status-success' : 'text-text-secondary'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>At least one number &amp; special character</span>
              </div>
            </div>
          </div>

          <SilverButton
            variant="primary"
            size="md"
            className="w-full justify-center mt-2"
            disabled={loading || !isPasswordValid}
          >
            <span>{loading ? 'Creating Account...' : 'Register Customer Account'}</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </SilverButton>
        </form>

        <div className="space-y-3 pt-4 border-t border-border-subtle text-center text-xs">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <div>
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

export default RegisterPage;
