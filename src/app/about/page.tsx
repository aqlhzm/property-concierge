import { KeyRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShareButton } from "@/components/share-button";
import { WhatsAppLink } from "@/components/whatsapp";
import { site } from "@/data/content";
import { units } from "@/data/units";
import { allProjects } from "@/lib/data";
import { formatNum } from "@/lib/format";

export const metadata: Metadata = {
  title: `About ${site.consultantName}`,
  description: site.serviceApproach,
  openGraph: { images: [{ url: site.aboutPortrait }] },
};

const PRINCIPLES = [
  {
    title: "Verified information first",
    body: "Every figure on this site is taken from the developer’s own brochure, with its source shown. If something needs reconfirming, you are told.",
  },
  {
    title: "The right decision, not just a sale",
    body: "Compare options honestly, understand the full financial commitment and move at a pace that suits you.",
  },
  {
    title: "With you until the keys",
    body: "From the first viewing through booking, financing and SPA to vacant possession and defect inspection.",
  },
];

export default function AboutPage() {
  const homes = allProjects.reduce((n, p) => n + p.totalUnits, 0);
  const stats = [
    { value: String(allProjects.length), label: "Developments advised" },
    { value: String(units.length), label: "Unit types with plans" },
    { value: formatNum(homes), label: "Homes across launches" },
  ];

  return (
    <div>
      <section className="relative isolate overflow-hidden pt-28 pb-14 sm:pt-32 lg:pb-20">
        {/* Ambient emerald and sage light */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_50%_at_78%_38%,rgba(52,196,140,0.16),transparent_70%),radial-gradient(ellipse_45%_45%_at_15%_85%,rgba(169,186,157,0.12),transparent_70%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
          {/* Framed portrait: arch window in a Liquid Glass frame */}
          <figure className="rise relative mx-auto w-full max-w-[400px] lg:order-2 lg:max-w-[460px]">
            <div aria-hidden className="absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(52,196,140,0.32),rgba(169,186,157,0.14)_55%,transparent)] blur-2xl" />
            <div className="glass-frame rounded-t-[999px] rounded-b-[36px] p-2.5 sm:p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[28px]">
                <Image
                  src={site.aboutPortrait}
                  alt={`${site.consultantName}, ${site.consultantTitle}, holding a house key`}
                  fill
                  priority
                  quality={90}
                  sizes="(min-width: 1024px) 460px, (min-width: 640px) 400px, 92vw"
                  className="object-cover object-top"
                />
                <div aria-hidden className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_-60px_80px_-40px_rgba(9,14,11,0.55)]" />
              </div>
            </div>
            <figcaption className="glass-photo absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full py-2 pr-4 pl-2 text-[13px] text-white sm:left-[-1.25rem] sm:translate-x-0">
              <span className="pill-active grid size-8 place-items-center rounded-full">
                <KeyRound aria-hidden size={16} />
              </span>
              From first enquiry to your keys
            </figcaption>
          </figure>

          <div className="lg:order-1">
            <p className="eyebrow rise">{site.consultantTitle}</p>
            <h1 className="rise-2 mt-3 font-display text-[52px] leading-[0.95] sm:text-[76px]">{site.consultantName}</h1>
            <p className="rise-2 mt-1 font-signature text-[34px] leading-tight text-sage-text sm:text-[40px]">{site.brandSignature}</p>
            <p className="rise-3 mt-5 max-w-lg text-[17px] text-muted">{site.serviceApproach}</p>
            <p className="rise-3 mt-3 text-[14px] text-subtle">{site.serviceAreas.join(" · ")}</p>
            <div className="rise-3 mt-8 flex flex-wrap gap-3">
              <WhatsAppLink context="general">WhatsApp Aqil</WhatsAppLink>
              <ShareButton title={`${site.consultantName} · PROPERTY CONCIERGE`} className="btn btn-ghost" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[20px] border border-line bg-line">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface p-5 text-center sm:p-7">
              <dd className="font-display text-[34px] leading-none tabular sm:text-[44px]">{s.value}</dd>
              <dt className="mt-2 text-[12px] text-muted sm:text-[14px]">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-5 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="card p-7 sm:p-9">
          <p className="eyebrow">Approach</p>
          <p className="mt-4 font-display text-[26px] leading-snug">{site.serviceApproach}</p>
          {site.consultantBio && <p className="mt-5 text-[16px] text-muted">{site.consultantBio}</p>}
        </div>
        <ul className="grid gap-5">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="card flex gap-5 p-6">
              <span className="font-display text-[22px] text-sage tabular">0{i + 1}</span>
              <div>
                <h2 className="text-[18px] font-medium">{p.title}</h2>
                <p className="mt-1.5 text-[15px] text-muted">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5 text-center sm:px-8">
        <h2 className="font-display text-[34px]">Start with a conversation</h2>
        <p className="mx-auto mt-2 max-w-md text-[16px] text-muted">Tell Aqil what you’re looking for. No obligation.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/enquire?intent=consultation" className="btn btn-primary">
            Book a consultation
          </Link>
          <Link href="/projects" className="btn btn-ghost">
            Browse developments
          </Link>
        </div>
      </section>
    </div>
  );
}
