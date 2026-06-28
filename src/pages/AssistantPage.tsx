import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImage from '../assets/doctor.png';
import { BrandLogo } from '../components/BrandLogo';
import { useAppStore } from '../store/appStore';

export function AssistantPage() {
  const navigate = useNavigate();
  const questions = useAppStore((state) => state.doctorAssistantQuestions);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cleanedSearch = search.trim().toLowerCase();
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((question) => question.active)
      .sort((a, b) => a.order - b.order)
      .filter((question) => {
        if (!cleanedSearch) {
          return true;
        }

        return (
          question.question.toLowerCase().includes(cleanedSearch) ||
          question.keywords.some((keyword) => keyword.toLowerCase().includes(cleanedSearch))
        );
      });
  }, [cleanedSearch, questions]);
  return (
    <div className="fixed inset-0 z-30 flex h-dvh w-full flex-col overflow-hidden bg-[#F4FAFC] text-slate-950">
      <header className="border-b border-[#E0F9FA] bg-white px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] shadow-sm shadow-[#15508A]/6">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 overflow-hidden" dir="ltr">
          <span className="order-3 grid size-16 shrink-0 place-items-end overflow-hidden rounded-full bg-[#E0F9FA] ring-2 ring-[#E0F9FA] shadow-lg shadow-[#15508A]/10">
            <img alt="الدكتور مساعد" className="h-[4.5rem] w-14 object-cover object-top sm:h-20 sm:w-16" src={doctorImage} />
          </span>
          <div className="order-2 grid min-w-0 flex-1 justify-items-center text-center" dir="rtl">
            <span className="mb-1 grid h-16 w-36 place-items-center rounded-xl border border-[#E0F9FA] bg-white px-2 shadow-sm shadow-[#15508A]/8">
              <BrandLogo className="h-14 w-32" />
            </span>
            <h1 className="text-xl font-black text-slate-950 sm:text-2xl">الدكتور مساعد</h1>
            <p className="mt-1 text-xs font-bold text-[#15508A] sm:text-sm">مساعدك الصحي الذكي</p>
          </div>
          <button
            aria-label="إغلاق"
            className="order-1 grid size-12 shrink-0 place-items-center rounded-xl bg-[#F4FAFC] text-[#A09EA9] border border-[#E0F9FA] transition hover:bg-[#E0F9FA]"
            onClick={() => navigate(-1)}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 py-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#A09EA9]" />
          <input
            className="min-h-14 w-full rounded-xl border-2 border-[#E0F9FA] bg-white pr-12 pl-4 text-right text-base font-bold outline-none transition focus:border-[#15508A] focus:ring-2 focus:ring-[#E0F9FA]"
            onChange={(event) => {
              setSearch(event.target.value);
              setSelectedId(null);
            }}
            placeholder="ابحث في الأسئلة"
            value={search}
          />
        </label>

        <section className="mt-4 min-h-0 flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+5.5rem)]">
          {filteredQuestions.length ? (
            <div className="grid gap-3">
              {filteredQuestions.map((question) => {
                const selected = selectedId === question.id;

                return (
                  <article className="overflow-hidden rounded-xl border border-[#E0F9FA] bg-white shadow-sm" key={question.id}>
                    <button
                      className={`flex min-h-16 w-full items-center justify-between gap-3 px-4 py-3 text-right text-base font-black transition ${
                        selected ? 'bg-[#15508A] text-white' : 'bg-white text-slate-950 hover:bg-[#F4FAFC]'
                      }`}
                      onClick={() => setSelectedId(selected ? null : question.id)}
                      type="button"
                    >
                      <span className="min-w-0 flex-1 whitespace-normal break-words">{question.question}</span>
                    </button>
                    {selected ? (
                      <div className="border-t border-[#E0F9FA] bg-[#F4FAFC] p-4">
                        <p className="text-base font-bold leading-8 text-slate-700">{question.answer}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {question.keywords.map((keyword) => (
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#15508A] ring-1 ring-[#E0F9FA]" key={keyword}>
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center rounded-xl border border-dashed border-[#E0F9FA] bg-white p-6 text-center">
              <p className="text-lg font-black text-[#A09EA9]">لم أجد إجابة مناسبة، يمكنك تجربة سؤال آخر.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
