"use client";

import { useEffect, useState } from "react";
import type { WhatsAppContext } from "@/data/types";
import { useLang, useT } from "@/i18n/client";
import { whatsappHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp-icon";

type Vars = Parameters<typeof whatsappHref>[1];

/**
 * Floating Liquid Glass WhatsApp control. On phones it is a 48px circle that
 * appears once the first screen (which has its own calls to action) is scrolled past.
 */
export function WhatsAppFloat({ context = "general", vars }: { context?: WhatsAppContext; vars?: Vars }) {
  const [shown, setShown] = useState(false);
  const lang = useLang();
  const t = useT();
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a
      href={whatsappHref(context, vars, lang)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsappFloat}
      className={`glass above-tabbar fixed right-4 z-30 inline-flex size-12 items-center justify-center rounded-full text-text transition-[opacity,transform] duration-300 ease-apple active:scale-95 md:right-6 md:h-14 md:w-auto md:gap-2 md:pr-5 md:pl-4 md:hover:scale-[1.03] ${
        shown ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100"
      }`}
    >
      <span className="pill-active grid size-9 place-items-center rounded-full md:size-8">
        <WhatsAppIcon size={18} />
      </span>
      <span className="hidden text-[15px] font-medium md:inline">WhatsApp</span>
    </a>
  );
}
