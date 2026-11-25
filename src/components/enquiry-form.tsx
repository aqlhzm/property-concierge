"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useId, useState } from "react";
import { submitEnquiry } from "@/app/enquire/actions";
import type { Project, UnitType } from "@/data/types";
import { lp } from "@/i18n/config";
import { useLang, useT } from "@/i18n/client";
import { siteText } from "@/lib/data";
import { DESIRE, ELIGIBILITY, INTENT_FROM_PARAM, INTENTS, READINESS, VIEWING_TIMES, type EnquiryState } from "@/lib/enquiry-schema";
import { WhatsAppIcon } from "./whatsapp";

const initial: EnquiryState = { status: "idle" };

function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (props: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => React.ReactNode;
}) {
  const id = useId();
  const t = useT().form;
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="text-[14px] text-muted">
        {label} {required ? <span className="text-danger">*</span> : <span className="text-subtle">{t.optional}</span>}
      </label>
      <div className="mt-1.5">{children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}</div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[13px] text-danger" data-field={name}>
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm({ projects, units }: { projects: Project[]; units: UnitType[] }) {
  const params = useSearchParams();
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const lang = useLang();
  const t = useT().form;
  const opt = (v: string) => t.options[v] ?? v;

  const initialProject = projects.find((p) => p.slug === params.get("project"))?.slug ?? "";
  const initialIntent = INTENT_FROM_PARAM[params.get("intent") ?? ""] ?? "General enquiry";
  const [projectSlug, setProjectSlug] = useState(initialProject);
  const [intent, setIntent] = useState<string>(initialIntent);
  const projectUnits = units.filter((u) => u.projectSlug === projectSlug);
  const initialUnit = projectUnits.find((u) => u.id === params.get("unit"))?.id ?? "";

  // Homes sent from the shortlist page (?shortlist=ap-a1,airria-plus)
  const shortlist = (params.get("shortlist") ?? "")
    .split(",")
    .filter((id, i, all) => id && all.indexOf(id) === i)
    .map((id) => {
      const u = units.find((x) => x.id === id);
      if (u) return { id, label: `${projects.find((p) => p.slug === u.projectSlug)?.name ?? ""} ${u.name}`.trim() };
      const p = projects.find((x) => x.slug === id);
      return p ? { id, label: `${p.name} ${p.productName}` } : null;
    })
    .filter((x): x is { id: string; label: string } => x !== null)
    .slice(0, 12);

  const errs = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const today = new Date().toISOString().slice(0, 10);

  if (state.status === "success") {
    return (
      <div className="card p-8 text-center sm:p-12" role="status">
        <CheckCircle2 aria-hidden size={44} className="mx-auto text-emerald-text" />
        <h2 className="mt-4 font-display text-[26px] sm:text-[32px]">{t.thanksTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
          {t.reference} <span className="font-medium text-text tabular">{state.leadCode}</span>. {t.urgent}
        </p>
        <a href={state.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
          <WhatsAppIcon size={18} /> {t.continueWa}
        </a>
      </div>
    );
  }

  return (
    <form
      // Submit manually so React doesn't reset the fields after the action, so a buyer who hits a
      // validation error keeps everything they typed.
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="card grid gap-5 p-5 sm:p-8"
      noValidate
    >
      {state.status === "error" && (
        <div role="alert" className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-[14px]">
          <p>{state.message}</p>
          {state.whatsappUrl && (
            <a href={state.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-3 !min-h-10">
              <WhatsAppIcon size={16} /> {t.messageWa}
            </a>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.fullName} name="fullName" required error={errs.fullName}>
          {(p) => <input {...p} name="fullName" autoComplete="name" className="field" required maxLength={100} />}
        </Field>
        <Field label={t.phone} name="phone" required error={errs.phone} hint={t.phoneHint}>
          {(p) => <input {...p} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="012 345 6789" className="field" required />}
        </Field>
        <Field label={t.email} name="email" error={errs.email}>
          {(p) => <input {...p} name="email" type="email" autoComplete="email" className="field" />}
        </Field>
        <Field label={t.preferredContact} name="preferredContact" required>
          {(p) => (
            <select {...p} name="preferredContact" className="field cursor-pointer" defaultValue="WhatsApp">
              {(["WhatsApp", "Call", "Email"] as const).map((c) => (
                <option key={c} value={c}>
                  {t.contacts[c]}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.help} name="intent" required error={errs.intent}>
          {(p) => (
            <select {...p} name="intent" className="field cursor-pointer" value={intent} onChange={(e) => setIntent(e.target.value)}>
              {INTENTS.map((i) => (
                <option key={i} value={i}>
                  {opt(i)}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={t.development} name="projectSlug">
          {(p) => (
            <select {...p} name="projectSlug" className="field cursor-pointer" value={projectSlug} onChange={(e) => setProjectSlug(e.target.value)}>
              <option value="">{t.notSure}</option>
              {projects.map((pr) => (
                <option key={pr.slug} value={pr.slug}>
                  {pr.name} {pr.productName}
                </option>
              ))}
            </select>
          )}
        </Field>
        {projectUnits.length > 0 && (
          <Field label={t.unitType} name="unitId">
            {(p) => (
              <select {...p} name="unitId" className="field cursor-pointer" defaultValue={initialUnit} key={projectSlug}>
                <option value="">{t.anyType}</option>
                {projectUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}
          </Field>
        )}
      </div>

      {intent === "Viewing request" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.date} name="preferredViewingDate" error={errs.preferredViewingDate}>
            {(p) => <input {...p} name="preferredViewingDate" type="date" min={today} className="field" />}
          </Field>
          <Field label={t.time} name="preferredViewingTime">
            {(p) => (
              <select {...p} name="preferredViewingTime" className="field cursor-pointer" defaultValue="">
                <option value="">{t.anyTime}</option>
                {VIEWING_TIMES.map((v, i) => (
                  <option key={v} value={v}>
                    {t.times[i]}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
      )}

      <Field label={t.message} name="message" error={errs.message}>
        {(p) => <textarea {...p} name="message" rows={4} maxLength={1000} className="field resize-y" placeholder={t.messagePlaceholder} />}
      </Field>

      <details className="rounded-2xl border border-line bg-surface-2/50 p-4 sm:p-5">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[15px] font-medium">
          {t.prepare}
          <span aria-hidden className="text-emerald-text">
            +
          </span>
        </summary>
        <p className="mt-1 text-[13px] text-subtle">{t.prepareNote}</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label={t.purpose} name="dreamDesire">
            {(p) => (
              <select {...p} name="dreamDesire" className="field cursor-pointer" defaultValue="">
                <option value="">{t.select}</option>
                {DESIRE.map((o) => (
                  <option key={o} value={o}>
                    {opt(o)}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label={t.when} name="dreamReadiness">
            {(p) => (
              <select {...p} name="dreamReadiness" className="field cursor-pointer" defaultValue="">
                <option value="">{t.select}</option>
                {READINESS.map((o) => (
                  <option key={o} value={o}>
                    {opt(o)}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label={t.financing} name="dreamEligibility">
            {(p) => (
              <select {...p} name="dreamEligibility" className="field cursor-pointer" defaultValue="">
                <option value="">{t.select}</option>
                {ELIGIBILITY.map((o) => (
                  <option key={o} value={o}>
                    {opt(o)}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label={t.budget} name="dreamAffordability">
            {(p) => <input {...p} name="dreamAffordability" className="field" placeholder={t.budgetPlaceholder} maxLength={120} />}
          </Field>
          <div className="sm:col-span-2">
            <Field label={t.matters} name="dreamMatch">
              {(p) => <input {...p} name="dreamMatch" className="field" placeholder={t.mattersPlaceholder} maxLength={200} />}
            </Field>
          </div>
        </div>
      </details>

      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {shortlist.length > 0 && (
        <div className="rounded-2xl border border-line bg-black/20 p-4">
          <p className="text-[13px] text-muted">{t.shortlistGoes}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {shortlist.map((s) => (
              <li key={s.id} className="rounded-full bg-sage-deep/70 px-2.5 py-1 text-[13px] text-sage-text">
                {s.label}
              </li>
            ))}
          </ul>
          <input type="hidden" name="shortlist" value={shortlist.map((s) => s.id).join(",")} />
        </div>
      )}
      <input
        type="hidden"
        name="ctaSource"
        value={shortlist.length ? "shortlist" : `enquire${params.get("intent") ? `:${params.get("intent")}` : ""}`}
      />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="utmSource" value={params.get("utm_source") ?? ""} />
      <input type="hidden" name="utmMedium" value={params.get("utm_medium") ?? ""} />
      <input type="hidden" name="utmCampaign" value={params.get("utm_campaign") ?? ""} />

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[14px]">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--emerald)]"
            aria-invalid={errs.consent ? true : undefined}
            aria-describedby={errs.consent ? "consent-err" : undefined}
          />
          <span>
            {siteText(lang).consentText}{" "}
            <a href={lp(lang, "/privacy")} className="text-emerald-text underline underline-offset-2">
              {t.privacy}
            </a>
          </span>
        </label>
        {errs.consent && (
          <p id="consent-err" className="mt-1.5 text-[13px] text-danger">
            {errs.consent}
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary !min-h-12 w-full disabled:opacity-70 sm:w-auto sm:justify-self-start">
        {pending ? (
          <>
            <Loader2 aria-hidden size={18} className="animate-spin" /> {t.sending}
          </>
        ) : (
          t.send
        )}
      </button>
    </form>
  );
}
