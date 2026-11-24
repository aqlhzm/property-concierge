"use client";

import { Check, Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { saveLead, type ActionResult } from "@/app/admin/actions";
import { PRIORITIES, STATUSES, toLocalInput, TZ } from "@/lib/crm";

const initial: ActionResult = { ok: false };

/** Date + time in Malaysia time, `days` from now, as a datetime-local value. */
function mytAt(days: number, hour: number) {
  const ymd = new Date(Date.now() + days * 86_400_000).toLocaleDateString("en-CA", { timeZone: TZ });
  return `${ymd}T${String(hour).padStart(2, "0")}:00`;
}

function nextMondayAt(hour: number) {
  const weekday = new Date(new Date().toLocaleString("en-US", { timeZone: TZ })).getDay(); // 0 = Sunday
  const days = ((8 - weekday) % 7) || 7;
  return mytAt(days, hour);
}

const QUICK = [
  { label: "Tomorrow 10am", value: () => mytAt(1, 10) },
  { label: "In 3 days", value: () => mytAt(3, 10) },
  { label: "Next Monday", value: () => nextMondayAt(10) },
  { label: "In 2 weeks", value: () => mytAt(14, 10) },
];

type Props = {
  leadId: string;
  status: string;
  priority: string | null;
  nextAction: string | null;
  nextFollowUpAt: string | null;
};

export function LeadEditor({ leadId, status, priority, nextAction, nextFollowUpAt }: Props) {
  const [state, action, pending] = useActionState(saveLead, initial);
  const [followUp, setFollowUp] = useState(toLocalInput(nextFollowUpAt));

  return (
    <form action={action} className="card p-5 sm:p-6">
      <input type="hidden" name="leadId" value={leadId} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-status" className="text-[14px] text-muted">
            Status
          </label>
          <select id="lead-status" name="status" defaultValue={status} className="field mt-1.5 cursor-pointer">
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="text-[14px] text-muted">Priority</legend>
          <div className="mt-1.5 grid grid-cols-4 gap-1 rounded-full border border-line p-1">
            {[{ key: "", label: "None" }, ...PRIORITIES].map((p) => (
              <label key={p.key || "none"} className="relative">
                <input
                  type="radio"
                  name="priority"
                  value={p.key}
                  defaultChecked={(priority ?? "") === p.key}
                  className="peer sr-only"
                />
                <span className="flex min-h-10 cursor-pointer items-center justify-center rounded-full text-[14px] text-muted transition-colors peer-checked:bg-white/15 peer-checked:text-text peer-focus-visible:ring-2 peer-focus-visible:ring-white/60">
                  {p.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-5">
        <label htmlFor="lead-next" className="text-[14px] text-muted">
          Next action
        </label>
        <input
          id="lead-next"
          name="nextAction"
          defaultValue={nextAction ?? ""}
          maxLength={200}
          placeholder="e.g. Send Norton Garden price list"
          className="field mt-1.5"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="lead-follow" className="text-[14px] text-muted">
          Follow up on <span className="text-subtle">(Malaysia time)</span>
        </label>
        <input
          id="lead-follow"
          name="followUp"
          type="datetime-local"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          className="field mt-1.5"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => setFollowUp(q.value())}
              className="min-h-9 rounded-full border border-line px-3 text-[13px] text-muted transition-colors hover:border-line-strong hover:text-text"
            >
              {q.label}
            </button>
          ))}
          {followUp && (
            <button
              type="button"
              onClick={() => setFollowUp("")}
              className="min-h-9 rounded-full px-3 text-[13px] text-subtle underline-offset-4 hover:text-text hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {pending ? "Saving" : "Save changes"}
        </button>
        <p aria-live="polite" className="text-[14px]">
          {state.ok && state.savedAt && (
            <span key={state.savedAt} className="saved-flash inline-flex items-center gap-1.5 text-emerald-text">
              <Check aria-hidden size={16} /> Saved
            </span>
          )}
          {!state.ok && state.error && <span className="text-danger">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
