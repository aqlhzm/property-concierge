import { ArrowLeft, Archive, ArchiveRestore, Mail, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { setArchived } from "@/app/admin/actions";
import { LeadEditor } from "@/components/admin/lead-editor";
import { LogForm } from "@/components/admin/log-form";
import { PriorityBadge, SectionTitle, StatusBadge } from "@/components/admin/ui";
import { units } from "@/data/units";
import {
  currentTime,
  describeActivity,
  formatDateTime,
  leadTelHref,
  leadWhatsAppHref,
  LOG_TYPES,
  relativeTime,
  type Activity,
  type Lead,
} from "@/lib/crm";
import { formatDate } from "@/lib/format";
import { requireStaff } from "@/lib/supabase-auth";

export const metadata: Metadata = { title: "Lead" };

const CODE = /^PC-\d{8}-[A-F0-9]{6}$/;

export default function LeadPage({ params }: PageProps<"/admin/leads/[code]">) {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-28 pb-32 sm:px-8">
      <Link href="/admin/leads" className="inline-flex min-h-11 items-center gap-2 text-[14px] text-muted hover:text-text">
        <ArrowLeft aria-hidden size={16} /> All leads
      </Link>
      <Suspense fallback={<div className="card mt-4 h-[520px] animate-pulse" />}>
        <LeadDetail params={params} />
      </Suspense>
    </div>
  );
}

