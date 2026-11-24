import { Flame, Snowflake, Sun } from "lucide-react";
import Link from "next/link";
import { priorityLabel, statusLabel, statusTone } from "@/lib/crm";

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge tone-${statusTone(status)}`}>{statusLabel(status)}</span>;
}

const PRIORITY_STYLE = {
  hot: { tone: "tone-danger", Icon: Flame },
  warm: { tone: "tone-gold", Icon: Sun },
  cold: { tone: "tone-muted", Icon: Snowflake },
} as const;

export function PriorityBadge({ priority }: { priority: string | null }) {
  if (!priority || !(priority in PRIORITY_STYLE)) return null;
  const { tone, Icon } = PRIORITY_STYLE[priority as keyof typeof PRIORITY_STYLE];
  return (
    <span className={`badge ${tone}`}>
      <Icon aria-hidden size={12} />
      {priorityLabel(priority)}
    </span>
  );
}

export function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-[13px] font-semibold tracking-[0.14em] text-muted uppercase">{children}</h2>
      {aside}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-dashed border-line p-8 text-center">
      <p className="text-[16px]">{title}</p>
      {children && <div className="mt-2 text-[14px] text-muted">{children}</div>}
    </div>
  );
}

/** Horizontal bar list for small breakdowns (no chart library needed). */
export function BarList({ rows, total }: { rows: { label: string; value: number; href?: string }[]; total: number }) {
  if (!rows.length) return <p className="text-[14px] text-subtle">Nothing yet.</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => {
        const pct = total ? Math.max(4, Math.round((r.value / total) * 100)) : 0;
        const inner = (
          <>
            <div className="flex items-baseline justify-between gap-3 text-[14px]">
              <span className="truncate">{r.label}</span>
              <span className="tabular-nums text-muted">{r.value}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-emerald" style={{ width: `${pct}%` }} />
            </div>
          </>
        );
        return (
          <li key={r.label}>
            {r.href ? (
              <Link href={r.href} className="block rounded-lg py-1 transition-opacity hover:opacity-80">
                {inner}
              </Link>
            ) : (
              <div className="py-1">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
