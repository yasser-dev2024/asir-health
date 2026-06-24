import { Activity, BarChart3, BookOpen, Bot, CalendarDays, HeartPulse, LogOut, QrCode, ShieldCheck, Ticket } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/appStore';

const sections = [
  { label: 'المؤشرات', href: '/admin#dashboard', icon: BarChart3 },
  { label: 'الكلمات', href: '/admin#keywords', icon: Bot },
  { label: 'الدكتور مساعد', href: '/admin#doctor-assistant', icon: HeartPulse },
  { label: 'الفعاليات', href: '/admin#events', icon: CalendarDays },
  { label: 'المحتوى', href: '/admin#content', icon: BookOpen },
  { label: 'الجواز', href: '/admin#passport', icon: Ticket },
  { label: 'البداية الذكية', href: '/admin#smart-entry', icon: Activity },
  { label: 'تقارير QR', href: '/admin#qr', icon: QrCode },
  { label: 'QR المناطق', to: '/admin/qr-locations', icon: QrCode },
];

export function AdminLayout() {
  const authenticated = useAppStore((state) => state.adminAuthenticated);
  const logout = useAppStore((state) => state.logout);
  const refreshAdminSession = useAppStore((state) => state.refreshAdminSession);

  useEffect(() => {
    refreshAdminSession();
    const interval = window.setInterval(refreshAdminSession, 60 * 1000);
    return () => window.clearInterval(interval);
  }, [refreshAdminSession]);

  if (!authenticated) {
    return <Navigate replace to="/admin/login" />;
  }

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-950">
      {/* ── Mobile top nav ──────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm lg:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-white">
            <ShieldCheck className="size-4" />
          </span>
          <span className="text-sm font-black text-slate-900">لوحة التحكم</span>
          <button
            className="mr-auto flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200 transition"
            onClick={logout}
            type="button"
          >
            <LogOut className="size-3.5" />
            خروج
          </button>
        </div>
        {/* Horizontal scroll nav */}
        <div className="flex gap-1 overflow-x-auto px-3 pb-3 scrollbar-none">
          {sections.map((section) => {
            const Icon = section.icon;
            const cls = 'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition';
            if ('to' in section) {
              return (
                <NavLink
                  className={({ isActive }) =>
                    `${cls} ${isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
                  }
                  key={section.to}
                  to={section.to}
                >
                  <Icon className="size-3.5" />
                  {section.label}
                </NavLink>
              );
            }
            return (
              <a
                className={`${cls} bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900`}
                href={section.href}
                key={section.href}
              >
                <Icon className="size-3.5" />
                {section.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Desktop layout ──────────────────────────────────── */}
      <div className="mx-auto grid w-full max-w-7xl gap-4 p-4 lg:grid-cols-[17rem_1fr]">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-4 flex h-[calc(100dvh-2rem)] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <NavLink className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition" to="/admin">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
                <ShieldCheck className="size-5" />
              </span>
              <span>
                <span className="block text-base font-black text-slate-950">لوحة التحكم</span>
                <span className="block text-xs font-bold text-teal-700">بوابة الإدارة</span>
              </span>
            </NavLink>

            <nav className="mt-5 grid gap-1 overflow-y-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                const base =
                  'flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-bold transition';

                if ('to' in section) {
                  return (
                    <NavLink
                      className={({ isActive }) =>
                        `${base} ${isActive ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`
                      }
                      key={section.to}
                      to={section.to}
                    >
                      <Icon className="size-4 shrink-0" />
                      {section.label}
                    </NavLink>
                  );
                }

                return (
                  <a
                    className={`${base} text-slate-600 hover:bg-slate-100 hover:text-slate-950`}
                    href={section.href}
                    key={section.href}
                  >
                    <Icon className="size-4 shrink-0" />
                    {section.label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-slate-100 pt-4">
              <Button className="w-full" icon={<LogOut className="size-4" />} onClick={logout} variant="secondary">
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
