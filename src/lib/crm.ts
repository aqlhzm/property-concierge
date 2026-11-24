/** Shared CRM vocabulary and formatting for the staff area. Safe for server and client. */

export const STATUSES = [
  { key: "new", label: "New", tone: "emerald" },
  { key: "contacted", label: "Contacted", tone: "sage" },
  { key: "consultation_booked", label: "Consultation booked", tone: "sage" },
  { key: "viewing_booked", label: "Viewing booked", tone: "sage" },
  { key: "viewed", label: "Viewed", tone: "sage" },
  { key: "booking", label: "Booking", tone: "gold" },
  { key: "spa", label: "SPA", tone: "gold" },
  { key: "purchased", label: "Purchased", tone: "gold" },
  { key: "on_hold", label: "On hold", tone: "muted" },
  { key: "not_proceeding", label: "Not proceeding", tone: "muted" },
] as const;

export type StatusKey = (typeof STATUSES)[number]["key"];
export const STATUS_KEYS = STATUSES.map((s) => s.key) as [StatusKey, ...StatusKey[]];
export const statusLabel = (key: string | null) => STATUSES.find((s) => s.key === key)?.label ?? "Unknown";
export const statusTone = (key: string | null) => STATUSES.find((s) => s.key === key)?.tone ?? "muted";

export const PRIORITIES = [
  { key: "hot", label: "Hot" },
  { key: "warm", label: "Warm" },
  { key: "cold", label: "Cold" },
] as const;
export type PriorityKey = (typeof PRIORITIES)[number]["key"];
export const PRIORITY_KEYS = PRIORITIES.map((p) => p.key) as [PriorityKey, ...PriorityKey[]];
export const priorityLabel = (key: string | null) => PRIORITIES.find((p) => p.key === key)?.label ?? "No priority";

/** Timeline entries staff can add by hand. Contact types also stamp "last contacted". */
export const LOG_TYPES = [
  { key: "note", label: "Note" },
  { key: "call", label: "Call" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "Email" },
  { key: "meeting", label: "Meeting" },
  { key: "viewing", label: "Viewing" },
] as const;
export type LogTypeKey = (typeof LOG_TYPES)[number]["key"];
export const LOG_TYPE_KEYS = LOG_TYPES.map((t) => t.key) as [LogTypeKey, ...LogTypeKey[]];

export type Lead = {
  id: string;
  lead_code: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string | null;
  preferred_contact: string | null;
  intent: string;
  project_slug: string | null;
  project_name: string | null;
  unit_type_id: string | null;
  unit_type_name: string | null;
  preferred_viewing_date: string | null;
  preferred_viewing_time: string | null;
  message: string | null;
  dream_desire: string | null;
  dream_readiness: string | null;
  dream_eligibility: string | null;
  dream_affordability: string | null;
  dream_match: string | null;
  consent_version: string | null;
  consent_timestamp: string | null;
  cta_source: string | null;
  source_channel: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: StatusKey;
  journey_stage: string | null;
  priority: PriorityKey | null;
  next_action: string | null;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
  updated_at: string;
  archived_at: string | null;
  shortlist: string[] | null;
};

export type Activity = {
  id: number;
  created_at: string;
  type: string;
  body: string | null;
  meta: Record<string, unknown>;
  staff: { full_name: string } | null;
};

/* ------------------------------------------------------------------ */
/* Time, always shown in Malaysia time                                 */
/* ------------------------------------------------------------------ */

export const TZ = "Asia/Kuala_Lumpur";

/** Request time for server components (each staff page renders per request). */
export const currentTime = () => Date.now();
const MYT_OFFSET = "+08:00";

export function formatDateTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-MY", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  });
}

export function formatDay(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-MY", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });
}

