import { useState } from 'react';
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const demoAccounts = [
  { userId: 'admin', password: 'admin123', role: 'Manager', name: 'Rajan Thomas' },
  { userId: 'arun_k', password: 'arun123', role: 'Salesman', name: 'Arun Kumar' },
  { userId: 'priya_m', password: 'priya123', role: 'Sales Assistant', name: 'Priya Menon' },
];

export default function Login() {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(userId.trim(), password);
    if (!ok) setError('Invalid User ID or Password. Try the demo credentials below.');
    setLoading(false);
  };

  const fillAndLogin = async (u: typeof demoAccounts[0]) => {
    setUserId(u.userId);
    setPassword(u.password);
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    login(u.userId, u.password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-12">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Zap size={26} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl leading-tight">Hi Tech Engineering</div>
              <div className="text-orange-100 text-xs font-medium tracking-widest uppercase">Enterprise ERP</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Your Complete Business<br />Management Platform
          </h1>
          <p className="text-orange-100 text-base leading-relaxed">
            Inventory · GST Billing · Purchase · CRM · Reports · Barcode Scanning — all in one place for electricals, plumbing & hardware stores.
          </p>
        </div>
        {/* Feature badges */}
        <div className="space-y-3">
          {[
            '⚡ Multi-firm GST & Non-GST Billing',
            '📦 Advanced Inventory & Pricing Engine',
            '📊 Real-time Reports & Analytics',
            '📱 Mobile Barcode Workflow + Offline Mode',
          ].map(f => (
            <div key={f} className="flex items-center gap-3 text-white/90 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-slate-950">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold">Hi Tech Engineering</div>
            <div className="text-orange-400 text-xs">Enterprise ERP</div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-slate-400 text-sm mb-8">Enter your credentials to access ERP</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">User ID</label>
              <input
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="e.g. admin"
                autoComplete="username"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !userId || !password}
              className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-orange-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">Demo Accounts</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
            <div className="space-y-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.userId}
                  onClick={() => fillAndLogin(acc)}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-orange-500/40 rounded-xl transition-all group"
                >
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors">{acc.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{acc.userId} / {acc.password}</div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
