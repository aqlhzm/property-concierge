"use client";

import { Building2, Calculator, CalendarCheck, ExternalLink, GitCompareArrows, Home, LogOut, UserRound, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/login/actions";
import { Wordmark } from "./brand";
import { ShareButton } from "./share-button";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: Building2 },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/about", label: "About", icon: UserRound },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

const adminItems = [
  { href: "/admin", label: "Today", icon: CalendarCheck },
  { href: "/admin/leads", label: "Leads", icon: Users },
] as const;

const isAdminPath = (pathname: string) => pathname === "/admin" || pathname.startsWith("/admin/");
const isAdminActive = (pathname: string, href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

function AdminHeader({ pathname }: { pathname: string }) {
  const signedOutPage = pathname === "/admin/login";
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="glass glass-clear pointer-events-auto mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full pl-5 pr-2">
        <div className="flex items-center gap-3">
          <Wordmark href={signedOutPage ? "/" : "/admin"} />
          <span className="hidden rounded-full border border-line px-2.5 py-1 text-[11px] font-medium tracking-[0.14em] text-muted uppercase sm:inline">
            Staff
          </span>
        </div>
        {!signedOutPage && (
          <nav aria-label="Staff" className="flex items-center gap-1">
            {adminItems.map((it) => {
              const active = isAdminActive(pathname, it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={`hidden min-h-11 items-center rounded-full px-4 text-[14px] transition-colors duration-200 md:inline-flex ${
                    active ? "bg-white/15 text-white" : "text-white/85 hover:text-white"
                  }`}
                >
                  {it.label}
                </Link>
              );
            })}
            <Link href="/" className="hidden min-h-11 items-center gap-1.5 rounded-full px-4 text-[14px] text-white/85 hover:text-white md:inline-flex">
              Website <ExternalLink aria-hidden size={14} />
            </Link>
            <form action={signOut}>
              <button type="submit" aria-label="Sign out" className="btn btn-ghost !min-h-11 !min-w-11 !px-3 text-[14px] sm:!px-4">
                <LogOut aria-hidden size={16} /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}

function AdminTabBar({ pathname }: { pathname: string }) {
  if (pathname === "/admin/login") return null;
  const tabs = [...adminItems, { href: "/", label: "Website", icon: Home }];
  return (
    <nav aria-label="Staff" className="glass pb-safe fixed inset-x-0 bottom-0 z-40 rounded-t-[22px] border-b-0 px-2 pt-1.5 md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {tabs.map((it) => {
          const active = it.href !== "/" && isAdminActive(pathname, it.href);
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium transition-colors duration-200 ${
                  active ? "text-emerald-text" : "text-muted"
                }`}
              >
                <Icon aria-hidden size={22} strokeWidth={active ? 2.2 : 1.7} />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Renders its children on public pages only (used for the footer). */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return isAdminPath(pathname) ? null : children;
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isAdminPath(pathname)) return <AdminHeader pathname={pathname} />;
  const immersive = pathname === "/about";
  return (
    <>
      {immersive && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] md:hidden">
          <Link href="/" aria-label="Close and go home" className="glass-photo pointer-events-auto grid size-11 place-items-center rounded-full text-white">
            <X aria-hidden size={20} />
          </Link>
          <ShareButton title="Aqil Hazim · PROPERTY CONCIERGE" iconOnly className="glass-photo pointer-events-auto grid size-11 place-items-center rounded-full text-white" />
        </div>
      )}
    <header className={`pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 ${immersive ? "hidden md:block" : ""}`}>
      <div className="glass glass-clear pointer-events-auto mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full pl-5 pr-2">
        <Wordmark />
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {items.slice(1).map((it) => {
            const active = isActive(pathname, it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-[14px] transition-colors duration-200 ${
                  active ? "bg-white/15 text-white" : "text-white/85 hover:text-white"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
          <Link href="/enquire" className="btn btn-primary ml-2 !min-h-11 !px-5 text-[14px]">
            Speak to Aqil
          </Link>
        </nav>
        <Link href="/enquire" className="btn btn-primary !min-h-11 !px-4 text-[14px] md:hidden">
          Enquire
        </Link>
      </div>
    </header>
    </>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();
  if (isAdminPath(pathname)) return <AdminTabBar pathname={pathname} />;
  return (
    <nav
      aria-label="Primary"
      className="glass pb-safe fixed inset-x-0 bottom-0 z-40 rounded-t-[22px] border-b-0 px-2 pt-1.5 md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((it) => {
          const active = isActive(pathname, it.href);
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium transition-colors duration-200 ${
                  active ? "text-emerald-text" : "text-muted"
                }`}
              >
                <Icon aria-hidden size={22} strokeWidth={active ? 2.2 : 1.7} />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
