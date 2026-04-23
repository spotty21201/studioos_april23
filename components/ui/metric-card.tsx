import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  supportingText: string;
  icon: LucideIcon;
  tone?: "default" | "accent" | "warning" | "critical";
  footer?: ReactNode;
};

const toneClassMap = {
  default: "surface-card",
  accent: "border border-black bg-black text-white shadow-[8px_8px_0_0_rgba(0,0,0,0.05)]",
  warning: "border border-border bg-warning-soft shadow-none",
  critical: "border border-border bg-critical-soft shadow-none",
};

export function MetricCard({
  label,
  value,
  supportingText,
  icon: Icon,
  tone = "default",
  footer,
}: MetricCardProps) {
  const isDefault = tone === "default";
  const isAccent = tone === "accent";

  return (
    <section className={`${toneClassMap[tone]} animate-enter rounded-[4px] p-6`}>
      <div className="mb-8 flex items-start justify-between gap-3">
        <div className={isDefault ? "eyebrow" : "eyebrow text-white/70"}>
          {label}
        </div>
        <div
          className={`rounded-[2px] border p-2.5 ${
            isDefault
              ? "border-border bg-white text-text-secondary"
              : isAccent
                ? "border-white bg-black text-white"
                : "border-border-muted bg-white text-text-secondary"
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.9} />
        </div>
      </div>
      <div
        className={`text-[2rem] font-semibold tracking-[-0.04em] ${
          isDefault ? "text-text-primary" : isAccent ? "text-white" : "text-text-primary"
        }`}
      >
        {value}
      </div>
      <p
        className={`mt-2 text-sm ${
          isDefault ? "text-text-secondary" : isAccent ? "text-white/80" : "text-text-secondary"
        }`}
      >
        {supportingText}
      </p>
      {footer ? <div className="mt-5">{footer}</div> : null}
    </section>
  );
}
