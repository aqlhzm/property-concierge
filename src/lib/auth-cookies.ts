/**
 * Cookie settings for the staff session. The session is only ever read on the server
 * (proxy, server components, server actions), so the cookies can be httpOnly.
 */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/** Only allow redirects back into the admin area after sign-in. */
export function safeAdminPath(value: unknown) {
  const path = typeof value === "string" ? value : "";
  return /^\/admin(\/[A-Za-z0-9\-_/]*)?$/.test(path) && !path.startsWith("/admin/login") ? path : "/admin";
}
