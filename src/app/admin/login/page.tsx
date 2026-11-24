import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin-login-form";
import { safeAdminPath } from "@/lib/auth-cookies";
import { getStaff } from "@/lib/supabase-auth";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <div className="mx-auto max-w-md px-5 pt-36 pb-24 sm:px-8">
      <p className="eyebrow">Property Concierge staff</p>
      <h1 className="mt-2 font-display text-[40px] leading-tight">Sign in</h1>
      <p className="mt-3 text-[16px] text-muted">We will email you a one-time sign-in link. No password needed.</p>
      <Suspense fallback={<div className="card mt-8 h-[228px] animate-pulse" />}>
        <LoginGate searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LoginGate({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const [session, params] = await Promise.all([getStaff(), searchParams]);
  const next = safeAdminPath(params.next);
  if (session) redirect(next);
  const notice =
    params.error === "denied"
      ? "This email does not have access."
      : params.error === "link"
        ? "That sign-in link has expired or was opened in a different browser. Request a new one here."
        : undefined;
  return <AdminLoginForm next={next} notice={notice} />;
}
