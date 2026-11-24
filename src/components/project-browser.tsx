"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Project } from "@/data/types";
import { BUDGETS, type Budget, matchesBudget, matchesQuery } from "@/lib/search";
import { ProjectCard, ProjectGrid } from "./project-card";

type Sort = "featured" | "price-asc" | "size-desc";

export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = params.get("q") ?? "";
  const budget = (params.get("budget") as Budget) ?? "any";
  const sort = (params.get("sort") as Sort) ?? "featured";

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v || v === "any" || v === "featured") sp.delete(k);
      else sp.set(k, v);
    }
    const s = sp.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }

  const results = useMemo(() => {
    const list = projects.filter((p) => matchesQuery(p, q) && matchesBudget(p, budget));
    if (sort === "price-asc") {
      // Unverified prices sort last so they are never presented as the cheapest option.
      list.sort((a, b) => (a.showPrice ? a.priceMin : Infinity) - (b.showPrice ? b.priceMin : Infinity));
    } else if (sort === "size-desc") {
      list.sort((a, b) => b.builtUpMax - a.builtUpMax);
    }
    return list;
  }, [projects, q, budget, sort]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:rounded-[20px] sm:border sm:border-line sm:bg-surface sm:grid-cols-[1fr_auto_auto] sm:gap-3 sm:p-3">
        <div className="relative col-span-2 sm:col-span-1">
          <Search aria-hidden size={17} className="absolute top-1/2 left-4 -translate-y-1/2 text-subtle" />
          <label htmlFor="q" className="sr-only">
            Search developments
          </label>
          <input
            id="q"
            type="search"
            defaultValue={q}
            key={q}
            placeholder="Search developments"
            className="field !min-h-11 !rounded-full !pl-11 sm:!min-h-12 sm:!rounded-xl focus:!border-white/35 focus-visible:!outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") update({ q: e.currentTarget.value.trim() });
            }}
            onBlur={(e) => e.currentTarget.value.trim() !== q && update({ q: e.currentTarget.value.trim() })}
          />
        </div>
        <div>
          <label htmlFor="budget" className="sr-only">
            Budget
          </label>
          <select id="budget" className="field !min-h-10 cursor-pointer !rounded-full !py-0 sm:!min-h-12 sm:w-52 sm:!rounded-xl" value={budget} onChange={(e) => update({ budget: e.target.value })}>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">
            Sort
          </label>
          <select id="sort" className="field !min-h-10 cursor-pointer !rounded-full !py-0 sm:!min-h-12 sm:w-48 sm:!rounded-xl" value={sort} onChange={(e) => update({ sort: e.target.value })}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="size-desc">Largest built up</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex min-h-9 items-center justify-between gap-3 sm:mt-6">
        <p className="text-[13px] text-muted sm:text-[14px]" aria-live="polite">
          {results.length} {results.length === 1 ? "development" : "developments"}
          {q && (
            <>
              {" "}
              for “<span className="text-text">{q}</span>”
            </>
          )}
        </p>
        {(q || budget !== "any" || sort !== "featured") && (
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[13px] text-muted hover:text-text"
          >
            <X aria-hidden size={14} /> Clear
          </button>
        )}
      </div>

      {results.length ? (
        <div className="mt-4">
          {/* Unfiltered, featured order: the spotlight development leads as a wide card. */}
          {!q && budget === "any" && sort === "featured" ? (
            <ProjectGrid projects={results} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {results.map((p, i) => (
                <ProjectCard key={p.slug} project={p} priority={i === 0} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card mt-4 p-10 text-center">
          <p className="font-display text-2xl">No developments match yet</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
            Try a broader search, or tell Aqil what you are looking for and he will shortlist options for you.
          </p>
        </div>
      )}
    </div>
  );
}
