import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Github, Chrome, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (auth && auth.login) {
        await auth.login(email, password);
      }
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials or connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@billnest.internal');
    setPassword('BillNest@AdminMaster2026!');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#080A10] flex overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0F17] via-[#080A10] to-black" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-[100px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3 group w-fit">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <img src="/logo.jpg" alt="Billit" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">Billit</span>
        </Link>

        {/* Center quote */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Trusted by 1,200+ teams
            </div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Revenue operations,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                fully automated.
              </span>
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              Manage subscriptions, automate invoicing, and reconcile every payment — all in one
              high-performance workspace.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '$2.4M+', label: 'MRR tracked' },
              { value: '99.4%', label: 'Collection rate' },
              { value: '<2s', label: 'Query latency' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
              >
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-[11px] text-zinc-500 mt-0.5 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
          <p className="text-zinc-300 text-sm leading-relaxed italic">
            "Billit cut our billing ops time by 70%. The quote-to-subscription flow is
            genuinely instant."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <div className="text-white text-xs font-semibold">Sarah Kim</div>
              <div className="text-zinc-500 text-[11px]">Head of Finance, Nexus AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-[#080A10]" />

        {/* Mobile logo */}
        <Link to="/" className="lg:hidden relative flex items-center gap-2.5 mb-10 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10">
            <img src="/logo.jpg" alt="Billit" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-black text-white">Billit</span>
        </Link>

        <div className="relative w-full max-w-sm space-y-7">
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-white tracking-tight">Welcome back</h1>
            <p className="text-sm text-zinc-500">
              No account?{' '}
              <Link
                to="/signup"
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Social logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-sm font-medium hover:bg-white/[0.07] hover:border-white/[0.14] transition-all"
            >
              <Chrome className="w-4 h-4" />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-sm font-medium hover:bg-white/[0.07] hover:border-white/[0.14] transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[11px] text-zinc-600 font-mono uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F05323] hover:bg-[#E0481A] text-white font-bold text-sm shadow-[0_0_30px_rgba(240,83,35,0.35)] hover:shadow-[0_0_40px_rgba(240,83,35,0.45)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <>
                  Sign in to Billit
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Admin Quick-Fill */}
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span>Fill Demo Admin Credentials</span>
          </button>

          <p className="text-center text-[11px] text-zinc-600 leading-relaxed">
            By signing in you agree to our{' '}
            <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">Terms</span>
            {' '}and{' '}
            <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
