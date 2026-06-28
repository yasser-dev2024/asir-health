import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import asirSplashView from '../assets/asir-splash-view.png';
import { BrandLogo } from './BrandLogo';
import { Button } from './ui/Button';

interface SplashScreenProps {
  visible: boolean;
  onDone: () => void;
  autoClose?: boolean;
}

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
      className={`fixed inset-0 z-50 h-dvh overflow-hidden bg-[#283A83] text-white transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img
        alt="منظر مبهج من عسير"
        className="splash-scene-zoom splash-image fixed inset-0 h-dvh w-full object-cover object-center"
        src={asirSplashView}
      />
      <div className="splash-backdrop fixed inset-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(244,250,252,0.34),transparent_28%),linear-gradient(180deg,rgba(47,169,224,0.16),rgba(21,80,138,0.24)_58%,rgba(40,58,131,0.64))]" />

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
        <div className="splash-clear-panel w-full max-w-lg text-center">
          <div className="splash-brand-entrance splash-logo-stage relative mx-auto mb-3 grid h-40 w-[min(88vw,28rem)] place-items-center sm:h-64">
            <span className="splash-logo-ray splash-logo-ray-one" />
            <span className="splash-logo-ray splash-logo-ray-two" />
            <span className="splash-logo-ray splash-logo-ray-three" />
            <span className="splash-logo-halo splash-logo-halo-one" />
            <span className="splash-logo-halo splash-logo-halo-two" />
            <span className="splash-pulse absolute h-32 w-64 rounded-full border border-white/60 sm:h-40 sm:w-80" />
            <span className="splash-logo-shine" />
            <BrandLogo
              className="splash-logo-mark relative z-10 h-36 w-64 sm:h-56 sm:w-80"
              imageClassName="drop-shadow-[0_16px_38px_rgba(2,6,23,0.78)]"
              tone="asir-white"
            />
          </div>

          <div className="splash-welcome-burst mt-2 inline-flex items-center gap-2 rounded-full border border-[#CCEAF7]/80 bg-white/82 px-6 py-3 text-2xl font-black text-[#283A83] shadow-[0_0_40px_rgba(47,169,224,0.36)]">
            <Sparkles className="size-5 text-[#1691D0]" />
            <span className="inline-flex flex-row items-baseline gap-2" dir="rtl">
              <span dir="rtl">مرحبا</span>
              <span className="text-3xl text-[#15508A]">1000</span>
            </span>
          </div>

          <h1 className="splash-reveal splash-strong-text mt-5 text-5xl font-black leading-tight tracking-normal text-white">
            صيف وصحة
          </h1>
          <p className="splash-reveal splash-reveal-delay splash-strong-text mt-3 text-xl font-black text-[#EAF7FC]">
            أهلاً بك في عسير
          </p>

          <div className="mt-8 text-right" aria-label="جاري تجهيز التجربة">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/85 shadow-inner shadow-slate-950/10">
              <span className="splash-loading-bar block h-full rounded-full bg-[linear-gradient(90deg,#15508A,#1691D0,#2FA9E0,#ffffff)] shadow-[0_0_24px_rgba(47,169,224,0.65)]" />
            </div>
          </div>

          {!autoClose ? (
            <Button className="mt-8 bg-[#15508A] text-white hover:bg-[#283A83]" onClick={() => closeSplash()}>
              ابدأ التجربة
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
