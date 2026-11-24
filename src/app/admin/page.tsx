import type { Metadata } from "next";
import { Suspense } from "react";
import { signOut } from "@/app/admin/login/actions";
import { requireStaff } from "@/lib/supabase-auth";

export const metadata: Metadata = { title: "Overview" };

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 sm:px-8">
      <Suspense fallback={<div className="card h-[200px] animate-pulse" />}>
        <Overview />
      </Suspense>
    </div>
  );
}

async function Overview() {
  const { supabase, staff } = await requireStaff();
  const [total, fresh, followUps] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).is("archived_at", null),
    supabase.from("leads").select("id", { count: "exact", head: true }).is("archived_at", null).eq("status", "new"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .is("archived_at", null)
      .lte("next_follow_up_at", new Date().toISOString()),
  ]);

  const stats = [
    { label: "Active leads", value: total.count ?? 0 },
    { label: "New, not yet contacted", value: fresh.count ?? 0 },
    { label: "Follow-ups due", value: followUps.count ?? 0 },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Staff</p>
          <h1 className="mt-2 font-display text-[40px] leading-tight">Welcome back, {staff.fullName}</h1>
          <p className="mt-2 text-[15px] text-muted">{staff.email}</p>
        </div>
        <form action={signOut}>
          <button type="submit" className="btn btn-ghost">
            Sign out
          </button>
        </form>
      </div>
      <dl className="mt-10 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-6">
            <dt className="text-[14px] text-muted">{s.label}</dt>
            <dd className="mt-2 font-display text-[44px] leading-none tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-[14px] text-subtle">The lead list, lead pages and Today view arrive in the next step.</p>
    </>
  );
}
