"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { lp } from "@/i18n/config";
import { useLang, useT } from "@/i18n/client";

/** Liquid Glass search: one of the few glass surfaces in the system. */
export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const lang = useLang();
  const t = useT();
  const [q, setQ] = useState("");

  function go(term: string) {
    const v = term.trim();
    router.push(lp(lang, v ? `/projects?q=${encodeURIComponent(v)}` : "/projects"));
  }

  return (
    <div className={className}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className="glass flex h-12 items-center gap-2.5 rounded-full pr-1 pl-4 sm:h-14 sm:gap-3 sm:pr-2 sm:pl-5 transition-[border-color,box-shadow] duration-200 focus-within:border-white/35 focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_30px_-12px_rgba(0,0,0,0.6)]"
      >
        <Search aria-hidden size={17} className="shrink-0 text-muted" />
        <label htmlFor="home-search" className="sr-only">
          {t.search.label}
        </label>
        <input
          id="home-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.search.placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-text placeholder:text-muted focus:!outline-none focus-visible:!outline-none"
          autoComplete="off"
          enterKeyHint="search"
        />
        {/* Phone: a compact round go button (the keyboard also has Search); larger screens keep the label */}
        <button type="submit" aria-label={t.search.submit} className="btn btn-primary !min-h-10 !min-w-10 !px-0 sm:!min-h-11 sm:!px-5">
          <ArrowRight aria-hidden size={17} className="sm:hidden" />
          <span className="max-sm:hidden">{t.search.submit}</span>
        </button>
      </form>
      <div className="scroll-row -mx-5 mt-2.5 flex gap-1.5 overflow-x-auto px-5 sm:mt-3 sm:gap-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" aria-label={t.search.popular}>
        {t.search.suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => go(s)}
            className="min-h-8 shrink-0 rounded-full border border-white/12 bg-black/25 px-3 text-[13px] text-white/80 sm:min-h-9 sm:px-3.5 backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
