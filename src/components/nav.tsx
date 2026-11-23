"use client";

import { Building2, Calculator, GitCompareArrows, Home, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function SiteHeader() {
  const pathname = usePathname();
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
      <div className="glass pointer-events-auto mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full pl-5 pr-2">
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
                  active ? "bg-white/10 text-text" : "text-muted hover:text-text"
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
