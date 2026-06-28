import { BookOpen, Download, ExternalLink, FileDown, FileText, Image as ImageIcon, Layers } from 'lucide-react';
import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import type { ContentType } from '../types/domain';
import { safeUrl } from '../utils/security';

const icons: Record<ContentType, typeof FileText> = {
  post: BookOpen,
  card: Layers,
  pdf: FileText,
  image: ImageIcon,
};

const labels: Record<ContentType, string> = {
  post: 'رابط توعوي',
  card: 'بطاقة',
  pdf: 'PDF',
  image: 'صورة',
};

const actionText: Record<ContentType, string> = {
  post: 'فتح الرابط',
  card: 'عرض البطاقة',
  pdf: 'تحميل PDF',
  image: 'عرض الصورة',
};

export function DownloadsPage() {
  const contents = useAppStore((state) => state.contents.filter((content) => content.active));
  const sortedContents = useMemo(
    () => [...contents].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))),
    [contents]
  );
  const pdfCount = sortedContents.filter((content) => content.type === 'pdf').length;
  const imageCount = sortedContents.filter((content) => content.type === 'image').length;

  return (
    <div className="py-5">
      <section className="relative isolate overflow-hidden rounded-2xl bg-[#15508A] px-5 py-6 text-white shadow-2xl shadow-[#15508A]/18 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(47,169,224,0.36),transparent_28%),linear-gradient(135deg,#15508A,#283A83)]" />
        <div className="absolute -left-12 top-8 size-36 rounded-full border border-white/12" />
        <div className="absolute -right-10 bottom-[-3rem] size-44 rounded-full bg-white/8 blur-sm" />
        <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-black">
              <FileDown className="size-4" />
              ملفات تحميل
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">مكتبة الملفات الصحية</h1>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-white/82 sm:text-base">
              كل الملفات التي يضيفها الأدمن تظهر هنا للزائر بشكل مرتب: أدلة PDF، صور توعوية، بطاقات، وروابط مفيدة.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-white/14 bg-white/12 px-4 py-3">
              <p className="text-2xl font-black">{sortedContents.length.toLocaleString('ar-SA')}</p>
              <p className="mt-1 text-[11px] font-bold text-white/72">ملف</p>
            </div>
            <div className="rounded-xl border border-white/14 bg-white/12 px-4 py-3">
              <p className="text-2xl font-black">{pdfCount.toLocaleString('ar-SA')}</p>
              <p className="mt-1 text-[11px] font-bold text-white/72">PDF</p>
            </div>
            <div className="rounded-xl border border-white/14 bg-white/12 px-4 py-3">
              <p className="text-2xl font-black">{imageCount.toLocaleString('ar-SA')}</p>
              <p className="mt-1 text-[11px] font-bold text-white/72">صور</p>
            </div>
          </div>
        </div>
      </section>

      {sortedContents.length === 0 ? (
        <section className="mt-5 rounded-2xl border border-dashed border-[#CCEAF7] bg-white p-10 text-center shadow-sm">
          <FileDown className="mx-auto size-12 text-[#A09EA9]" />
          <h2 className="mt-4 text-xl font-black text-[#283A83]">لا توجد ملفات تحميل حالياً</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
            عند إضافة الأدمن لملف PDF أو صورة من لوحة التحكم سيظهر هنا مباشرة.
          </p>
        </section>
      ) : (
        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedContents.map((content) => {
            const Icon = icons[content.type] ?? FileText;
            const fileUrl = safeUrl(content.fileUrl) || '#';
            const isImage = content.type === 'image' && fileUrl !== '#';
            const label = labels[content.type] ?? 'ملف';

            return (
              <article
                className="group overflow-hidden rounded-2xl border border-[#E0F9FA] bg-white shadow-sm shadow-[#15508A]/5 transition duration-200 hover:-translate-y-1 hover:border-[#15508A]/28 hover:shadow-xl hover:shadow-[#15508A]/10"
                key={content.id}
              >
                <div className="relative h-36 overflow-hidden bg-[#F4FAFC]">
                  {isImage ? (
                    <img
                      alt={content.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      src={fileUrl}
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#F4FAFC,#E0F9FA)]">
                      <span className="grid size-20 place-items-center rounded-2xl bg-white text-[#15508A] shadow-lg shadow-[#15508A]/12">
                        <Icon className="size-9" />
                      </span>
                    </div>
                  )}
                  <span className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/92 px-3 py-1 text-xs font-black text-[#15508A] shadow-sm">
                    {label}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-[#057590]">{content.category}</p>
                      <h2 className="mt-1 line-clamp-2 text-lg font-black leading-7 text-[#283A83]">{content.title}</h2>
                    </div>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#E0F9FA] text-[#15508A]">
                      <Icon className="size-5" />
                    </span>
                  </div>

                  <p className="mt-3 min-h-20 text-sm font-bold leading-7 text-slate-600">{content.summary}</p>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E0F9FA] pt-4">
                    <p className="text-[11px] font-black text-[#A09EA9]">تحديث {content.updatedAt || '—'}</p>
                    <a
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#15508A] px-4 text-sm font-black text-white shadow-lg shadow-[#15508A]/18 transition hover:bg-[#283A83]"
                      href={fileUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {content.type === 'post' ? <ExternalLink className="size-4" /> : <Download className="size-4" />}
                      {content.actionLabel || actionText[content.type]}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
