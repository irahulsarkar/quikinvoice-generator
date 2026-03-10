import type { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const SectionCard = ({
  title,
  subtitle,
  actions,
  className,
  children,
}: PropsWithChildren<SectionCardProps>) => {
  return (
    <section className={clsx('responsive-section-card rounded-2xl border border-[#e5e5ea] bg-[#fbfbfd] p-5 shadow-[0_8px_22px_rgba(15,23,42,0.04)]', className)}>
      <header className="responsive-section-header mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#3a3a3c]">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-[#6e6e73]">{subtitle}</p> : null}
        </div>
        {actions ? <div className="responsive-section-actions">{actions}</div> : null}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
};
