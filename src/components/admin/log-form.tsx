"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { addLog, type ActionResult } from "@/app/admin/actions";
import { LOG_TYPES, type LogTypeKey } from "@/lib/crm";

const initial: ActionResult = { ok: false };

const PLACEHOLDER: Record<LogTypeKey, string> = {
  note: "What should the team remember about this buyer?",
  call: "What was discussed? (optional)",
  whatsapp: "What was sent or agreed? (optional)",
  email: "What was sent? (optional)",
  meeting: "Where, and what came out of it? (optional)",
  viewing: "Which show unit, and how did it go? (optional)",
};

export function LogForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState(addLog, initial);
  // A fresh form after each successful add clears the text and the chosen type.
  return <LogFormFields key={state.savedAt ?? 0} leadId={leadId} state={state} action={action} pending={pending} />;
}

function LogFormFields({
  leadId,
  state,
  action,
  pending,
}: {
  leadId: string;
  state: ActionResult;
  action: (formData: FormData) => void;
  pending: boolean;
}) {
  const [type, setType] = useState<LogTypeKey>("note");

  return (
    <form action={action} className="card p-5 sm:p-6">
      <input type="hidden" name="leadId" value={leadId} />
      <fieldset>
        <legend className="text-[14px] text-muted">Add to the timeline</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {LOG_TYPES.map((t) => (
            <label key={t.key}>
              <input
                type="radio"
                name="type"
                value={t.key}
                checked={type === t.key}
                onChange={() => setType(t.key)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-line px-4 text-[14px] text-muted transition-colors peer-checked:border-transparent peer-checked:bg-white/15 peer-checked:text-text peer-focus-visible:ring-2 peer-focus-visible:ring-white/60">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label htmlFor="log-body" className="sr-only">
        Details
      </label>
      <textarea
        id="log-body"
        name="body"
        rows={3}
        maxLength={4000}
        placeholder={PLACEHOLDER[type]}
        className="field mt-4 resize-y"
        aria-invalid={!state.ok && state.error ? true : undefined}
        aria-describedby={!state.ok && state.error ? "log-error" : undefined}
      />
      {type !== "note" && (
        <p className="mt-2 text-[13px] text-subtle">Marks the lead as contacted now. A New lead moves to Contacted.</p>
      )}
      <div className="mt-4 flex items-center gap-4">
        <button type="submit" className="btn btn-ghost" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {pending ? "Adding" : "Add"}
        </button>
        {state.ok && state.savedAt ? (
          <p className="saved-flash text-[14px] text-emerald-text" aria-live="polite">
            Added to the timeline
          </p>
        ) : null}
        {!state.ok && state.error && (
          <p id="log-error" role="alert" className="text-[14px] text-danger">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