/** "5m ago", "3h ago", "2d ago", "in 4h", "in 3d". */
export function relativeTime(iso: string | null, now = Date.now()) {
  if (!iso) return "";
  const diff = new Date(iso).getTime() - now;
  const abs = Math.abs(diff);
  const m = Math.round(abs / 60_000);
  const text =
    m < 1 ? "just now" : m < 60 ? `${m}m` : m < 60 * 24 ? `${Math.round(m / 60)}h` : `${Math.round(m / (60 * 24))}d`;
  if (text === "just now") return text;
  return diff < 0 ? `${text} ago` : `in ${text}`;
}

/** Start of tomorrow in Malaysia time, as an ISO string. Anything before it is "due today". */
export function endOfTodayMYT(now = new Date()) {
  const ymd = now.toLocaleDateString("en-CA", { timeZone: TZ });
  const start = new Date(`${ymd}T00:00:00${MYT_OFFSET}`);
  return new Date(start.getTime() + 24 * 3600_000).toISOString();
}

/** Start of the current week (Monday) in Malaysia time. */
export function startOfWeekMYT(now = new Date()) {
  const ymd = now.toLocaleDateString("en-CA", { timeZone: TZ });
  const start = new Date(`${ymd}T00:00:00${MYT_OFFSET}`);
  const weekday = new Date(`${ymd}T12:00:00${MYT_OFFSET}`).getUTCDay(); // 0 = Sunday
  const back = (weekday + 6) % 7;
  return new Date(start.getTime() - back * 24 * 3600_000).toISOString();
}

/** Value for <input type="datetime-local"> in Malaysia time. */
export function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-CA", { timeZone: TZ });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TZ });
  return `${date}T${time}`;
}

/** Parse a datetime-local value typed in Malaysia time. */
export function fromLocalInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(`${value}:00${MYT_OFFSET}`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/* ------------------------------------------------------------------ */
/* Contact links                                                       */
/* ------------------------------------------------------------------ */

/** Malaysian numbers as stored by the form (012..., +6012..., 6012...) to international digits. */
export function phoneDigits(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("60")) return d;
  if (d.startsWith("0")) return `6${d}`;
  return d;
}

export function leadWhatsAppHref(lead: Pick<Lead, "full_name" | "phone" | "project_name" | "intent">, staffFirstName: string) {
  const first = lead.full_name.trim().split(/\s+/)[0] ?? "";
  const about = lead.project_name ? `your enquiry about ${lead.project_name}` : "your enquiry";
  const text = `Hi ${first}, this is ${staffFirstName} from Property Concierge. Thank you for ${about}. Is now a good time to chat?`;
  return `https://wa.me/${phoneDigits(lead.phone)}?text=${encodeURIComponent(text)}`;
}

export function leadTelHref(phone: string) {
  return `tel:+${phoneDigits(phone)}`;
}

/** Plain-language line for an automatic timeline entry. */
export function describeActivity(a: Pick<Activity, "type" | "meta">) {
  const m = a.meta ?? {};
  switch (a.type) {
    case "created":
      return `Enquiry received${m.intent ? `: ${String(m.intent)}` : ""}`;
    case "status_change":
      return `Status: ${statusLabel(m.from as string)} → ${statusLabel(m.to as string)}`;
    case "priority_change":
      return m.to ? `Priority set to ${priorityLabel(m.to as string)}` : "Priority cleared";
    case "follow_up_set": {
      const at = m.at ? formatDateTime(m.at as string) : null;
      const action = m.action ? String(m.action) : null;
      if (!at && !action) return "Follow-up cleared";
      return `Follow-up${at ? ` ${at}` : ""}${action ? `: ${action}` : ""}`;
    }
    case "assigned":
      return "Lead reassigned";
    case "archived":
      return "Archived";
    case "restored":
      return "Restored from archive";
    case "details_changed": {
      const prev = (m.previous ?? {}) as Record<string, unknown>;
      const names: Record<string, string> = { full_name: "name", phone: "phone", email: "email", preferred_contact: "preferred contact" };
      return `Updated ${Object.keys(prev).map((k) => names[k] ?? k).join(", ")}`;
    }
    default:
      return LOG_TYPES.find((t) => t.key === a.type)?.label ?? a.type;
  }
}
