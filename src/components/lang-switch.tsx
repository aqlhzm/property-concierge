"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { lp, stripLang } from "@/i18n/config";
import { useLang, useT } from "@/i18n/client";

/**
 * EN / BM switch. Opens the same page in the other language and keeps any filters in the address
 * (?q=, ?p=, ?project=) and the section you were on.
 */
export function LangSwitch({ compact = false, photo = false }: { compact?: boolean; photo?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const other = lang === "en" ? "ms" : "en";
  const href = lp(other, stripLang(pathname));

  const base = photo
    ? "glass-photo pointer-events-auto grid size-11 place-items-center rounded-full text-[13px] font-semibold tracking-[0.06em] text-white"
    : compact
      ? "grid h-11 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold tracking-[0.04em] text-white/85 transition-colors duration-200 hover:text-white"
      : "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold tracking-[0.06em] text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white";

  return (
    <a
      href={href}
      hrefLang={other === "ms" ? "ms-MY" : "en-MY"}
      lang={other === "ms" ? "ms-MY" : "en-MY"}
      aria-label={t.switchLabel}
      title={t.switchLabel}
      className={base}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        router.push(`${href}${window.location.search}${window.location.hash}`, { scroll: false });
      }}
    >
      {!compact && !photo && <Languages aria-hidden size={15} className="opacity-80" />}
      {compact && !photo ? (
        <span className="grid h-7 min-w-8 place-items-center rounded-full border border-white/20 px-1.5">{t.switchTo}</span>
      ) : (
        t.switchTo
      )}
    </a>
  );
}
