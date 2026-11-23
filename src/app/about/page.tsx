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
      {/* Profile hero (owner's reference): portrait fades into the page, name over the fade,
          actions, stats and bio below. Portrait is contained, not full screen. */}
      <section className="relative isolate overflow-hidden pt-24 pb-6 sm:pt-28">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_45%_at_50%_30%,rgba(52,196,140,0.14),transparent_70%)]" />
        <div className="mx-auto w-full max-w-[540px] sm:px-5">
          <div className="relative aspect-[4/5] max-h-[74svh] w-full overflow-hidden sm:rounded-[32px]">
            <Image
              src={site.aboutPortrait}
              alt={`${site.consultantName}, ${site.consultantTitle}, holding a house key`}
              fill
              priority
              quality={90}
              sizes="(min-width: 640px) 540px, 100vw"
              className="object-cover object-top"
            />
            {/* Progressive blur + fade into the page, as in the reference */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[48%] backdrop-blur-xl [mask-image:linear-gradient(to_top,black_30%,transparent)]" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-bg via-bg/75 to-transparent" />

            <div className="hero-copy absolute inset-x-0 bottom-0 px-6 pb-6 text-center">
              <p className="eyebrow rise">{site.consultantTitle}</p>
              <h1 className="rise-2 mt-2 font-display text-[44px] leading-none sm:text-[52px]">{site.consultantName}</h1>
              <p className="rise-2 mt-1 font-signature text-[28px] leading-tight text-sage-text">{site.brandSignature}</p>
            </div>
          </div>

          <div className="px-5 sm:px-0">
            <div className="rise-3 mt-5 flex items-center gap-3">
              <WhatsAppLink context="general" className="btn btn-primary !min-h-12 flex-1">
                WhatsApp Aqil
              </WhatsAppLink>
              <ShareButton
                title={`${site.consultantName} · PROPERTY CONCIERGE`}
                className="btn btn-ghost !min-h-12 !w-12 !px-0"
                iconOnly
              />
            </div>

            <dl className="mt-7 grid grid-cols-3 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <dd className="font-display text-[30px] leading-none tabular">{s.value}</dd>
                  <dt className="mt-1.5 text-[13px] text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>

            <div className="glass mt-7 rounded-[20px] px-5 py-4">
              <p className="text-[15px] leading-relaxed text-text/90">{site.serviceApproach}</p>
              <p className="mt-2 text-[13px] text-subtle">{site.serviceAreas.join(" · ")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-5 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="card p-7 sm:p-9">
          <p className="eyebrow">How Aqil works</p>
          <p className="mt-4 font-display text-[26px] leading-snug">Clear, honest guidance at every step, so you can decide with confidence.</p>
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
