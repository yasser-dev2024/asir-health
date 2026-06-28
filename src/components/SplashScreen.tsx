import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import asirHeritageSplash from '../assets/asir-heritage-splash.png';
import { BrandLogo } from './BrandLogo';
import { Button } from './ui/Button';

interface SplashScreenProps {
  visible: boolean;
  onDone: () => void;
  autoClose?: boolean;
}

export function SplashScreen({ visible, onDone, autoClose = true }: SplashScreenProps) {
  const [leaving, setLeaving] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);

  useEffect(() => {
    if (!visible || !autoClose) {
      return;
    }

    // drop will-change after entrance animation finishes to free GPU layer
    const entranceTimer = window.setTimeout(() => setEntranceDone(true), 1050);

    const timer = window.setTimeout(() => {
      setLeaving(true);
      window.setTimeout(onDone, 360);
    }, 4000);

    return () => {
      window.clearTimeout(entranceTimer);
      window.clearTimeout(timer);
    };
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
      className={`fixed inset-0 z-50 h-dvh overflow-hidden transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(158deg, #1c2d6e 0%, #283A83 45%, #15508A 100%)' }}
    >
      {/* Background image — semi-transparent so the dark blue shows through */}
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-dvh w-full select-none object-cover object-center opacity-40"
        draggable={false}
        src={asirHeritageSplash}
      />
      {/* Gradient overlay to keep logo and text readable */}
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(28,45,110,0.52)_0%,rgba(40,58,131,0.38)_40%,rgba(21,80,138,0.62)_100%)]" />

      <div className="relative grid h-dvh place-items-center px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+2rem)]">
        <div className="splash-clear-panel w-full max-w-lg text-center">
          <div
            className={`splash-brand-entrance splash-logo-stage relative mx-auto mb-3 grid h-40 w-[min(88vw,28rem)] place-items-center sm:h-64${
              entranceDone ? ' splash-entrance-done' : ''
            }`}
          >
            <span className="splash-logo-pulse" />
            <BrandLogo
              className="splash-logo-mark relative z-10 h-36 w-64 sm:h-56 sm:w-80"
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
