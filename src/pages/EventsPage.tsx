import { CalendarDays, ExternalLink, MapPin, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { useAppStore } from '../store/appStore';
import { safeUrl } from '../utils/security';

const toneClasses = {
  green: 'from-[#15508A] to-[#057590]',
  blue: 'from-[#1691D0] to-[#283A83]',
  rose: 'from-[#283A83] to-[#15508A]',
  amber: 'from-[#2FA9E0] to-[#15508A]',
};

export function EventsPage() {
  const events = useAppStore((state) => state.events.filter((event) => event.active));
  const visitEvent = useAppStore((state) => state.visitEvent);

  return (
    <div className="py-4">
      <PageHeader
        description="فعاليات صحية وسياحية يمكن تحديثها من لوحة التحكم، مع مواقع وفئات مستهدفة وروابط خرائط."
        eyebrow="الفعاليات"
        title="برنامج صيف وصحة"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => {
          const mapUrl = safeUrl(event.mapUrl, { allowRelative: false, allowedProtocols: ['https:'] }) || '#';

          return (
          <article className="overflow-hidden rounded-xl border border-[#E0F9FA] bg-white shadow-sm hover:shadow-md transition-shadow" key={event.id}>
            <div className={`h-28 bg-gradient-to-l ${toneClasses[event.tone]} p-4 text-white`}>
              <p className="text-xs font-bold text-white/80">{event.category}</p>
              <h2 className="mt-2 text-xl font-black">{event.title}</h2>
            </div>
            <div className="p-4">
              <p className="text-sm leading-7 text-slate-600">{event.description}</p>
              <div className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-[#15508A]" />
                  {event.location}
                </span>
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-[#15508A]" />
                  {event.date} - {event.time}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="size-4 text-[#15508A]" />
                  {event.audience}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-[#A09EA9]">{event.visits.toLocaleString('ar-SA')} زيارة</p>
                <a href={mapUrl} rel="noopener noreferrer" target="_blank">
                  <Button icon={<ExternalLink className="size-4" />} onClick={() => visitEvent(event.id)} variant="secondary">
                    الخريطة
                  </Button>
                </a>
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}
