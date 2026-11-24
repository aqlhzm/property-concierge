import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LeadFilters } from "@/components/admin/lead-filters";
import { EmptyState, PriorityBadge, StatusBadge } from "@/components/admin/ui";
import { INTENTS } from "@/lib/enquiry-schema";
import { currentTime, formatDateTime, relativeTime, STATUSES, type Lead } from "@/lib/crm";
import { allProjects, projectTitle } from "@/lib/data";
import { requireStaff } from "@/lib/supabase-auth";

export const metadata: Metadata = { title: "Leads" };

type ListLead = Pick<
  Lead,
  | "id"
  | "lead_code"
  | "created_at"
  | "full_name"
  | "phone"
  | "intent"
  | "project_name"
  | "unit_type_name"
  | "status"
  | "priority"
  | "next_action"
  | "next_follow_up_at"
  | "archived_at"
>;

const LIST_COLUMNS =
  "id, lead_code, created_at, full_name, phone, intent, project_name, unit_type_name, status, priority, next_action, next_follow_up_at, archived_at";
const PRIORITY_ORDER: Record<string, number> = { hot: 0, warm: 1, cold: 2 };
const LIMIT = 300;

export default function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const projects = allProjects.map((p) => ({ value: p.slug, label: projectTitle(p) }));
  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-32 sm:px-8">
      <p className="eyebrow">Staff</p>
      <h1 className="mt-2 font-display text-[40px] leading-tight">Leads</h1>
      <div className="mt-6">
        <Suspense fallback={<div className="h-[116px]" />}>
          <LeadFilters projects={projects} intents={[...INTENTS]} />
        </Suspense>
      </div>
      <Suspense fallback={<div className="card mt-6 h-[420px] animate-pulse" />}>
        <LeadResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

