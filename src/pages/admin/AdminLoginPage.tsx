import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/appStore';
import { login as authServiceLogin, getLoginLockRemainingSeconds } from '../../services/authService';
import { useQrTracking } from '../../hooks/useQrTracking';

export function AdminLoginPage() {
  useQrTracking();
  const navigate = useNavigate();
  const authenticated = useAppStore((state) => state.adminAuthenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authenticated) {
    return <Navigate replace to="/admin" />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Check for lockout
    const lockRemainingSeconds = getLoginLockRemainingSeconds();
    if (lockRemainingSeconds > 0) {
      setError(`تم إيقاف محاولات الدخول مؤقتًا. حاول بعد ${Math.ceil(lockRemainingSeconds / 60)} دقيقة.`);
      return;
    }

    // Prevent duplicate submissions
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await authServiceLogin(email, password);
      
      if (result.success) {
        // Update store
        useAppStore.setState({ adminAuthenticated: true });
        navigate('/admin');
        return;
      }

      // Show error from service
      setError(result.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    } catch (err) {
      console.error('Login error:', err);
      setError('حدث خطأ أثناء محاولة تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-950 px-4 py-8 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-slate-950/40">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-lg bg-teal-700 text-white">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-black">بوابة الإدارة</h1>
            <p className="text-sm font-bold text-slate-500">صيف وصحة - مساعد</p>
          </div>
        </div>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            البريد الإلكتروني
            <input
              autoComplete="username"
              className="min-h-12 rounded-lg border border-slate-200 px-4 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            كلمة المرور
            <div className="relative">
              <input
                autoComplete="current-password"
                className="w-full min-h-12 rounded-lg border border-slate-200 px-4 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                onChange={(event) => setPassword(event.target.value)}
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </label>
          {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}
          <Button className="w-full" icon={<LockKeyhole className="size-4" />} type="submit" disabled={loading}>
            {loading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}
          </Button>
        </form>
      </section>
    </main>
  );
}
