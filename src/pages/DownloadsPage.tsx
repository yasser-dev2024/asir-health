import { BookOpen, Download, FileText, Layers } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { useAppStore } from '../store/appStore';
import type { ContentType } from '../types/domain';
import { safeUrl } from '../utils/security';

const icons: Record<ContentType, typeof FileText> = {
  post: BookOpen,
  card: Layers,
  pdf: FileText,
};

export function DownloadsPage() {
  const contents = useAppStore((state) => state.contents.filter((content) => content.active));

  return (
    <div className="py-4">
      <PageHeader
        description="مواد توعوية قابلة للإدارة من لوحة التحكم: منشورات، بطاقات، وملفات PDF للحملة."
        eyebrow="المواد الصحية"
        title="مكتبة صيف وصحة"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contents.map((content) => {
          const Icon = icons[content.type];
          const fileUrl = safeUrl(content.fileUrl) || '#';

          return (
            <article className="group rounded-xl border border-[#E0F9FA] bg-white shadow-sm hover:shadow-md hover:border-[#15508A]/30 transition-all duration-200" key={content.id}>
              <div className="rounded-t-xl px-4 pt-4 pb-3 border-b border-[#E0F9FA]" style={{ background: 'linear-gradient(135deg,#F4FAFC,#E0F9FA55)' }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-xl bg-[#15508A] text-white shadow-md shadow-[#15508A]/25">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full border border-[#E0F9FA] bg-white px-3 py-1 text-xs font-bold text-[#057590]">
                    {content.category}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-black text-[#283A83]">{content.title}</h2>
              </div>
              <div className="p-4">
                <p className="min-h-16 text-sm leading-7 text-slate-600">{content.summary}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-[#A09EA9]">تحديث {content.updatedAt}</p>
                  <a href={fileUrl} rel="noopener noreferrer" target="_blank">
                    <button
                      className="flex items-center gap-2 rounded-lg bg-[#15508A] px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-[#283A83] transition"
                      type="button"
                    >
                      <Download className="size-4" />
                      {content.actionLabel}
                    </button>
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
