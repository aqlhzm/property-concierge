import { Suspense } from "react";
import { EnquiryForm } from "@/components/enquiry-form";
import { WhatsAppLink } from "@/components/whatsapp";
import type { Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { getAllUnits, getProjects } from "@/lib/data";

export function EnquireView({ lang }: { lang: Lang }) {
  const t = dict(lang).enquire;
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-[var(--page-top)] sm:px-8 sm:pt-32 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      <div>
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="t-title mt-2">{t.title}</h1>
        <p className="t-lead mt-2 sm:mt-3">{t.lead}</p>
        <div className="mt-8 rounded-[20px] border border-line p-5">
          <p className="text-[15px]">{t.preferChat}</p>
          <p className="mt-1 text-[14px] text-muted">{t.fastest}</p>
          <WhatsAppLink context="general" lang={lang} className="btn btn-ghost mt-4">
            {t.openWhatsApp}
          </WhatsAppLink>
        </div>
      </div>
      <Suspense fallback={<div className="card h-[640px] animate-pulse" />}>
        <EnquiryForm projects={getProjects(lang)} units={getAllUnits(lang)} />
      </Suspense>
    </div>
  );
}