async function LeadResults({ searchParams }: { searchParams: PageProps<"/admin/leads">["searchParams"] }) {
  const [{ supabase }, sp] = await Promise.all([requireStaff(), searchParams]);
  const status = one(sp.status);
  const priority = one(sp.priority);
  const project = one(sp.project);
  const intent = one(sp.intent);
  const sort = one(sp.sort);
  const archived = one(sp.view) === "archived";
  // Characters that would break the PostgREST "or" filter are removed.
  const q = one(sp.q).replace(/[,()*%"\\]/g, " ").trim().slice(0, 80);

  let query = supabase.from("leads").select(LIST_COLUMNS, { count: "exact" });
  query = archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  if (STATUSES.some((s) => s.key === status)) query = query.eq("status", status);
  if (["hot", "warm", "cold"].includes(priority)) query = query.eq("priority", priority);
  if (allProjects.some((p) => p.slug === project)) query = query.eq("project_slug", project);
  if ((INTENTS as readonly string[]).includes(intent)) query = query.eq("intent", intent);
  if (q) {
    const digits = q.replace(/\D/g, "");
    const parts = [`full_name.ilike.*${q}*`, `lead_code.ilike.*${q}*`];
    if (digits.length >= 3) {
      parts.push(`phone.ilike.*${digits}*`);
      if (digits.startsWith("0")) parts.push(`phone.ilike.*${digits.slice(1)}*`);
    }
    query = query.or(parts.join(","));
  }
  query = query.order("created_at", { ascending: sort === "oldest" }).limit(LIMIT);

  // Counts per status for the chips (same scope, without the status filter).
  let countQuery = supabase.from("leads").select("status");
  countQuery = archived ? countQuery.not("archived_at", "is", null) : countQuery.is("archived_at", null);

  const [{ data, count, error }, { data: statusRows }] = await Promise.all([query, countQuery]);
  if (error) {
    return (
      <div className="mt-6">
        <EmptyState title="Leads could not be loaded">Refresh the page to try again.</EmptyState>
      </div>
    );
  }

  const leads = (data ?? []) as ListLead[];
  if (sort === "follow_up") {
    leads.sort((a, b) => (a.next_follow_up_at ?? "9999").localeCompare(b.next_follow_up_at ?? "9999"));
  } else if (sort === "priority") {
    leads.sort((a, b) => (PRIORITY_ORDER[a.priority ?? ""] ?? 3) - (PRIORITY_ORDER[b.priority ?? ""] ?? 3));
  }

  const counts = new Map<string, number>();
  for (const r of (statusRows ?? []) as { status: string }[]) counts.set(r.status, (counts.get(r.status) ?? 0) + 1);
  const totalInScope = statusRows?.length ?? 0;

  const hrefWith = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      const val = one(v);
      if (val) next.set(k, val);
    }
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    return `/admin/leads${next.size ? `?${next}` : ""}`;
  };

  const now = currentTime();
  const chips = [{ key: "", label: archived ? "All archived" : "All active", n: totalInScope }].concat(
    STATUSES.filter((s) => counts.get(s.key)).map((s) => ({ key: s.key, label: s.label, n: counts.get(s.key) ?? 0 })),
  );

  return (
    <>
      <nav aria-label="Filter by status" className="-mx-5 mt-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-2 pb-1">
          {chips.map((c) => {
            const active = status === c.key || (!c.key && !STATUSES.some((s) => s.key === status));
            return (
              <li key={c.key || "all"}>
                <Link
                  href={hrefWith({ status: c.key || null })}
                  scroll={false}
                  aria-current={active ? "true" : undefined}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors ${
                    active ? "border-transparent bg-white/15 text-text" : "border-line text-muted hover:text-text"
                  }`}
                >
                  {c.label}
                  <span className="tabular-nums text-subtle">{c.n}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-4 flex items-center justify-between text-[14px] text-muted">
        <p aria-live="polite">
          {count ?? leads.length} {count === 1 ? "lead" : "leads"}
          {count && count > LIMIT ? `, showing the first ${LIMIT}` : ""}
        </p>
        <Link href={hrefWith({ view: archived ? null : "archived", status: null })} className="underline-offset-4 hover:text-text hover:underline">
          {archived ? "Back to active leads" : "View archived"}
        </Link>
      </div>

      {leads.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={q || status || priority || project || intent ? "No leads match these filters" : archived ? "Nothing archived" : "No leads yet"}>
            {!q && !status && !archived && "New enquiries from the website appear here the moment they are sent."}
          </EmptyState>
        </div>
      ) : (
        <>
          {/* Phones: cards */}
          <ul className="mt-4 space-y-3 md:hidden">
            {leads.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.lead_code}`} className="card card-press block p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate text-[17px] font-medium">{l.full_name}</p>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="mt-1 truncate text-[14px] text-muted">
                    {l.intent}
                    {l.project_name ? ` · ${l.project_name}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
                    <PriorityBadge priority={l.priority} />
                    <FollowUp at={l.next_follow_up_at} now={now} />
                    <span className="ml-auto text-subtle">{relativeTime(l.created_at, now)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="card mt-4 hidden overflow-hidden md:block">
            <table className="w-full text-left text-[14px]">
              <thead className="border-b border-line text-[12px] tracking-[0.08em] text-subtle uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Lead</th>
                  <th scope="col" className="px-3 py-3 font-medium">Status</th>
                  <th scope="col" className="px-3 py-3 font-medium">Interest</th>
                  <th scope="col" className="px-3 py-3 font-medium">Follow-up</th>
                  <th scope="col" className="px-3 py-3 font-medium">Received</th>
                  <th scope="col" className="w-10 px-3 py-3"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="group relative border-b border-line/60 last:border-0 hover:bg-white/[0.03]">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/leads/${l.lead_code}`} className="font-medium after:absolute after:inset-0">
                        {l.full_name}
                      </Link>
                      <p className="mt-0.5 font-mono text-[12px] text-subtle">{l.lead_code}</p>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        <StatusBadge status={l.status} />
                        <PriorityBadge priority={l.priority} />
                      </div>
                    </td>
                    <td className="max-w-[240px] px-3 py-3.5">
                      <p className="truncate">{l.intent}</p>
                      <p className="truncate text-[13px] text-muted">{l.project_name ?? "No development chosen"}</p>
                    </td>
                    <td className="px-3 py-3.5">
                      <FollowUp at={l.next_follow_up_at} now={now} />
                      {l.next_action && <p className="mt-0.5 max-w-[220px] truncate text-[13px] text-muted">{l.next_action}</p>}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-muted" title={formatDateTime(l.created_at)}>
                      {relativeTime(l.created_at, now)}
                    </td>
                    <td className="px-3 py-3.5 text-subtle">
                      <ChevronRight aria-hidden size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

function FollowUp({ at, now }: { at: string | null; now: number }) {
  if (!at) return <span className="text-[13px] text-subtle">No follow-up</span>;
  const overdue = new Date(at).getTime() < now;
  return (
    <span className={`text-[13px] ${overdue ? "text-danger" : "text-text"}`} title={formatDateTime(at)}>
      {overdue ? `Overdue ${relativeTime(at, now).replace(" ago", "")}` : `Follow up ${formatDateTime(at)}`}
    </span>
  );
}
