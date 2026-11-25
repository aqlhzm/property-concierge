"use client";

import { useEffect } from "react";
import { LOCALE } from "@/i18n/config";
import { useLang, useT } from "@/i18n/client";

/** Keeps <html lang> in step with the address when moving between English and Bahasa Melayu pages. */
export function HtmlLang() {
  const lang = useLang();
  useEffect(() => {
    document.documentElement.lang = LOCALE[lang];
  }, [lang]);
  return null;
}

export function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-emerald focus:px-4 focus:py-2 focus:text-on-emerald"
    >
      {t.skip}
    </a>
  );
}
