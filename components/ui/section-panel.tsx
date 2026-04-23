import type { ReactNode } from "react";

type SectionPanelProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionPanel({
  title,
  description,
  action,
  children,
  className = "",
}: SectionPanelProps) {
  return (
    <section className={`panel-card rounded-[4px] ${className}`}>
      <div className="flex flex-col gap-4 border-b border-border px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-text-primary">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}
