import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { SilverButton } from '@/components/ui/SilverButton';
import { authService } from '@/services/auth.service';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base text-text-primary flex flex-col justify-center items-center px-4 py-12 font-sans selection:bg-surface-high">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl bg-surface-lowest border border-border-subtle shadow-2xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant border border-border-subtle font-mono text-xs text-status-cyan">
            <span>PASSWORD RECOVERY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Reset Your Password
          </h1>
          <p className="text-xs text-text-secondary">
            Enter your verified email address to receive password recovery instructions.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-4 rounded-lg bg-status-success/10 border border-status-success/30 text-xs text-text-primary space-y-3">
            <div className="flex items-center gap-2 text-status-success font-semibold">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
            {resetToken && (
              <div className="pt-2 border-t border-border-subtle/50 space-y-2">
                <p className="font-mono text-[10px] text-text-secondary">
                  DEVELOPMENT DIRECT LINK (Token issued):
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/auth/reset-password?token=${resetToken}`)}
                  className="w-full py-1.5 px-3 rounded bg-surface-variant hover:bg-surface-bright border border-border-subtle font-mono text-[11px] text-status-cyan font-bold"
                >
                  Proceed to Reset Screen →
                </button>
              </div>
            )}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                Account Email
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

            <SilverButton
              variant="primary"
              size="md"
              className="w-full justify-center mt-2"
              disabled={loading}
            >
              <span>{loading ? 'Dispatching...' : 'Send Recovery Token'}</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </SilverButton>
          </form>
        )}

        <div className="pt-4 border-t border-border-subtle text-center text-xs space-y-2">
          <Link
            to="/auth/login"
            className="text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors block"
          >
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
