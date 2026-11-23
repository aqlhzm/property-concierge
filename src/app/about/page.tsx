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
  openGraph: { images: [{ url: site.consultantPortrait }] },
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
      <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden">
        <Image src={site.consultantPortrait} quality={85} alt={`Portrait of ${site.consultantName}`} fill priority sizes="100vw" className="-z-20 object-cover object-[50%_20%]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#090e0b_0%,rgba(9,14,11,0.5)_16%,rgba(9,14,11,0.18)_42%,rgba(9,14,11,0.04)_80%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_65%_at_0%_85%,rgba(9,14,11,0.6),transparent_70%)]" />
        <div className="hero-copy mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8">
          <p className="eyebrow rise">{site.consultantTitle}</p>
          <h1 className="rise-2 mt-2 font-display text-[52px] leading-none sm:text-[80px]">{site.consultantName}</h1>
          <p className="rise-2 mt-3 text-[17px] text-muted">{site.serviceAreas.join(" · ")}</p>
          <div className="rise-3 mt-6 flex flex-wrap gap-3">
            <WhatsAppLink context="general">WhatsApp Aqil</WhatsAppLink>
            <ShareButton title={`${site.consultantName} · PROPERTY CONCIERGE`} className="btn btn-ghost" />
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
          <div className="mt-8">
            <p className="font-signature text-[42px] leading-none text-emerald-text">aqilgotkeys</p>
          </div>
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
