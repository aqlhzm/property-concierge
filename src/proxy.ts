import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_OPTIONS } from "@/lib/auth-cookies";

/**
 * Guards /admin: refreshes the staff session cookie and sends visitors without a session to the sign-in page.
 * Whether a session belongs to active staff is checked again in the page and, finally, by the database policies.
 */
export async function proxy(request: NextRequest) {
  // Supabase falls back to the Site URL (the home page) when a sign-in link cannot return to the callback,
  // or when the link has already been used. Send those visitors on instead of leaving them on the home page.
  if (request.nextUrl.pathname === "/") {
    const code = request.nextUrl.searchParams.get("code");
    const to = request.nextUrl.clone();
    to.search = "";
    if (code && /^[0-9a-f-]{20,}$/i.test(code)) {
      to.pathname = "/admin/auth/callback";
      to.searchParams.set("code", code);
    } else {
      to.pathname = "/admin/login";
      to.searchParams.set("error", "link");
    }
    return NextResponse.redirect(to);
  }

  let response = NextResponse.next({ request });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  let signedIn = false;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookieOptions: AUTH_COOKIE_OPTIONS,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list, headers) => {
          for (const { name, value } of list) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of list) response.cookies.set(name, value, options);
          for (const [k, v] of Object.entries(headers ?? {})) response.headers.set(k, v);
        },
      },
    });
    const { data } = await supabase.auth.getClaims();
    signedIn = Boolean(data?.claims?.sub);
  }

  const { pathname } = request.nextUrl;
  const isPublic = pathname === "/admin/login" || pathname.startsWith("/admin/auth/");
  if (!signedIn && !isPublic) {
    const to = request.nextUrl.clone();
    to.pathname = "/admin/login";
    to.search = "";
    if (pathname !== "/admin") to.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(to);
    for (const c of response.cookies.getAll()) redirect.cookies.set(c);
    redirect.headers.set("Cache-Control", "private, no-store");
    return redirect;
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    // Only home page visits that carry a Supabase sign-in result; ordinary visits never run the proxy.
    { source: "/", has: [{ type: "query", key: "code" }] },
    { source: "/", has: [{ type: "query", key: "error_code" }] },
  ],
};
