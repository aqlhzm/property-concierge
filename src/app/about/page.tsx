import { CalendarDays, ChevronDown, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/whatsapp";
import { whatsappHref } from "@/lib/whatsapp";
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
      {/* One responsive hero.
          Phone: the owner's reference, photo fills the screen, progressive blur under the face,
          content stacked over it.
          Desktop: a calm website layout, sharp portrait card on the left, details on the right. */}
      <section className="relative isolate flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden md:mx-auto md:grid md:h-auto md:min-h-0 md:max-w-6xl md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center md:gap-16 md:overflow-visible md:px-8 md:pt-36 md:pb-10">
        <div aria-hidden className="absolute inset-0 -z-40 hidden bg-[radial-gradient(ellipse_45%_55%_at_25%_45%,rgba(169,186,157,0.10),transparent_70%)] md:block" />

        {/* Portrait: full screen layer on phones, a card on desktop */}
        <div className="absolute inset-0 -z-30 md:relative md:inset-auto md:z-0 md:aspect-[4/5] md:overflow-hidden md:rounded-[32px] md:border md:border-line md:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]">
          <Image
            src={site.aboutPortrait}
            alt={`${site.consultantName}, ${site.consultantTitle}, holding a house key`}
            fill
            priority
            quality={90}
            sizes="(min-width: 768px) 42vw, 100vw"
            className="object-cover object-[50%_12%] md:object-top"
          />
        </div>

        {/* Phone only: progressive blur and tint, starting just under the face */}
        <div aria-hidden className="absolute inset-0 -z-20 backdrop-blur-[4px] [mask-image:linear-gradient(to_top,black_58%,transparent_76%)] md:hidden" />
        <div aria-hidden className="absolute inset-0 -z-20 backdrop-blur-[12px] [mask-image:linear-gradient(to_top,black_48%,transparent_66%)] md:hidden" />
        <div aria-hidden className="absolute inset-0 -z-20 backdrop-blur-[28px] saturate-[1.15] [mask-image:linear-gradient(to_top,black_36%,transparent_56%)] md:hidden" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(9,20,15,0.8)_0%,rgba(12,28,21,0.62)_34%,rgba(12,28,21,0.36)_54%,rgba(12,28,21,0.1)_68%,transparent_78%)] md:hidden" />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-black/30 to-transparent md:hidden" />

        <div className="mx-auto w-full max-w-[460px] px-5 pb-[calc(88px+env(safe-area-inset-bottom))] text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_4px_24px_rgba(0,0,0,0.4)] md:mx-0 md:max-w-[480px] md:px-0 md:pb-0 md:text-left md:[text-shadow:none]">
          <p className="eyebrow rise hidden md:block">{site.consultantTitle}</p>
          <h1 className="rise text-[40px] leading-[1.05] font-bold tracking-tight text-white sm:text-[48px] md:mt-3 md:text-[64px]">{site.consultantName}</h1>
          <p className="rise-2 mt-2 text-[15px] text-white/80 md:hidden">{site.consultantTitle}</p>
          <p className="rise-2 font-signature text-[26px] leading-tight text-sage-text md:mt-1 md:text-[32px]">{site.brandSignature}</p>
          <p className="rise-2 text-[14px] text-white/70 md:mt-3 md:text-[15px] md:text-muted">{site.serviceAreas.join(", ")}</p>

          {/* Segmented glass control, first segment active (white) as in the reference */}
          <nav aria-label="Contact Aqil" className="glass-photo rise-3 mt-6 grid grid-cols-3 gap-1 rounded-full p-1 md:mt-8 md:max-w-[420px]">
            <a
              href={whatsappHref("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-full bg-white text-[12px] font-medium text-[#0b1a13] shadow-[0_4px_14px_-6px_rgba(0,0,0,0.5)] transition-transform duration-200 [text-shadow:none] active:scale-95"
            >
              <span className="text-[#1f9d6a]">
                <WhatsAppIcon size={17} />
              </span>
              WhatsApp
            </a>
            <a
              href={`tel:+${site.whatsappNumber}`}
              className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-full text-[12px] font-medium text-white/90 transition-colors duration-200 hover:bg-white/10 active:scale-95"
            >
              <Phone aria-hidden size={16} />
              Call
            </a>
            <Link
              href="/enquire?intent=viewing"
              className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-full text-[12px] font-medium text-white/90 transition-colors duration-200 hover:bg-white/10 active:scale-95"
            >
              <CalendarDays aria-hidden size={16} />
              Viewing
            </Link>
          </nav>

          {/* Glass card; the avatar only appears on phones, where the portrait is behind the content */}
          <div className="glass-photo rise-3 mt-3 rounded-[26px] px-5 pt-4 pb-5 md:mt-4 md:max-w-[420px] md:rounded-[22px] md:pt-5 md:[text-shadow:none]">
            <div className="relative mx-auto size-10 overflow-hidden rounded-full ring-2 ring-white/40 md:hidden">
              <Image src={site.consultantPortrait} alt="" fill sizes="40px" className="object-cover object-top" />
            </div>
            <p className="mt-2 text-[14px] font-medium text-sage-text md:mt-0">Your consultant · {site.consultantName}</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-white/90 md:text-[15px]">{site.serviceApproach}</p>
          </div>

          <a
            href="#more"
            className="glass-photo rise-3 mx-auto mt-4 inline-flex min-h-9 items-center gap-2 rounded-full py-1 pr-1.5 pl-3.5 text-[12px] text-white/90 md:hidden"
          >
            Scroll down to learn more
            <span className="grid size-6 place-items-center rounded-full bg-white/90 text-[#0b1a13]">
              <ChevronDown aria-hidden size={14} />
            </span>
          </a>
        </div>
      </section>

      <section id="more" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-14 sm:px-8 md:pt-6">
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
