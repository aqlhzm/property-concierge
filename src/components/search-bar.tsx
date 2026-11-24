"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SUGGESTIONS = ["Terrace", "Garden Home", "Kundang", "Puncak Alam"];

/** Liquid Glass search: one of the few glass surfaces in the system. */
export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function go(term: string) {
    const t = term.trim();
    router.push(t ? `/projects?q=${encodeURIComponent(t)}` : "/projects");
  }

  return (
    <div className={className}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className="glass flex h-16 items-center gap-3 rounded-full pr-2 pl-5 transition-[border-color,box-shadow] duration-200 focus-within:border-white/35 focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_30px_-12px_rgba(0,0,0,0.6)]"
      >
        <Search aria-hidden size={20} className="shrink-0 text-muted" />
        <label htmlFor="home-search" className="sr-only">
          Search developments
        </label>
        <input
          id="home-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by area, home type or development"
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-text placeholder:text-muted focus:!outline-none focus-visible:!outline-none"
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="submit" className="btn btn-primary !min-h-12 !px-5">
          Search
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Popular searches">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => go(s)}
            className="min-h-9 rounded-full border border-white/15 bg-black/25 px-3.5 text-[13px] text-white/85 backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
