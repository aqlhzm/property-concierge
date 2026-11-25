import { site } from "@/data/content";
import type { Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";

export function PrivacyView({ lang }: { lang: Lang }) {
  const t = dict(lang).privacy;
  return (
    <div className="mx-auto max-w-3xl px-5 pt-[var(--page-top)] sm:px-8 sm:pt-32">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="t-title mt-2">{t.title}</h1>
      {site.privacyNotice ? (
        <div className="mt-8 space-y-4 text-[16px] whitespace-pre-line text-muted">{site.privacyNotice}</div>
      ) : (
        <div className="card mt-8 space-y-4 p-7 text-[16px] text-muted">
          <p>{t.p1(site.consultantName)}</p>
          <p>{t.p2(site.consultantName)}</p>
          <p>{t.p3}</p>
          <p className="text-[13px] text-subtle">{t.p4(site.consentVersion)}</p>
        </div>
      )}
    </div>
  );
}
