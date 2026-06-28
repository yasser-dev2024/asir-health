import { BookmarkCheck, CalendarCheck, HeartPulse, Map, MapPin, Route, ShieldPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { buildDailyPlan } from '../services/planService';
import { useAppStore } from '../store/appStore';

export function PlanPage() {
  const events = useAppStore((state) => state.events);
  const answers = useAppStore((state) => state.journeyAnswers);
  const savedPlan = useAppStore((state) => state.savedPlan);
  const savePlan = useAppStore((state) => state.savePlan);
  const mapEnabled = useAppStore((state) => state.featuresEnabled.map);
  const plan = buildDailyPlan(answers, events);

  return (
    <div className="py-4">
      <PageHeader
        action={
          <Button icon={<BookmarkCheck className="size-4" />} onClick={savePlan} variant={savedPlan ? 'secondary' : 'primary'}>
            {savedPlan ? 'تم حفظ خطتي' : 'احفظ خطتي'}
          </Button>
        }
        description="خطة يوم مبنية على اختياراتك، تجمع الفعالية الأقرب، ممشى مناسب، مركز صحي، ونصائح سلامة."
        eyebrow="الخطة الصحية"
        title="يوم صحي وسياحي جاهز"
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <section className="grid gap-3">
          <article className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-[#E0F9FA] text-[#15508A]">
                <CalendarCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#A09EA9]">أقرب فعالية</p>
                <h2 className="mt-1 text-lg font-black text-slate-950">{plan.event.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{plan.event.description}</p>
                <p className="mt-3 text-sm font-bold text-[#15508A]">
                  {plan.event.location} - {plan.event.time}
                </p>
              </div>
            </div>
          </article>
          <article className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-[#E0F9FA] text-[#057590]">
                <Route className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#A09EA9]">أقرب ممشى</p>
                <h2 className="mt-1 text-lg font-black text-slate-950">{plan.walkway.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  يبعد {plan.walkway.distance}، طوله {plan.walkway.length}، و{plan.walkway.shade}.
                </p>
              </div>
            </div>
          </article>
          <article className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-green-50 text-[#16910D]">
                <ShieldPlus className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#A09EA9]">أقرب مركز صحي</p>
                <h2 className="mt-1 text-lg font-black text-slate-950">{plan.healthCenter.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {plan.healthCenter.distance} - {plan.healthCenter.availability} - للاستشارة {plan.healthCenter.phone}
                </p>
              </div>
            </div>
          </article>
        </section>
        <aside className="grid gap-4">
          <section className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <HeartPulse className="size-5 text-[#15508A]" />
              <h2 className="font-black text-slate-950">نصائح صحية</h2>
            </div>
            <ul className="mt-4 grid gap-2">
              {plan.tips.map((tip) => (
                <li className="rounded-lg bg-[#F4FAFC] p-3 text-sm leading-7 text-slate-700" key={tip}>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
          {mapEnabled && <section className="overflow-hidden rounded-xl border border-[#E0F9FA] bg-white shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-[#E0F9FA]">
              <div className="flex items-center gap-3">
                <Map className="size-5 text-[#15508A]" />
                <h2 className="font-black text-slate-950">خريطة المنطقة</h2>
              </div>
              <a
                className="text-xs font-bold text-[#15508A] hover:underline"
                href="https://maps.google.com/?q=أبها+عسير+السعودية"
                rel="noopener noreferrer"
                target="_blank"
              >
                خرائط Google
              </a>
            </div>
            <iframe
              allowFullScreen
              className="h-56 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Abha+Aseer+Saudi+Arabia&z=12&output=embed&hl=ar"
              title="خريطة منطقة عسير"
            />
          </section>}
        </aside>
      </div>
    </div>
  );
}
