import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_OPTIONS } from "./auth-cookies";

/**
 * Supabase client that carries the signed-in staff session (cookies).
 * Staff access is enforced in the database: every policy calls is_staff().
 */
export async function getAuthClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const store = await cookies();
  return createServerClient(url, key, {
    cookieOptions: AUTH_COOKIE_OPTIONS,
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component, which cannot set cookies. The proxy refreshes the session instead.
        }
      },
    },
  });
}

export type StaffMember = { userId: string; email: string; fullName: string; role: "owner" | "agent" };

/** The signed-in staff member, or null when there is no session or the account has no access. */
export async function getStaff() {
  const supabase = await getAuthClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getClaims();
  const sub = data?.claims?.sub;
  if (!sub) return null;
  const { data: row } = await supabase
    .from("staff")
    .select("user_id, email, full_name, role, active")
    .eq("user_id", sub)
    .maybeSingle();
  if (!row || !row.active) return null;
  const staff: StaffMember = { userId: row.user_id, email: row.email, fullName: row.full_name, role: row.role };
  return { supabase, staff };
}

export async function requireStaff() {
  const session = await getStaff();
  if (!session) redirect("/admin/login");
  return session;
}
