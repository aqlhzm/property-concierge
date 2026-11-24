"use client";

import { Loader2, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { PRIORITIES } from "@/lib/crm";

type Option = { value: string; label: string };

export function LeadFilters({ projects, intents }: { projects: Option[]; intents: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const first = useRef(true);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  }

  // Search as you type, after a short pause.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => update("q", q.trim()), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const select = (key: string, label: string, options: Option[]) => (
    <label className="min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={params.get(key) ?? ""}
        onChange={(e) => update(key, e.target.value)}
        className="field cursor-pointer !min-h-11 text-[14px]"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle" />
        <label htmlFor="lead-search" className="sr-only">
          Search leads
        </label>
        <input
          id="lead-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone or reference"
          className="field !min-h-12 !pl-11"
          autoComplete="off"
        />
        {pending && <Loader2 aria-hidden className="absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin text-subtle" />}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {select("priority", "Any priority", PRIORITIES.map((p) => ({ value: p.key, label: p.label })))}
        {select("project", "Any development", projects)}
        {select("intent", "Any enquiry type", intents.map((i) => ({ value: i, label: i })))}
        {select("sort", "Newest first", [
          { value: "follow_up", label: "Follow-up date" },
          { value: "priority", label: "Priority" },
          { value: "oldest", label: "Oldest first" },
        ])}
      </div>
    </div>
  );
}
