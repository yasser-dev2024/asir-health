import { Award, CheckCircle, ChevronLeft, Flame, Phone, Share2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '../components/BrandLogo';
import { useAppStore } from '../store/appStore';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  tip: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'كم مرة ينبغي شرب الماء خلال رحلة مشي في عسير؟',
    options: ['مرة واحدة قبل المشي', 'كل 20 إلى 30 دقيقة', 'فقط عند الشعور بالعطش'],
    correctIndex: 1,
    tip: 'الترطيب المنتظم يحمي جسمك من الإجهاد ويحافظ على نشاطك.',
  },
  {
    id: 2,
    question: 'ما أفضل وقت للمشي والنشاط في طبيعة عسير؟',
    options: ['وقت الظهيرة تحت الشمس', 'الصباح الباكر أو بعد العصر', 'في أي وقت دون قيود'],
    correctIndex: 1,
    tip: 'الصباح الباكر والمساء أوقات مثالية لتجنب الحرارة والاستمتاع بأجواء عسير.',
  },
  {
    id: 3,
    question: 'ما علامة التحذير من ضربة الشمس؟',
    options: ['الشعور بالجوع الشديد', 'الدوار والصداع واحمرار الجلد', 'الشعور بالبرودة فجأة'],
    correctIndex: 1,
    tip: 'عند أي من هذه الأعراض، انتقل فوراً للظل واتصل بـ 937.',
  },
  {
    id: 4,
    question: 'ما أهم ما يجب حمله خلال رحلة هايكنج في عسير؟',
    options: ['الهاتف وسماعات الأذن فقط', 'ماء كافٍ وواقي شمس وحذاء مناسب', 'وجبات ثقيلة وعصائر'],
    correctIndex: 1,
    tip: 'الثلاثي: ماء + واقي شمس + حذاء مناسب = هايكنج آمن.',
  },
  {
    id: 5,
    question: 'إذا شعرت بألم في الصدر أثناء النشاط، ماذا تفعل؟',
    options: ['أكمل النشاط لتقوية جسمك', 'توقف فوراً واتصل بـ 937', 'اشرب ماءً بارداً وأكمل'],
    correctIndex: 1,
    tip: 'ألم الصدر أثناء النشاط إشارة طوارئ — التوقف الفوري والاتصال بـ 937 ضرورة.',
  },
  {
    id: 6,
    question: 'كيف تحمي طفلك من حرارة الشمس في عسير؟',
    options: ['ملابس داكنة وتجنب الماء', 'قبعة وواقي شمس وشرب الماء بانتظام', 'البقاء في الداخل طوال اليوم'],
    correctIndex: 1,
    tip: 'الأطفال أكثر عرضة للإجهاد الحراري، الحماية الثلاثية تجعل رحلتهم ممتعة وآمنة.',
  },
  {
    id: 7,
    question: 'كم كمية الماء الموصى بها في رحلة مشي لمدة ساعة؟',
    options: ['أقل من 250 مل', 'لتر أو أكثر', 'الماء غير ضروري في الجو البارد'],
    correctIndex: 1,
    tip: 'حتى في الطقس البارد، جسمك يفقد الماء — اشرب بانتظام بصرف النظر عن الطقس.',
  },
];

type Phase = 'intro' | 'quiz' | 'result';

function getBadge(score: number, total: number): { title: string; desc: string; color: string; emoji: string } {
  const pct = score / total;
  if (pct >= 0.9) return { title: 'أسطورة الصحة في عسير', desc: 'أداء استثنائي! أنت قدوة صحية حقيقية.', color: '#D4AF37', emoji: '🏆' };
  if (pct >= 0.7) return { title: 'بطل الصحة', desc: 'رائع! معرفتك الصحية فوق المتوسط.', color: '#15508A', emoji: '🥇' };
  if (pct >= 0.5) return { title: 'صديق الصحة', desc: 'جيد! استمر في التعلم وستصل للقمة.', color: '#057590', emoji: '🥈' };
  return { title: 'مبتدئ صحي', desc: 'بداية جيدة! حاول مجدداً لتحسين نتيجتك.', color: '#A09EA9', emoji: '🌱' };
}

