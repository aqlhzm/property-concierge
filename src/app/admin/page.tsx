import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BarList, EmptyState, PriorityBadge, SectionTitle, StatusBadge } from "@/components/admin/ui";
import { endOfTodayMYT, formatDateTime, relativeTime, startOfWeekMYT, STATUSES, TZ, type Lead } from "@/lib/crm";
import { requireStaff } from "@/lib/supabase-auth";

export const metadata: Metadata = { title: "Today" };

type TodayLead = Pick<
  Lead,
  "id" | "lead_code" | "created_at" | "full_name" | "intent" | "project_name" | "status" | "priority" | "next_action" | "next_follow_up_at"
>;
const COLUMNS = "id, lead_code, created_at, full_name, intent, project_name, status, priority, next_action, next_follow_up_at";
const DAY = 86_400_000;

export default function TodayPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-32 sm:px-8">
      <Suspense fallback={<div className="card h-[480px] animate-pulse" />}>
        <Today />
      </Suspense>
    </div>
  );
}

async function Today() {
  const { supabase, staff } = await requireStaff();
  const now = new Date();
  const endOfToday = endOfTodayMYT(now);
  const weekStart = startOfWeekMYT(now);

  const [dueRes, newRes, statusRes, weekRes] = await Promise.all([
    supabase.from("leads").select(COLUMNS).is("archived_at", null).lt("next_follow_up_at", endOfToday).order("next_follow_up_at").limit(100),
    supabase.from("leads").select(COLUMNS).is("archived_at", null).eq("status", "new").order("created_at").limit(100),
    supabase.from("leads").select("status").is("archived_at", null),
    supabase.from("leads").select("project_name, utm_source, cta_source, source_channel").gte("created_at", weekStart),
  ]);

  if (dueRes.error || newRes.error || statusRes.error || weekRes.error) {
    return <EmptyState title="Today could not be loaded">Refresh the page to try again.</EmptyState>;
  }

  // Attention list: one row per lead, with the most urgent reason.
  type Row = { lead: TodayLead; reason: string; urgent: boolean; rank: number; at: number };
  const rows = new Map<string, Row>();
  const t = now.getTime();
  for (const l of (dueRes.data ?? []) as TodayLead[]) {
    const at = new Date(l.next_follow_up_at!).getTime();
    const overdue = at < t;
    rows.set(l.id, {
      lead: l,
      reason: overdue ? `Follow-up overdue ${relativeTime(l.next_follow_up_at, t).replace(" ago", "")}` : `Follow up today, ${formatTime(l.next_follow_up_at!)}`,
      urgent: overdue,
      rank: overdue ? 0 : 2,
      at,
    });
  }
  for (const l of (newRes.data ?? []) as TodayLead[]) {
    if (rows.has(l.id) && rows.get(l.id)!.rank === 0) continue;
    const age = t - new Date(l.created_at).getTime();
    const waiting = age > DAY;
    rows.set(l.id, {
      lead: l,
      reason: waiting ? `Not contacted for ${relativeTime(l.created_at, t).replace(" ago", "")}` : `New enquiry, ${relativeTime(l.created_at, t)}`,
      urgent: waiting,
      rank: waiting ? 1 : 3,
      at: new Date(l.created_at).getTime(),
    });
  }
  const attention = [...rows.values()].sort((a, b) => a.rank - b.rank || a.at - b.at);

  const statusCounts = new Map<string, number>();
  for (const r of (statusRes.data ?? []) as { status: string }[]) statusCounts.set(r.status, (statusCounts.get(r.status) ?? 0) + 1);
  const active = statusRes.data?.length ?? 0;

  const week = (weekRes.data ?? []) as { project_name: string | null; utm_source: string | null; cta_source: string | null; source_channel: string | null }[];
  const tally = (pick: (r: (typeof week)[number]) => string) => {
    const m = new Map<string, number>();
    for (const r of week) m.set(pick(r), (m.get(pick(r)) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));
  };

  const overdueCount = attention.filter((r) => r.rank === 0).length;
  const waitingCount = attention.filter((r) => r.rank === 1).length;
  const tiles = [
    { label: "Need attention now", value: overdueCount + waitingCount, hint: "Overdue follow-ups and new leads waiting over 24h", alert: overdueCount + waitingCount > 0 },
    { label: "New, not contacted", value: statusCounts.get("new") ?? 0, hint: "Status still New" },
    { label: "Active leads", value: active, hint: "Everything not archived" },
    { label: "This week", value: week.length, hint: "Enquiries since Monday" },
  ];

  const hour = Number(now.toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: TZ }));
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = staff.fullName.split(" ")[0];

  return (
    <>
      <p className="eyebrow">{now.toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", timeZone: TZ })}</p>
      <h1 className="mt-2 font-display text-[40px] leading-tight">
        {greeting}, {firstName}
      </h1>

      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((s) => (
          <div key={s.label} className="card p-5">
            <dt className="text-[14px] text-muted">{s.label}</dt>
            <dd className={`mt-2 font-display text-[40px] leading-none tabular-nums ${s.alert ? "text-danger" : ""}`}>{s.value}</dd>
            <p className="mt-2 text-[12px] leading-snug text-subtle">{s.hint}</p>
          </div>
        ))}
      </dl>

      <section aria-labelledby="attention-h" className="mt-10">
        <SectionTitle aside={<Link href="/admin/leads" className="text-[14px] text-muted hover:text-text">All leads</Link>}>
          <span id="attention-h">To do</span>
        </SectionTitle>
        {attention.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="All caught up">No follow-ups due and no new enquiries waiting.</EmptyState>
          </div>
        ) : (
          <ul className="card mt-4 divide-y divide-line/70 overflow-hidden">
            {attention.map(({ lead: l, reason, urgent }) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.lead_code}`} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]">
                  <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${urgent ? "bg-danger" : "bg-emerald"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[16px] font-medium">{l.full_name}</p>
                      <StatusBadge status={l.status} />
                      <PriorityBadge priority={l.priority} />
                    </div>
                    <p className={`mt-1 text-[14px] ${urgent ? "text-danger" : "text-muted"}`}>{reason}</p>
                    <p className="mt-0.5 truncate text-[13px] text-subtle">
                      {l.next_action ?? `${l.intent}${l.project_name ? ` · ${l.project_name}` : ""}`}
                    </p>
                  </div>
                  <ChevronRight aria-hidden size={18} className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="pipeline-h" className="card p-5 sm:p-6">
          <SectionTitle>
            <span id="pipeline-h">Pipeline</span>
          </SectionTitle>
          <div className="mt-4">
            <BarList
              total={active}
              rows={STATUSES.filter((s) => statusCounts.get(s.key)).map((s) => ({
                label: s.label,
                value: statusCounts.get(s.key) ?? 0,
                href: `/admin/leads?status=${s.key}`,
              }))}
            />
          </div>
        </section>
        <section aria-labelledby="dev-h" className="card p-5 sm:p-6">
          <SectionTitle>
            <span id="dev-h">This week by development</span>
          </SectionTitle>
          <div className="mt-4">
            <BarList total={week.length} rows={tally((r) => r.project_name ?? "Not chosen")} />
          </div>
        </section>
        <section aria-labelledby="src-h" className="card p-5 sm:p-6">
          <SectionTitle>
            <span id="src-h">This week by source</span>
          </SectionTitle>
          <div className="mt-4">
            <BarList total={week.length} rows={tally((r) => r.utm_source ?? r.source_channel ?? r.cta_source ?? "Website")} />
          </div>
        </section>
      </div>
      <p className="mt-6 text-[13px] text-subtle">Times are Malaysia time. Last updated {formatDateTime(now.toISOString())}.</p>
    </>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-MY", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ });
}
