import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { ErrorBox } from '../components/UI';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, loading, error, token } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => { if (token) nav('/', { replace: true }); }, [token, nav]);
  if (token) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(email, pass);
    if (ok) nav('/', { replace: true });
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center text-2xl shadow-lg shadow-brand-500/20">
            🥛
          </div>
          <h1 className="mt-4 text-[30px] leading-none font-bold text-slate-900">Welcome back</h1>
          <p className="text-[15px] text-slate-500 font-normal mt-1">Sign in to your Dairy Admin console</p>
        </div>

        <form onSubmit={submit} className="glass rounded-2xl border border-white/60 shadow-xl p-7 space-y-5">
          <ErrorBox message={error} />

          <div>
            <label className="label">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input h-11 pl-11"
                type="email"
                required
                placeholder="admin@dairy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-10 pr-10"
                type={show ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-[14px]">
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Signing in…
              </>
            ) : 'Sign in'}
          </button>

          <div className="text-center text-[13px] font-medium text-slate-400">
            Protected admin area · Operations only
          </div>
        </form>

        <div className="text-center text-[13px] font-medium text-slate-400 mt-5">
          © {new Date().getFullYear()} Dairy Delivery · All rights reserved
        </div>
      </div>
    </div>
  );
}
