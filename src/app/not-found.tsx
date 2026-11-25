"use client";

import Link from "next/link";
import { lp } from "@/i18n/config";
import { useLang, useT } from "@/i18n/client";

export default function NotFound() {
  const lang = useLang();
  const t = useT().notFound;
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-5 pt-[var(--page-top)] text-center">
      <p className="eyebrow">404</p>
      <h1 className="t-title mt-2">{t.title}</h1>
      <p className="t-lead mt-3">{t.lead}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={lp(lang, "/projects")} className="btn btn-primary">
          {t.browse}
        </Link>
        <Link href={lp(lang, "/")} className="btn btn-ghost">
          {t.home}
        </Link>
      </div>
    </div>
  );
}
