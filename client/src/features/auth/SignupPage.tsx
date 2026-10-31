import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Github, Chrome, Check } from 'lucide-react';

const PERKS = [
  'Automated recurring invoicing',
  'Quote-to-subscription in 1 click',
  'Wire & check payment reconciliation',
  'Sub-2s MRR & ARR analytics',
  'RBAC roles & audit logs',
];

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (p.length === 0) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'][passwordStrength];

  return (
    <div className="min-h-screen w-full bg-[#080A10] flex overflow-hidden">
      {/* Left: Auth form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-[#080A10]" />

        {/* Mobile logo */}
        <Link to="/" className="lg:hidden relative flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10">
            <img src="/logo.jpg" alt="Billit" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-black text-white">Billit</span>
        </Link>

        <div className="relative w-full max-w-sm space-y-7">
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-white tracking-tight">Create your account</h1>
            <p className="text-sm text-zinc-500">
              Already have one?{' '}
              <Link
                to="/login"
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Social sign-ups */}
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
              <label htmlFor="name" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Johnson"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 text-sm outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
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

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength ? strengthColor : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">{strengthLabel}</span>
                </div>
              )}
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
                  Creating account…
                </span>
              ) : (
                <>
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-zinc-600 leading-relaxed">
            By signing up you agree to our{' '}
            <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">Terms</span>
            {' '}and{' '}
            <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* Right decorative panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#0D0F17] via-[#080A10] to-black" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-[100px] pointer-events-none" />
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

        {/* Center content */}
        <div className="relative space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Free 14-day trial
            </div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Everything you need
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                from day one.
              </span>
            </h2>
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              No credit card required. Full platform access for 14 days. Cancel anytime.
            </p>
          </div>

          {/* Perks list */}
          <ul className="space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-orange-400" />
                </div>
                <span className="text-zinc-300 text-sm">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom badge */}
        <div className="relative grid grid-cols-2 gap-3">
          {[
            { value: '14-day', label: 'Free trial' },
            { value: 'No CC', label: 'Required' },
            { value: '5 min', label: 'Setup time' },
            { value: '24/7', label: 'Support' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
            >
              <div className="text-lg font-black text-white">{item.value}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

