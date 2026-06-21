import { Activity, HeartPulse, MapPinned, Route, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import asirSplashView from '../assets/asir-splash-view.png';
import { Button } from './ui/Button';

interface SplashScreenProps {
  visible: boolean;
  onDone: () => void;
  autoClose?: boolean;
}

const promiseItems = [
  { label: 'موقعك', icon: MapPinned },
  { label: 'نبض صحي', icon: Activity },
  { label: 'مسار الرحلة', icon: Route },
];

export function SplashScreen({ visible, onDone, autoClose = true }: SplashScreenProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible || !autoClose) {
      return;
    }

    const timer = window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(onDone, 360);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [autoClose, onDone, visible]);

  if (!visible) {
    return null;
  }

  function closeSplash(delay = 220) {
    setLeaving(true);
    window.setTimeout(onDone, delay);
  }

  return (
    <div
      className={`fixed inset-0 z-50 h-dvh overflow-hidden bg-emerald-950 text-white transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img
        alt="منظر مبهج من عسير"
        className="splash-scene-zoom splash-image fixed inset-0 h-dvh w-full object-cover object-center"
        src={asirSplashView}
      />
      <div className="splash-backdrop fixed inset-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(180deg,rgba(236,253,245,0.16),rgba(15,118,110,0.18)_58%,rgba(2,6,23,0.58))]" />

      <span className="splash-sun-ring" />
      <span className="splash-heritage-ribbon splash-heritage-ribbon-top" />
      <span className="splash-heritage-ribbon splash-heritage-ribbon-bottom" />
      <span className="splash-leaf splash-leaf-one">◆</span>
      <span className="splash-leaf splash-leaf-two">✦</span>
      <span className="splash-leaf splash-leaf-three">●</span>
      <span className="splash-thread splash-thread-one" />
      <span className="splash-thread splash-thread-two" />
      <span className="splash-thread splash-thread-three" />
      <span className="splash-thread splash-thread-four" />
      <span className="splash-orbit splash-orbit-one" />
      <span className="splash-orbit splash-orbit-two" />
      <span className="splash-gold-dot splash-gold-dot-one" />
      <span className="splash-gold-dot splash-gold-dot-two" />
      <span className="splash-gold-dot splash-gold-dot-three" />
      <span className="splash-particle splash-particle-one" />
      <span className="splash-particle splash-particle-two" />
      <span className="splash-particle splash-particle-three" />
      <span className="splash-particle splash-particle-four" />
      <span className="splash-particle splash-particle-five" />
      <span className="splash-glint splash-glint-one" />
      <span className="splash-glint splash-glint-two" />
      <span className="splash-glint splash-glint-three" />

      <div className="relative grid h-dvh place-items-center px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+2rem)]">
        <div className="splash-glass-panel w-full max-w-sm text-center">
          <div className="splash-float relative mx-auto grid size-28 place-items-center rounded-[2rem] border border-white/70 bg-gradient-to-br from-teal-500 via-emerald-500 to-amber-300 shadow-2xl shadow-teal-950/20">
            <span className="splash-pulse absolute size-28 rounded-[2rem] border border-white/70" />
            <span className="splash-heart-glow absolute inset-3 rounded-[1.45rem]" />
            <HeartPulse className="relative size-14 text-white drop-shadow" strokeWidth={2.5} />
          </div>

          <div className="splash-welcome-burst mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-100/80 bg-white/78 px-6 py-3 text-2xl font-black text-emerald-950 shadow-[0_0_40px_rgba(45,212,191,0.32)]">
            <Sparkles className="size-5 text-amber-500" />
            <span className="inline-flex flex-row items-baseline gap-2" dir="rtl">
              <span dir="rtl">مرحبا</span>
              <span className="text-3xl text-teal-700">1000</span>
            </span>
          </div>

          <h1 className="splash-reveal mt-5 bg-gradient-to-l from-teal-700 via-emerald-600 to-amber-500 bg-clip-text text-5xl font-black leading-tight tracking-normal text-transparent">
            صيف وصحة
          </h1>
          <p className="splash-reveal splash-reveal-delay mt-3 text-xl font-black text-slate-700">
            أهلاً بك في عسير
          </p>
          <div className="mt-8 grid grid-cols-3 gap-2">
            {promiseItems.map((item) => (
              <div
                className="rounded-lg border border-white/80 bg-white/74 p-3 text-slate-800 shadow-lg shadow-sky-950/10 backdrop-blur"
                key={item.label}
              >
                <item.icon className="mx-auto size-5 text-teal-600" />
                <p className="mt-2 text-xs font-black">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-right" aria-label="جاري تجهيز التجربة">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/85 shadow-inner shadow-slate-950/10">
              <span className="splash-loading-bar block h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#2dd4bf,#fbbf24,#ffffff)] shadow-[0_0_24px_rgba(20,184,166,0.65)]" />
            </div>
          </div>

          {!autoClose ? (
            <Button className="mt-8 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => closeSplash()}>
              ابدأ التجربة
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
