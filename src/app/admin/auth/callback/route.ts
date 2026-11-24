import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeAdminPath } from "@/lib/auth-cookies";
import { getAuthClient } from "@/lib/supabase-auth";

/**
 * Lands the sign-in link from the email. Supabase sends the browser here with a one-time `code`
 * (or a `token_hash` once custom email templates are used). The session is created, the invite is
 * claimed, and anyone without access is signed straight back out.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeAdminPath(searchParams.get("next"));
  const fail = (reason: "link" | "denied") => NextResponse.redirect(new URL(`/admin/login?error=${reason}`, origin));

  const auth = await getAuthClient();
  if (!auth) return fail("link");

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const { error } = code
    ? await auth.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await auth.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("missing code") };
  if (error) return fail("link");

  const { data: role } = await auth.rpc("claim_staff");
  if (!role) {
    await auth.auth.signOut();
    return fail("denied");
  }
  return NextResponse.redirect(new URL(next, origin));
}
