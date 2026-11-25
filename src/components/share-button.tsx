"use client";

import { Check, Share } from "lucide-react";
import { useState } from "react";
import { useT } from "@/i18n/client";

export function ShareButton({
  title,
  className = "",
  iconOnly = false,
  url,
  label,
}: {
  title: string;
  className?: string;
  iconOnly?: boolean;
  /** Share this address instead of the current page */
  url?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const t = useT();

  async function share() {
    const target = url ? new URL(url, window.location.origin).toString() : window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url: target });
        return;
      }
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled the share sheet, nothing to do
    }
  }

  return (
    <button type="button" onClick={share} className={className} aria-label={copied ? t.share.copied : (label ?? t.share.sharePage)}>
      {copied ? <Check aria-hidden size={18} /> : <Share aria-hidden size={18} />}
      <span aria-live="polite" className={iconOnly ? "sr-only" : undefined}>
        {copied ? t.share.copied : (label ?? t.share.share)}
      </span>
    </button>
  );
}