async function LeadDetail({ params }: { params: PageProps<"/admin/leads/[code]">["params"] }) {
  const [{ supabase, staff }, { code: raw }] = await Promise.all([requireStaff(), params]);
  const code = decodeURIComponent(raw).toUpperCase();
  if (!CODE.test(code)) notFound();

  const { data: leadRow } = await supabase.from("leads").select("*").eq("lead_code", code).maybeSingle();
  if (!leadRow) notFound();
  const lead = leadRow as Lead;

  const { data: activityRows } = await supabase
    .from("lead_activities")
    .select("id, created_at, type, body, meta, staff:staff_id(full_name)")
    .eq("lead_id", lead.id)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(200);
  const activities = (activityRows ?? []) as unknown as Activity[];

  const now = currentTime();
  const firstName = staff.fullName.split(" ")[0] ?? staff.fullName;
  const shortlist = (lead.shortlist ?? []).map((id) => units.find((u) => u.id === id)?.name ?? id);
  const source = [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ");

  return (
    <div className="mt-4">
      {lead.archived_at && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-line bg-white/[0.04] px-5 py-3 text-[14px]">
          <span className="text-muted">Archived {formatDateTime(lead.archived_at)}. It no longer shows in Today or the active list.</span>
          <ArchiveButton leadId={lead.id} archived />
        </div>
      )}

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={lead.status} />
          <PriorityBadge priority={lead.priority} />
          {lead.journey_stage && <span className="badge tone-muted">{lead.journey_stage}</span>}
        </div>
        <h1 className="mt-3 font-display text-[36px] leading-tight break-words sm:text-[44px]">{lead.full_name}</h1>
        <p className="mt-1 text-[14px] text-muted">
          <span className="font-mono">{lead.lead_code}</span> · received {relativeTime(lead.created_at, now)} (
          {formatDateTime(lead.created_at)})
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <a href={leadWhatsAppHref(lead, firstName)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <MessageCircle aria-hidden size={18} /> WhatsApp
          </a>
          <a href={leadTelHref(lead.phone)} className="btn btn-ghost">
            <Phone aria-hidden size={18} /> Call
          </a>
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="btn btn-ghost col-span-2 sm:col-span-1">
              <Mail aria-hidden size={18} /> Email
            </a>
          )}
        </div>
        <p className="mt-2 text-[13px] text-subtle">After you reach the buyer, add it to the timeline below so the lead is marked as contacted.</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6 lg:col-start-1">
          <section aria-labelledby="enquiry-h" className="card p-5 sm:p-6">
            <SectionTitle>
              <span id="enquiry-h">Enquiry</span>
            </SectionTitle>
            <dl className="mt-4 grid gap-x-6 gap-y-4 text-[15px] sm:grid-cols-2">
              <Item label="Looking for">{lead.intent}</Item>
              <Item label="Development">{lead.project_name ?? "Not chosen"}</Item>
              {lead.unit_type_name && <Item label="Unit type">{lead.unit_type_name}</Item>}
              {(lead.preferred_viewing_date || lead.preferred_viewing_time) && (
                <Item label="Preferred viewing">
                  {[lead.preferred_viewing_date ? formatDate(lead.preferred_viewing_date) : null, lead.preferred_viewing_time]
                    .filter(Boolean)
                    .join(", ")}
                </Item>
              )}
            </dl>
            {lead.message && (
              <blockquote className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-[15px] whitespace-pre-line break-words">
                {lead.message}
              </blockquote>
            )}
          </section>

          <section aria-labelledby="manage-h">
            <h2 id="manage-h" className="sr-only">
              Manage this lead
            </h2>
            <LeadEditor
              key={lead.updated_at}
              leadId={lead.id}
              status={lead.status}
              priority={lead.priority}
              nextAction={lead.next_action}
              nextFollowUpAt={lead.next_follow_up_at}
            />
          </section>
        </div>

        <aside className="space-y-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <section aria-labelledby="contact-h" className="card p-5 sm:p-6">
            <SectionTitle>
              <span id="contact-h">Contact</span>
            </SectionTitle>
            <dl className="mt-4 space-y-3 text-[15px]">
              <Item label="Phone">
                <a href={leadTelHref(lead.phone)} className="underline-offset-4 hover:underline">
                  {lead.phone}
                </a>
              </Item>
              {lead.email && (
                <Item label="Email">
                  <a href={`mailto:${lead.email}`} className="break-all underline-offset-4 hover:underline">
                    {lead.email}
                  </a>
                </Item>
              )}
              <Item label="Prefers">{lead.preferred_contact ?? "Not stated"}</Item>
              <Item label="Last contacted">
                {lead.last_contacted_at ? `${relativeTime(lead.last_contacted_at, now)}` : "Not yet"}
              </Item>
            </dl>
          </section>

          <section aria-labelledby="dream-h" className="card p-5 sm:p-6">
            <SectionTitle>
              <span id="dream-h">D.R.E.A.M.</span>
            </SectionTitle>
            <dl className="mt-4 space-y-3 text-[15px]">
              <Item label="Desire">{lead.dream_desire ?? "Not answered"}</Item>
              <Item label="Readiness">{lead.dream_readiness ?? "Not answered"}</Item>
              <Item label="Eligibility">{lead.dream_eligibility ?? "Not answered"}</Item>
              <Item label="Affordability">{lead.dream_affordability ?? "Not answered"}</Item>
              <Item label="Match">{lead.dream_match ?? "Not answered"}</Item>
            </dl>
          </section>

          {shortlist.length > 0 && (
            <section aria-labelledby="shortlist-h" className="card p-5 sm:p-6">
              <SectionTitle>
                <span id="shortlist-h">Shortlist</span>
              </SectionTitle>
              <ul className="mt-4 space-y-1.5 text-[15px]">
                {shortlist.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="source-h" className="card p-5 sm:p-6">
            <SectionTitle>
              <span id="source-h">Source and consent</span>
            </SectionTitle>
            <dl className="mt-4 space-y-3 text-[15px]">
              <Item label="Came from">{lead.cta_source ?? lead.source_channel ?? "Website"}</Item>
              {source && <Item label="Campaign">{source}</Item>}
              <Item label="Consent">
                {lead.consent_timestamp ? `Given ${formatDateTime(lead.consent_timestamp)}` : "Given"}
                {lead.consent_version ? ` (notice ${lead.consent_version})` : ""}
              </Item>
            </dl>
          </section>

          {!lead.archived_at && (
            <div className="px-1">
              <ArchiveButton leadId={lead.id} archived={false} />
            </div>
          )}
        </aside>

        <div className="space-y-6 lg:col-start-1">
          <LogForm leadId={lead.id} />

          <section aria-labelledby="timeline-h">
            <SectionTitle aside={<span className="text-[13px] text-subtle">{activities.length} entries</span>}>
              <span id="timeline-h">Timeline</span>
            </SectionTitle>
            <ol className="mt-4 space-y-0">
              {activities.map((a, i) => {
                const manual = LOG_TYPES.some((t) => t.key === a.type);
                return (
                  <li key={a.id} className="relative flex gap-4 pb-5">
                    {i < activities.length - 1 && (
                      <span aria-hidden className="absolute top-3 left-[5px] h-full w-px bg-line" />
                    )}
                    <span
                      aria-hidden
                      className={`relative mt-1.5 size-[11px] shrink-0 rounded-full ${manual ? "bg-emerald" : "border border-line-strong bg-bg"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px]">
                        <span className={manual ? "font-medium" : "text-muted"}>{describeActivity(a)}</span>
                      </p>
                      {a.body && <p className="mt-1 text-[15px] whitespace-pre-line break-words">{a.body}</p>}
                      <p className="mt-1 text-[13px] text-subtle">
                        {formatDateTime(a.created_at)} · {a.staff?.full_name ?? (a.type === "created" ? "Website" : "System")}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[13px] text-subtle">{label}</dt>
      <dd className="mt-0.5 break-words">{children}</dd>
    </div>
  );
}

function ArchiveButton({ leadId, archived }: { leadId: string; archived: boolean }) {
  return (
    <form action={setArchived}>
      <input type="hidden" name="leadId" value={leadId} />
      <input type="hidden" name="archive" value={archived ? "0" : "1"} />
      <button type="submit" className="inline-flex min-h-11 items-center gap-2 text-[14px] text-muted underline-offset-4 hover:text-text hover:underline">
        {archived ? <ArchiveRestore aria-hidden size={16} /> : <Archive aria-hidden size={16} />}
        {archived ? "Restore to active" : "Archive this lead"}
      </button>
    </form>
  );
}
