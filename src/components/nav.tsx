"use client";

import { Bookmark, Building2, Calculator, CalendarCheck, ExternalLink, GitCompareArrows, Home, LogOut, UserRound, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/app/admin/login/actions";
import { Wordmark } from "./brand";
import { ShortlistCount } from "./save-button";
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

/** Hides the bar while scrolling down a phone screen and brings it back on the way up (Safari style). */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - last) < 6) return;
        setHidden(y > last && y > 120);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return hidden;
}

/** Saved homes; shown in the header only once the buyer has saved something */
function ShortlistLink({ count, active }: { count: number; active: boolean }) {
  return (
    <Link
      href="/shortlist"
      aria-label={`Your shortlist, ${count} saved`}
      aria-current={active ? "page" : undefined}
      className={`relative grid size-11 place-items-center rounded-full transition-colors duration-200 ${active ? "bg-white/15 text-white" : "text-white/85 hover:text-white"}`}
    >
      <Bookmark aria-hidden size={18} />
      <span className="absolute top-1.5 right-1 grid min-w-[17px] place-items-center rounded-full bg-emerald px-1 text-[10px] leading-[17px] font-semibold text-[#06120c] tabular">
        {count}
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const hidden = useHideOnScroll();
  if (isAdminPath(pathname)) return <AdminHeader pathname={pathname} />;
  const immersive = pathname === "/about";
  return (
    <>
      {immersive && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden">
          <Link href="/" aria-label="Close and go home" className="glass-photo pointer-events-auto grid size-11 place-items-center rounded-full text-white">
            <X aria-hidden size={18} />
          </Link>
          <ShareButton title="Aqil Hazim · PROPERTY CONCIERGE" iconOnly className="glass-photo pointer-events-auto grid size-11 place-items-center rounded-full text-white" />
        </div>
      )}
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] transition-transform duration-300 ease-apple sm:px-6 sm:pt-3 ${
          immersive ? "hidden md:block" : ""
        } ${hidden ? "max-md:-translate-y-[calc(100%+8px)]" : ""}`}
      >
        <div className="glass glass-clear pointer-events-auto mx-auto flex h-12 max-w-6xl items-center justify-between rounded-full pr-1.5 pl-4 sm:h-16 sm:pr-2 sm:pl-5">
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
            <ShortlistCount render={(n) => <ShortlistLink count={n} active={pathname === "/shortlist"} />} />
            <Link href="/enquire" className="btn btn-primary ml-2 !min-h-11 !px-5 text-[14px]">
              Speak to Aqil
            </Link>
          </nav>
          <div className="flex items-center gap-1 md:hidden">
            <ShortlistCount render={(n) => <ShortlistLink count={n} active={pathname === "/shortlist"} />} />
            {/* 36px visual inside a 48px bar, so the tap target stays generous */}
            <Link href="/enquire" className="btn btn-primary !min-h-9 !px-3.5 !text-[13.5px]">
              Enquire
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

/**
 * iOS 26 style floating capsule tab bar: 5 destinations, single-word 10px labels, active tab on a soft pill.
 * Like the Liquid Glass tab bars in Music and Safari, it minimises while you scroll down (labels tuck away,
 * the bar slims) and returns in full on the way back up.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const compact = useHideOnScroll();
  if (isAdminPath(pathname)) return <AdminTabBar pathname={pathname} />;
  return (
    <nav
      aria-label="Primary"
      data-compact={compact || undefined}
      className="glass group/tab fixed inset-x-4 bottom-[var(--tabbar-gap)] z-40 mx-auto h-[var(--tabbar-h)] max-w-[400px] rounded-full p-1 transition-[height,inset] duration-300 ease-apple data-[compact]:inset-x-10 data-[compact]:h-12 md:hidden"
    >
      <ul className="grid h-full grid-cols-5">
        {items.map((it) => {
          const active = isActive(pathname, it.href);
          const Icon = it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                aria-label={it.label}
                className={`flex h-full flex-col items-center justify-center gap-[3px] rounded-full transition-colors duration-200 group-data-[compact]/tab:gap-0 ${
                  active ? "bg-white/[0.09] text-emerald-text" : "text-muted active:bg-white/5"
                }`}
              >
                <Icon aria-hidden size={21} strokeWidth={active ? 2.1 : 1.6} />
                <span className="text-[10px] leading-none font-medium tracking-[0.01em] transition-[opacity,max-height] duration-200 group-data-[compact]/tab:max-h-0 group-data-[compact]/tab:opacity-0 max-h-3">
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
