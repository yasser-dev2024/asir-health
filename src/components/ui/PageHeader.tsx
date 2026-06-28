import type { ReactNode } from 'react';
import { BrandLogo } from '../BrandLogo';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 pb-5 pt-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-sm font-bold text-teal-700">{eyebrow}</p> : null}
        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:self-end">
        <span className="grid h-16 w-36 place-items-center rounded-xl border border-teal-100 bg-white px-2 shadow-sm shadow-teal-950/8 sm:h-20 sm:w-44">
          <BrandLogo className="h-14 w-32 sm:h-[4.5rem] sm:w-40" />
        </span>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
