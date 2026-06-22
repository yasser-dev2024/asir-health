import { BarChart3, BookOpen, Bot, CalendarDays, HeartPulse, LogOut, QrCode, ShieldCheck, Ticket } from 'lucide-react';
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
  { label: 'البداية الذكية', href: '/admin#smart-entry', icon: HeartPulse },
  { label: 'QR', href: '/admin#qr', icon: QrCode },
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
      <div className="mx-auto grid w-full max-w-7xl gap-4 p-4 lg:grid-cols-[17rem_1fr]">
        <aside className="lg:sticky lg:top-4 lg:h-[calc(100dvh-2rem)]">
          <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <NavLink className="flex items-center gap-3" to="/admin">
              <span className="grid size-11 place-items-center rounded-lg bg-slate-950 text-white">
                <ShieldCheck className="size-5" />
              </span>
              <span>
                <span className="block text-base font-black">لوحة التحكم</span>
                <span className="block text-xs font-bold text-teal-700">بوابة الإدارة</span>
              </span>
            </NavLink>
            <nav className="mt-6 grid gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const className =
                  'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950';

                if ('to' in section) {
                  return (
                    <NavLink
                      className={({ isActive }) =>
                        `${className} ${isActive ? 'bg-teal-50 text-teal-800' : ''}`
                      }
                      key={section.to}
                      to={section.to}
                    >
                      <Icon className="size-4" />
                      {section.label}
                    </NavLink>
                  );
                }

                return (
                  <a className={className} href={section.href} key={section.href}>
                    <Icon className="size-4" />
                    {section.label}
                  </a>
                );
              })}
            </nav>
            <div className="mt-auto pt-4">
              <Button className="w-full" icon={<LogOut className="size-4" />} onClick={logout} variant="secondary">
                خروج
              </Button>
            </div>
          </div>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
