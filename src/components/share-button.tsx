"use client";

import { Check, Share } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title, className = "" }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled share sheet — nothing to do
    }
  }

  return (
    <button type="button" onClick={share} className={className} aria-label={copied ? "Link copied" : "Share this page"}>
      {copied ? <Check aria-hidden size={18} /> : <Share aria-hidden size={18} />}
      <span aria-live="polite">{copied ? "Copied" : "Share"}</span>
    </button>
  );
}