export function HealthHeroPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [phone, setPhone] = useState('');
  const [shareError, setShareError] = useState('');
  const [sent, setSent] = useState(false);
  const addHeroEntry = useAppStore((s) => s.addHeroEntry);

  const totalPoints = questions.length * 15;
  const score = answers.reduce<number>((acc, ans, i) => {
    const question = questions[i];
    return acc + (question && ans === question.correctIndex ? 15 : 0);
  }, 0);
  const badge = getBadge(score, totalPoints);
  const q = questions[currentQ] ?? questions[0]!;
  const answered = selected !== null;
  const isCorrect = answered && selected === q.correctIndex;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    const next = [...answers];
    next[currentQ] = idx;
    setAnswers(next);
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
    } else {
      setPhase('result');
    }
  }

  function handleRestart() {
    setPhase('intro');
    setCurrentQ(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill(null));
    setPhone('');
    setShareError('');
  }

  function handleWhatsApp() {
    const raw = phone.replace(/\s/g, '');
    if (!raw) {
      setShareError('أدخل رقم الجوال أولاً');
      return;
    }
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits.length < 9) {
      setShareError('رقم الجوال غير صحيح');
      return;
    }
    const intl = digits.startsWith('966') ? digits : digits.startsWith('05') ? `966${digits.slice(1)}` : `966${digits}`;
    const text = encodeURIComponent(
      `🏆 مبارك! لقد حصلت على ${score} من ${totalPoints} نقطة في تحدي "بطل الصحة في عسير"\n` +
      `${badge.emoji} لقبك: ${badge.title}\n\n` +
      `💪 استمر في الرياضة والنشاط الصحي، أنت قدوة في منطقة عسير!\n` +
      `🌿 تذكر: الصحة كنز، والنشاط في طبيعة عسير متعة لا تُقدّر.\n\n` +
      `هل تتحدّى أصدقاءك؟ جرّب التحدي: https://yasser-dev2024.github.io/asir-health/#/hero`
    );
    window.open(`https://wa.me/${intl}?text=${text}`, '_blank');
    addHeroEntry({ phone: `0${intl.slice(3)}`, score, badge: badge.title });
    setSent(true);
    setShareError('');
  }

  function handleShareGeneral() {
    const text = encodeURIComponent(
      `🏆 حصلت على ${score} من ${totalPoints} نقطة في تحدي "بطل الصحة في عسير"\n` +
      `${badge.emoji} اللقب: ${badge.title}\n\n` +
      `جرّب التحدي: https://yasser-dev2024.github.io/asir-health/`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  /* ── Intro ─────────────────────────────────────────────── */
  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-xl py-8 px-4">
        <div className="rounded-2xl border border-[#E0F9FA] bg-white shadow-lg shadow-[#15508A]/8 overflow-hidden">
          <div className="bg-[#283A83] px-6 py-8 text-white text-center">
            <div className="mx-auto mb-4 grid size-20 place-items-center rounded-2xl bg-white/15 backdrop-blur">
              <Flame className="size-10 text-amber-300" />
            </div>
            <h1 className="text-3xl font-black">بطل الصحة في عسير</h1>
            <p className="mt-2 text-sm font-bold text-white/80">اختبر معرفتك الصحية وتحدّ نفسك</p>
          </div>

          <div className="px-6 py-6">
            <div className="mb-6 grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'سؤال', value: String(questions.length), color: '#15508A' },
                { label: 'دقائق', value: '3', color: '#057590' },
                { label: 'نقطة', value: String(totalPoints), color: '#D4AF37' },
              ].map((stat) => (
                <div className="rounded-xl border border-[#E0F9FA] bg-[#F4FAFC] p-3" key={stat.label}>
                  <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs font-bold text-[#A09EA9]">{stat.label}</p>
                </div>
              ))}
            </div>

            <ul className="mb-6 space-y-2 text-sm font-bold text-slate-700">
              {['أجب على كل سؤال باختيار الإجابة الصحيحة', 'ستحصل على 15 نقطة لكل إجابة صحيحة', 'في النهاية يمكنك مشاركة نتيجتك عبر واتساب'].map((item) => (
                <li className="flex items-center gap-2" key={item}>
                  <span className="size-2 rounded-full bg-[#15508A] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              className="w-full rounded-xl bg-[#15508A] py-4 text-lg font-black text-white shadow-lg shadow-[#15508A]/30 transition hover:bg-[#283A83] active:scale-95"
              onClick={() => setPhase('quiz')}
              type="button"
            >
              ابدأ التحدي 🔥
            </button>

            <div className="mt-4 flex justify-center">
              <span className="grid h-10 w-24 place-items-center rounded-lg border border-[#E0F9FA]">
                <BrandLogo className="h-8 w-20" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz ──────────────────────────────────────────────── */
  if (phase === 'quiz') {
    const progress = ((currentQ + (answered ? 1 : 0)) / questions.length) * 100;
    return (
      <div className="mx-auto max-w-xl py-8 px-4">
        {/* Progress */}
        <div className="mb-5 flex items-center gap-3">
          <Flame className="size-5 shrink-0 text-[#15508A]" />
          <div className="flex-1">
            <div className="mb-1 flex justify-between text-xs font-bold text-[#A09EA9]">
              <span>السؤال {currentQ + 1} من {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E0F9FA]">
              <div
                className="h-full rounded-full bg-[#15508A] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl border border-[#E0F9FA] bg-white shadow-lg shadow-[#15508A]/8 overflow-hidden">
          <div className="bg-[#F4FAFC] px-5 py-5 border-b border-[#E0F9FA]">
            <p className="text-[11px] font-black text-[#15508A] uppercase tracking-wide mb-2">السؤال {currentQ + 1}</p>
            <h2 className="text-xl font-black leading-relaxed text-[#283A83]">{q.question}</h2>
          </div>

          <div className="px-5 py-5 space-y-3">
            {q.options.map((option, idx) => {
              let cls = 'w-full rounded-xl border-2 px-4 py-4 text-right text-base font-bold transition-all duration-150 ';
              if (!answered) {
                cls += 'border-[#E0F9FA] bg-white hover:border-[#15508A] hover:bg-[#F4FAFC] text-slate-800 cursor-pointer';
              } else if (idx === q.correctIndex) {
                cls += 'border-[#16910D] bg-green-50 text-[#16910D]';
              } else if (idx === selected) {
                cls += 'border-red-400 bg-red-50 text-red-600';
              } else {
                cls += 'border-[#E0F9FA] bg-[#F4FAFC] text-[#A09EA9]';
              }
              return (
                <button className={cls} key={idx} onClick={() => handleSelect(idx)} type="button">
                  <span className="flex items-center gap-3">
                    <span className="size-7 shrink-0 rounded-full border-2 border-current grid place-items-center text-sm font-black">
                      {['أ', 'ب', 'ج'][idx]}
                    </span>
                    {option}
                    {answered && idx === q.correctIndex && <CheckCircle className="size-5 mr-auto shrink-0" />}
                    {answered && idx === selected && idx !== q.correctIndex && <XCircle className="size-5 mr-auto shrink-0" />}
                  </span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`mx-5 mb-4 rounded-xl p-3 text-sm font-bold ${isCorrect ? 'bg-green-50 text-[#16910D]' : 'bg-amber-50 text-amber-800'}`}>
              {isCorrect ? '✅ إجابة صحيحة! ' : '💡 '}{q.tip}
            </div>
          )}

          <div className="px-5 pb-5">
            <button
              className={`w-full rounded-xl py-4 text-base font-black text-white transition ${answered ? 'bg-[#15508A] hover:bg-[#283A83] shadow-lg shadow-[#15508A]/25' : 'bg-[#A09EA9] cursor-not-allowed'}`}
              disabled={!answered}
              onClick={handleNext}
              type="button"
            >
              {currentQ < questions.length - 1 ? 'السؤال التالي' : 'اعرض النتيجة'}
              <ChevronLeft className="inline-block mr-2 size-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Result ────────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-xl py-8 px-4">
      <div className="rounded-2xl border border-[#E0F9FA] bg-white shadow-lg shadow-[#15508A]/8 overflow-hidden">
        {/* Badge header */}
        <div className="px-6 py-8 text-center" style={{ background: `linear-gradient(135deg, ${badge.color}18, ${badge.color}08)`, borderBottom: `3px solid ${badge.color}` }}>
          <div className="mx-auto mb-3 text-6xl">{badge.emoji}</div>
          <h2 className="text-2xl font-black" style={{ color: badge.color }}>{badge.title}</h2>
          <p className="mt-1 text-sm font-bold text-[#A09EA9]">{badge.desc}</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="rounded-xl border-2 border-[#E0F9FA] bg-white px-6 py-3 text-center">
              <p className="text-3xl font-black" style={{ color: badge.color }}>{score}</p>
              <p className="text-xs font-bold text-[#A09EA9]">من {totalPoints} نقطة</p>
            </div>
          </div>
        </div>

        {/* Answer review */}
        <div className="px-5 py-4 border-b border-[#E0F9FA]">
          <p className="text-xs font-black text-[#A09EA9] mb-3">مراجعة إجاباتك</p>
          <div className="grid grid-cols-7 gap-2">
            {questions.map((question, i) => {
              const correct = answers[i] === question.correctIndex;
              return (
                <div
                  className="rounded-lg border-2 py-1 text-center text-xs font-black"
                  key={question.id}
                  style={{ borderColor: correct ? '#16910D' : '#ef4444', color: correct ? '#16910D' : '#ef4444', background: correct ? '#f0fdf4' : '#fef2f2' }}
                >
                  {i + 1}<br />{correct ? '✓' : '✗'}
                </div>
              );
            })}
          </div>
        </div>

        {/* WhatsApp share */}
        <div className="px-5 py-5">
          <p className="mb-1 text-sm font-black text-[#283A83]">شارك نتيجتك عبر واتساب</p>
          <p className="mb-3 text-xs text-[#A09EA9]">أدخل رقم جوالك لإرسال رسالة تحفيز لك ولأصدقائك</p>
          {sent ? (
            <div className="mb-3 rounded-xl border-2 border-[#16910D] bg-green-50 p-4 text-center">
              <CheckCircle className="mx-auto size-8 text-[#16910D] mb-2" />
              <p className="text-sm font-black text-[#16910D]">تم الإرسال بنجاح!</p>
              <p className="text-xs text-[#16910D]/70 mt-1">سيتواصل معك فريق تجمع عسير الصحي قريباً</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 rounded-xl border-2 border-[#E0F9FA] bg-[#F4FAFC] px-4 py-3 text-right text-sm font-bold text-slate-800 outline-none focus:border-[#15508A] transition"
                  dir="ltr"
                  onChange={(e) => { setPhone(e.target.value); setShareError(''); }}
                  placeholder="05xxxxxxxx"
                  type="tel"
                  value={phone}
                />
                <button
                  className="flex items-center gap-2 rounded-xl bg-[#16910D] px-4 py-3 text-sm font-black text-white shadow-md hover:bg-green-700 transition active:scale-95"
                  onClick={handleWhatsApp}
                  type="button"
                >
                  <Phone className="size-4" />
                  إرسال
                </button>
              </div>
              {shareError && <p className="text-xs font-bold text-red-500 mb-2">{shareError}</p>}
            </>
          )}
          <button
            className="w-full rounded-xl border-2 border-[#E0F9FA] bg-[#F4FAFC] py-3 text-sm font-bold text-[#15508A] hover:bg-[#E0F9FA] transition mb-3"
            onClick={handleShareGeneral}
            type="button"
          >
            <Share2 className="inline-block ml-2 size-4" />
            مشاركة مع أي شخص عبر واتساب
          </button>

          <div className="flex gap-2">
            <button
              className="flex-1 rounded-xl border-2 border-[#15508A] bg-white py-3 text-sm font-black text-[#15508A] hover:bg-[#F4FAFC] transition"
              onClick={handleRestart}
              type="button"
            >
              أعد التحدي
            </button>
            <div className="flex items-center justify-center px-3">
              <Award className="size-5 text-[#D4AF37]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
