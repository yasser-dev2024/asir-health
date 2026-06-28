import { Award, BadgeCheck, QrCode, Star, Trophy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { passportLevels } from '../data/mockData';
import { useAppStore } from '../store/appStore';

export function PassportPage() {
  const passport = useAppStore((state) => state.passport);
  const addPassportPoints = useAppStore((state) => state.addPassportPoints);
  const currentLevel = [...passportLevels].reverse().find((level) => passport.points >= level.minPoints) ?? {
    id: 'level-default',
    title: 'مستكشف عسير الصحي',
    minPoints: 0,
    benefit: 'المستوى الأساسي للزائر.',
  };
  const nextLevel = passportLevels.find((level) => level.minPoints > passport.points);
  const progressMax = nextLevel ? nextLevel.minPoints : Math.max(passport.points, 1);
  const progress = Math.min(100, Math.round((passport.points / progressMax) * 100));

  return (
    <div className="py-4">
      <PageHeader
        description="نظام نقاط وأوسمة يحفز الزائر على مسح QR، زيارة الفعاليات، والمشي في المواقع الصحية."
        eyebrow="جواز صحة عسير"
        title="إنجازاتك الصحية"
      />
      <section className="rounded-xl p-5 text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#1c2d6e 0%,#283A83 55%,#15508A 100%)' }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#E0F9FA]">المستوى الحالي</p>
            <h2 className="mt-2 text-2xl font-black">{currentLevel.title}</h2>
          </div>
          <span className="grid size-16 place-items-center rounded-2xl bg-white/12">
            <Trophy className="size-8 text-amber-300" />
          </span>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm font-bold text-white/90">
            <span>{passport.points.toLocaleString('ar-SA')} نقطة</span>
            <span>{nextLevel ? `حتى ${nextLevel.title}` : 'أعلى مستوى'}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full rounded-full bg-amber-300 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
          <h2 className="flex items-center gap-2 font-black text-slate-950">
            <Award className="size-5 text-[#15508A]" />
            المستويات
          </h2>
          <div className="mt-4 grid gap-3">
            {passportLevels.map((level) => (
              <div className="rounded-lg bg-[#F4FAFC] p-3" key={level.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-slate-950">{level.title}</p>
                  <span className="text-xs font-bold text-[#15508A]">{level.minPoints} نقطة</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{level.benefit}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <article className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
              <QrCode className="size-5 text-[#15508A]" />
              <p className="mt-3 text-2xl font-black text-slate-950">{passport.scans.toLocaleString('ar-SA')}</p>
              <p className="text-xs font-bold text-[#A09EA9]">عمليات Scan</p>
            </article>
            <article className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
              <BadgeCheck className="size-5 text-[#15508A]" />
              <p className="mt-3 text-2xl font-black text-slate-950">{passport.badges.length.toLocaleString('ar-SA')}</p>
              <p className="text-xs font-bold text-[#A09EA9]">شارات نشطة</p>
            </article>
          </div>
          <div className="rounded-xl border border-[#E0F9FA] bg-white p-4 shadow-sm">
            <h2 className="flex items-center gap-2 font-black text-slate-950">
              <Star className="size-5 text-amber-500" />
              الإنجازات
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {passport.achievements.map((achievement) => (
                <span className="rounded-full border border-[#E0F9FA] bg-[#F4FAFC] px-3 py-2 text-xs font-bold text-[#15508A]" key={achievement}>
                  {achievement}
                </span>
              ))}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <Button onClick={() => addPassportPoints(20, 'زيارة فعالية صحية')} variant="secondary">
                زيارة فعالية
              </Button>
              <Button onClick={() => addPassportPoints(15, 'Scan QR جديد')} variant="secondary">
                Scan QR
              </Button>
              <Button onClick={() => addPassportPoints(10, 'زيارة ممشى صحي')} variant="secondary">
                زيارة ممشى
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
