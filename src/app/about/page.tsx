import { CalendarDays, ChevronDown, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortraitMotion } from "@/components/portrait-motion";
import { WhatsAppIcon } from "@/components/whatsapp";
import { whatsappHref } from "@/lib/whatsapp";
import { site } from "@/data/content";
import { units } from "@/data/units";
import { allProjects } from "@/lib/data";
import { formatNum } from "@/lib/format";
import { IMAGES } from "@/data/projects";
import { openGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: `About ${site.consultantName}`,
  description: site.serviceApproach,
  openGraph: openGraph(IMAGES.ogAbout, `${site.consultantName}, ${site.consultantTitle}`),
  twitter: { card: "summary_large_image" },
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
      {/* Profile hero after the owner's reference, on every screen size.
          Phone: the photo fills the screen.
          Desktop: the whole portrait sits sharp in the centre; the screen's sides continue the
          photo's own sage wall (colours sampled from its edges), so it reads as one wide photo.
          Blur only sits low, behind the content, as in the reference. */}
      <section className="relative isolate flex h-[100svh] min-h-[640px] flex-col justify-end overflow-hidden md:min-h-[780px]">
        {/* Desktop wall extension (sampled from the photo's left and right edges) */}
        <div aria-hidden className="absolute inset-y-0 left-0 -z-40 hidden w-1/2 bg-[linear-gradient(to_bottom,#696b58_0%,#727560_22%,#7a7d68_50%,#6c6958_66%,#747762_100%)] md:block" />
        <div aria-hidden className="absolute inset-y-0 right-0 -z-40 hidden w-1/2 bg-[linear-gradient(to_bottom,#bfc1a2_0%,#b3b697_22%,#c1c3a3_48%,#9a9d84_62%,#776f5e_74%,#666957_100%)] md:block" />
        <div aria-hidden className="absolute inset-0 -z-40 hidden bg-[radial-gradient(ellipse_70%_90%_at_50%_40%,transparent_55%,rgba(9,14,11,0.55)_100%)] md:block" />

        {/* Portrait: fills the phone; centred full height on desktop with feathered sides */}
        <div className="absolute inset-0 -z-30 md:inset-x-auto md:left-1/2 md:aspect-[3291/4096] md:h-full md:-translate-x-1/2 md:[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <Image
            src={site.aboutPortrait}
            alt={`${site.consultantName}, ${site.consultantTitle}, holding a house key`}
            fill
            priority
            quality={90}
            sizes="(min-width: 768px) 82vh, 100vw"
            className="object-cover object-[50%_12%] md:object-top"
          />
          {/* Same photo, moving subtly; fades in over the still once playing */}
          <PortraitMotion
            large={site.aboutPortraitVideo.large}
            small={site.aboutPortraitVideo.small}
            className="object-cover object-[50%_12%] md:object-top"
          />
        </div>

        {/* Progressive blur, low and behind the content only */}
        <div aria-hidden className="absolute inset-0 -z-20 backdrop-blur-[4px] [mask-image:linear-gradient(to_top,black_42%,transparent_60%)] md:[mask-image:linear-gradient(to_top,black_50%,transparent_68%)]" />
        <div aria-hidden className="absolute inset-0 -z-20 backdrop-blur-[12px] [mask-image:linear-gradient(to_top,black_34%,transparent_52%)] md:[mask-image:linear-gradient(to_top,black_40%,transparent_58%)]" />
        <div aria-hidden className="absolute inset-0 -z-20 backdrop-blur-[28px] saturate-[1.15] [mask-image:linear-gradient(to_top,black_24%,transparent_42%)] md:[mask-image:linear-gradient(to_top,black_28%,transparent_48%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(9,20,15,0.82)_0%,rgba(12,28,21,0.62)_24%,rgba(12,28,21,0.34)_40%,rgba(12,28,21,0.08)_54%,transparent_64%)] md:bg-[linear-gradient(to_top,rgba(9,20,15,0.82)_0%,rgba(12,28,21,0.62)_30%,rgba(12,28,21,0.34)_50%,rgba(12,28,21,0.08)_64%,transparent_72%)]" />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="mx-auto w-full max-w-[460px] px-5 pb-[calc(var(--tabbar-h)+var(--tabbar-gap)+20px)] text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_4px_24px_rgba(0,0,0,0.4)] md:max-w-[520px] md:pb-10">
          <h1 className="rise text-[32px] leading-[1.08] font-bold tracking-tight text-white sm:text-[48px] md:text-[56px]">{site.consultantName}</h1>
          <p className="rise-2 font-signature text-[22px] leading-tight text-sage-text md:text-[28px]">{site.brandSignature}</p>
          <p className="rise-2 mt-1 text-[13px] text-balance text-white/75 sm:text-[14px]">
            {site.consultantTitle} · {site.serviceAreas.join(", ")}
          </p>

          {/* Segmented glass control, first segment active (white) */}
          <nav aria-label="Contact Aqil" className="glass-photo rise-3 mx-auto mt-5 grid max-w-[360px] grid-cols-3 gap-1 rounded-full p-1">
            <a
              href={whatsappHref("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-full bg-white text-[11px] font-medium text-[#0b1a13] shadow-[0_4px_14px_-6px_rgba(0,0,0,0.5)] transition-transform duration-200 [text-shadow:none] active:scale-95"
            >
              <span className="text-[#1f9d6a]">
                <WhatsAppIcon size={16} />
              </span>
              WhatsApp
            </a>
            <a
              href={`tel:+${site.whatsappNumber}`}
              className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium text-white/90 transition-colors duration-200 hover:bg-white/10 active:scale-95"
            >
              <Phone aria-hidden size={15} />
              Call
            </a>
            <Link
              href="/enquire?intent=viewing"
              className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-medium text-white/90 transition-colors duration-200 hover:bg-white/10 active:scale-95"
            >
              <CalendarDays aria-hidden size={15} />
              Viewing
            </Link>
          </nav>

          <a href="#more" aria-label="Learn more about Aqil" className="rise-3 mx-auto mt-3 grid size-11 place-items-center text-white/70 hover:text-white">
            <ChevronDown aria-hidden size={20} />
          </a>
        </div>
      </section>

      <section id="more" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-10 sm:px-8 sm:pt-14">
        <p className="mx-auto mb-6 max-w-[34ch] text-center text-[15px] leading-relaxed text-text/90 sm:mb-8 sm:max-w-xl sm:text-[18px]">{site.serviceApproach}</p>
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-[20px] border border-line bg-line">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface px-2 py-4 text-center sm:p-7">
              <dd className="font-display text-[26px] leading-none tabular sm:text-[44px]">{s.value}</dd>
              <dt className="mt-1.5 text-[11px] leading-snug text-muted sm:mt-2 sm:text-[14px]">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-3 px-5 sm:mt-16 sm:gap-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="card p-5 sm:p-9">
          <p className="eyebrow">How Aqil works</p>
          <p className="mt-2.5 font-display text-[20px] leading-snug sm:mt-3 sm:text-[26px]">Clear, honest guidance at every step, so you can decide with confidence.</p>
          {site.consultantBio && <p className="mt-4 text-[15px] leading-relaxed text-muted sm:mt-5 sm:text-[16px]">{site.consultantBio}</p>}
        </div>
        <ul className="grid gap-3 sm:gap-5">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="card flex gap-3.5 p-4 sm:gap-5 sm:p-6">
              <span className="font-display text-[18px] leading-tight text-sage tabular sm:text-[22px]">0{i + 1}</span>
              <div>
                <h2 className="text-[15px] font-medium sm:text-[17px]">{p.title}</h2>
                <p className="mt-1 text-[14px] leading-relaxed text-muted sm:text-[15px]">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-5 text-center sm:mt-16 sm:px-8">
        <h2 className="t-section">Start with a conversation</h2>
        <p className="t-lead mx-auto mt-2 max-w-md">Tell Aqil what you’re looking for. No obligation.</p>
        <div className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-2.5 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3">
          <Link href="/enquire?intent=consultation" className="btn btn-primary !px-3 sm:!px-5">
            <span className="sm:hidden">Consultation</span>
            <span className="max-sm:hidden">Book a consultation</span>
          </Link>
          <Link href="/projects" className="btn btn-ghost !px-3 sm:!px-5">
            <span className="sm:hidden">Developments</span>
            <span className="max-sm:hidden">Browse developments</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
