"use client";

import { Loader2, Mail } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

const initial: LoginState = { step: "email" };

export function AdminLoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, notice ? { step: "email", error: notice } : initial);
  const codeRef = useRef<HTMLInputElement>(null);
  const onCode = state.step === "code";

  useEffect(() => {
    if (onCode && state.error) codeRef.current?.focus();
  }, [onCode, state]);

  return (
    <form action={action} className="card mt-8 p-6 sm:p-8" noValidate>
      <input type="hidden" name="next" value={next} />

      {!onCode ? (
        <>
          <label htmlFor="admin-email" className="text-[14px] text-muted">
            Work email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            defaultValue={state.email}
            className="field mt-1.5"
            required
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "admin-login-error" : undefined}
          />
          <button type="submit" name="intent" value="send" className="btn btn-primary mt-6 w-full" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {pending ? "Sending" : "Email me a sign-in link"}
          </button>
        </>
      ) : (
        <>
          <input type="hidden" name="email" value={state.email} />
          <div className="flex items-start gap-3 rounded-2xl border border-line p-4">
            <Mail className="mt-0.5 size-5 shrink-0 text-emerald" aria-hidden />
            <div className="text-[14px] text-muted" aria-live="polite">
              <p>
                If <span className="text-white">{state.email}</span> has access, a sign-in email is on its way. It can
                take a minute to arrive.
              </p>
              <p className="mt-2">
                Open the link <span className="text-white">on this device, in this browser</span>. This page can stay open.
              </p>
            </div>
          </div>
          <details className="group mt-6" open={Boolean(state.error)}>
            <summary className="cursor-pointer text-[14px] text-muted underline-offset-4 hover:text-white hover:underline">
              The email shows a code instead
            </summary>
            <label htmlFor="admin-code" className="mt-4 block text-[14px] text-muted">
              Code from the email
            </label>
            <input
              ref={codeRef}
              id="admin-code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={10}
              className="field mt-1.5 text-center font-mono text-[22px] tracking-[0.35em]"
              aria-invalid={state.error ? true : undefined}
              aria-describedby={state.error ? "admin-login-error" : undefined}
            />
            <button type="submit" name="intent" value="verify" className="btn btn-primary mt-4 w-full" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              {pending ? "Checking" : "Sign in with code"}
            </button>
          </details>
          <div className="mt-4 flex items-center justify-between text-[14px]">
            <button type="submit" name="intent" value="send" className="text-muted underline-offset-4 hover:text-white hover:underline" disabled={pending}>
              Send again
            </button>
            <a href="/admin/login" className="text-muted underline-offset-4 hover:text-white hover:underline">
              Use another email
            </a>
          </div>
        </>
      )}

      {state.error && (
        <p id="admin-login-error" role="alert" className="mt-4 text-[14px] text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
