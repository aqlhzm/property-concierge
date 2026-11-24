"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleShortlist, useShortlist } from "@/lib/shortlist";

/**
 * Save a development or unit type to the buyer's shortlist (kept on their device).
 * "pill" shows a label; "icon" is a compact round button for tight spots.
 */
export function SaveButton({
  id,
  name,
  variant = "pill",
  className = "",
}: {
  id: string;
  name: string;
  variant?: "pill" | "icon";
  className?: string;
}) {
  const saved = useShortlist().includes(id);
  const Icon = saved ? BookmarkCheck : Bookmark;
  const label = saved ? `Remove ${name} from your shortlist` : `Save ${name} to your shortlist`;

  return (
    <button
      type="button"
      onClick={() => toggleShortlist(id)}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border transition-[background-color,border-color,color,transform] duration-200 active:scale-95 ${
        saved ? "border-emerald/50 bg-forest/80 text-emerald-text" : "border-white/15 bg-black/25 text-text/90 backdrop-blur-md hover:border-white/30"
      } ${variant === "icon" ? "size-11" : "min-h-11 px-4 text-[14px] font-medium"} ${className}`}
    >
      <Icon aria-hidden size={variant === "icon" ? 18 : 16} strokeWidth={saved ? 2.2 : 1.8} />
      {variant === "pill" && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}

/** Header link to the shortlist; appears once something is saved */
export function ShortlistCount({ render }: { render: (count: number) => React.ReactNode }) {
  const count = useShortlist().length;
  return count > 0 ? <>{render(count)}</> : null;
}
