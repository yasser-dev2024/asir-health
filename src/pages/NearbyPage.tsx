import { Ambulance, ExternalLink, MapPin, Navigation, Phone, Share2, Trees } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { healthCenters, walkways } from '../data/mockData';
import { useAppStore } from '../store/appStore';
import { safeUrl } from '../utils/security';



export function NearbyPage() {
  const event = useAppStore((state) => state.events.find((item) => item.active));
  const mapEnabled = useAppStore((state) => state.featuresEnabled.map);
  const center = healthCenters[0] ?? {
    id: 'center-default',
    name: 'مركز صحي قريب',
    distance: 'قريب منك',
    availability: 'متاح عبر 937',
    phone: '937',
    mapUrl: 'https://maps.google.com/?q=Abha+Health+Center',
  };
  const walkway = walkways[0] ?? {
    id: 'walk-default',
    name: 'ممشى صحي قريب',
    distance: 'قريب منك',
    length: 'مسار قصير',
    shade: 'مناسب للمشي الخفيف',
    mapUrl: 'https://maps.google.com/?q=Abha+Walkway',
  };
  const centerMapUrl = safeUrl(center.mapUrl, { allowRelative: false, allowedProtocols: ['https:'] }) || '#';

  return (
    <div className="py-4">
      <PageHeader
        description="وضع سريع للزائر يعرض أقرب خدمات صحية وسياحية وإجراءات طارئة ومشاركة الموقع."
        eyebrow="أنا الآن"
        title="الخدمات القريبة منك"
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <section className="grid gap-3">
          <article className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-green-50 text-[#16910D]">
                <Ambulance className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#A09EA9]">أقرب مركز صحي</p>
                <h2 className="mt-1 text-lg font-black text-slate-950">{center.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  يبعد {center.distance}، {center.availability}.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`tel:${center.phone}`}>
                    <Button icon={<Phone className="size-4" />} variant="secondary">
                      {center.phone}
                    </Button>
                  </a>
                  <a href={centerMapUrl} rel="noopener noreferrer" target="_blank">
                    <Button icon={<ExternalLink className="size-4" />} variant="secondary">
                      الخريطة
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </article>
          <article className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-[#E0F9FA] text-[#057590]">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#A09EA9]">أقرب فعالية</p>
                <h2 className="mt-1 text-lg font-black text-slate-950">{event?.title ?? 'مسار الضباب الصحي'}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{event?.location ?? 'ممشى الضباب - أبها'}</p>
              </div>
            </div>
          </article>
          <article className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 place-items-center rounded-lg bg-[#E0F9FA] text-[#15508A]">
                <Trees className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#A09EA9]">أقرب ممشى</p>
                <h2 className="mt-1 text-lg font-black text-slate-950">{walkway.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {walkway.distance} - {walkway.length} - {walkway.shade}
                </p>
              </div>
            </div>
          </article>
        </section>
        <aside className="grid gap-4">
          <section className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <h2 className="text-lg font-black text-rose-900">الطوارئ</h2>
            <p className="mt-2 text-sm leading-7 text-rose-800">
              عند ألم صدر، ضيق تنفس شديد، إغماء، نزيف، أو أعراض خطيرة اتصل فوراً ولا تعتمد على المنصة.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href="tel:997">
                <Button className="w-full" variant="danger">
                  الإسعاف 997
                </Button>
              </a>
              <a href="tel:937">
                <Button className="w-full" variant="secondary">
                  الصحة 937
                </Button>
              </a>
            </div>
          </section>
          <section className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">مشاركة الموقع</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              يفتح زر المشاركة خيارات الجهاز لإرسال رابط موقعك الحالي للفريق أو للمرافقين.
            </p>
            <Button
              className="mt-4 w-full"
              icon={<Share2 className="size-4" />}
              onClick={() => {
                void navigator.share?.({
                  title: 'أنا الآن - صيف وصحة',
                  text: 'أحتاج أقرب خدمة صحية أو سياحية في عسير.',
                  url: window.location.href,
                });
              }}
            >
              مشاركة الموقع
            </Button>
          </section>
          {mapEnabled && <section className="overflow-hidden rounded-xl border border-[#E0F9FA] shadow-sm">
            <div className="flex items-center justify-between bg-[#F4FAFC] px-4 py-3 border-b border-[#E0F9FA]">
              <div className="flex items-center gap-2">
                <Navigation className="size-4 text-[#15508A]" />
                <span className="text-sm font-black text-[#283A83]">خريطة عسير</span>
              </div>
              <a
                className="text-xs font-bold text-[#15508A] hover:underline"
                href="https://maps.google.com/?q=أبها+عسير+السعودية"
                rel="noopener noreferrer"
                target="_blank"
              >
                فتح في خرائط Google
              </a>
            </div>
            <iframe
              allowFullScreen
              className="h-64 w-full border-0"
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
