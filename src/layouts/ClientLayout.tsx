import { Award, Bot, Flame, Home, Route } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { FloatingNowButton } from '../components/FloatingNowButton';
import { DoctorAssistantFloatingButton } from '../components/DoctorAssistantFloatingButton';
import { useQrTracking } from '../hooks/useQrTracking';
import { useAppStore } from '../store/appStore';

const allMobileNavItems = [
  { label: 'الرئيسية', to: '/', icon: Home, feature: null },
  { label: 'رحلتي', to: '/journey', icon: Route, feature: null },
  { label: 'بطل الصحة', to: '/hero', icon: Flame, feature: 'healthHero' as const },
  { label: 'الجواز', to: '/passport', icon: Award, feature: null },
  { label: 'مساعد', to: '/assistant', icon: Bot, feature: null },
];

const allDesktopNav = [
  { label: 'الرئيسية', to: '/', feature: null },
  { label: 'رحلتي', to: '/journey', feature: null },
  { label: 'فعاليات', to: '/events', feature: null },
  { label: 'الجواز', to: '/passport', feature: null },
  { label: 'بطل الصحة', to: '/hero', feature: 'healthHero' as const },
  { label: 'الخطة', to: '/plan', feature: null },
  { label: 'المواد', to: '/downloads', feature: null },
  { label: 'قريب مني', to: '/nearby', feature: null },
  { label: 'مساعد', to: '/assistant', feature: null },
];

export function ClientLayout() {
  useQrTracking();
  const location = useLocation();
  const home = location.pathname === '/';
  const featuresEnabled = useAppStore((state) => state.featuresEnabled);

  const mobileNavItems = allMobileNavItems.filter(
    (item) => item.feature === null || featuresEnabled[item.feature]
  );
  const desktopNav = allDesktopNav.filter(
    (item) => item.feature === null || featuresEnabled[item.feature]
  );

  // If health hero is disabled, fill its slot in mobile nav (keep 5 items)
  const mobileNavFinal = mobileNavItems.length < 5
    ? [...mobileNavItems.slice(0, 2), ...mobileNavItems.slice(2)]
    : mobileNavItems;

  const cols = mobileNavFinal.length <= 4 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <div className="min-h-dvh bg-[#F4FAFC] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-[#E0F9FA] bg-white/96 shadow-sm shadow-[#15508A]/6 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4">
          <NavLink className="flex min-w-0 items-center gap-3" to="/">
            <span className="grid h-16 w-36 shrink-0 place-items-center rounded-xl border border-[#E0F9FA] bg-white px-2 shadow-md shadow-[#15508A]/8">
              <BrandLogo className="h-14 w-32" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-black leading-5">صيف وصحة</span>
              <span className="block text-xs font-bold text-[#15508A]">مساعد عسير</span>
            </span>
          </NavLink>
          <nav className="hidden items-center gap-1 sm:flex">
            {desktopNav.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-bold transition ${
                    isActive ? 'bg-[#E0F9FA] text-[#15508A]' : 'text-slate-600 hover:bg-[#F4FAFC]'
                  }`
                }
                end={item.to === '/'}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className={home ? 'w-full pb-28 sm:pb-10' : 'mx-auto w-full max-w-6xl px-4 pb-28 sm:pb-10'}>
        <Outlet />
      </main>
      <FloatingNowButton />
      <DoctorAssistantFloatingButton />
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E0F9FA] bg-white/96 px-2 pb-[calc(env(safe-area-inset-bottom)+0.4rem)] pt-2 shadow-2xl shadow-[#15508A]/10 backdrop-blur sm:hidden">
        <div className={`mx-auto grid max-w-md gap-1 ${cols}`}>
          {mobileNavFinal.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-bold transition ${
                  isActive ? 'bg-[#E0F9FA] text-[#15508A]' : 'text-[#A09EA9]'
                }`
              }
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              <item.icon className={`size-5 ${item.to === '/hero' ? 'text-amber-500' : ''}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
