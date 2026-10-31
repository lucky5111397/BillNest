import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { SilverButton } from '@/components/ui/SilverButton';
import { authService } from '@/services/auth.service';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('A valid reset token is required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token.trim(), newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
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
            <span>CREDENTIAL ROTATION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Set New Password</h1>
          <p className="text-xs text-text-secondary">
            Enter your reset token and new secure password meeting enterprise security baseline.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-lg bg-status-success/10 border border-status-success/30 text-xs text-text-primary space-y-3 text-center">
            <CheckCircle className="h-8 w-8 text-status-success mx-auto" />
            <p className="font-semibold text-text-primary">Password Successfully Updated</p>
            <p className="text-text-secondary">Redirecting to login screen...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                Reset Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="64-character hexadecimal token"
                className="w-full px-3 py-2 bg-surface-variant border border-border-subtle rounded-lg text-xs font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-specular transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 digit, 1 special"
                  className="w-full pl-9 pr-3 py-2 bg-surface-variant border border-border-subtle rounded-lg text-xs font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-specular transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-9 pr-3 py-2 bg-surface-variant border border-border-subtle rounded-lg text-xs font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-border-specular transition-colors"
                />
              </div>
            </div>

            <SilverButton
              variant="primary"
              size="md"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Updating Credentials...' : 'Save New Password'}</span>
              <ArrowRight className="h-4 w-4" />
            </SilverButton>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/auth/login"
            className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
