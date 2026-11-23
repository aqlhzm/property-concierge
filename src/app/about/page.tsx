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
        <div aria-hidden className="absolute inset-0 -z-20 backdrop-blur-[4px] [mask-image:linear-gradient(to_top,black_58%,transparent_76%)] md:[mask-image:linear-gradient(to_top,black_50%,transparent_68%)]" />
        <div aria-hidden className="absolute inset-0 -z-20 backdrop-blur-[12px] [mask-image:linear-gradient(to_top,black_48%,transparent_66%)] md:[mask-image:linear-gradient(to_top,black_40%,transparent_58%)]" />
        <div aria-hidden className="absolute inset-0 -z-20 backdrop-blur-[28px] saturate-[1.15] [mask-image:linear-gradient(to_top,black_36%,transparent_56%)] md:[mask-image:linear-gradient(to_top,black_28%,transparent_48%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(9,20,15,0.8)_0%,rgba(12,28,21,0.62)_34%,rgba(12,28,21,0.36)_54%,rgba(12,28,21,0.1)_68%,transparent_78%)] md:bg-[linear-gradient(to_top,rgba(9,20,15,0.82)_0%,rgba(12,28,21,0.62)_30%,rgba(12,28,21,0.34)_50%,rgba(12,28,21,0.08)_64%,transparent_72%)]" />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="mx-auto w-full max-w-[460px] px-5 pb-[calc(88px+env(safe-area-inset-bottom))] text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_4px_24px_rgba(0,0,0,0.4)] md:max-w-[520px] md:pb-10">
          <h1 className="rise text-[40px] leading-[1.05] font-bold tracking-tight text-white sm:text-[48px] md:text-[56px]">{site.consultantName}</h1>
          <p className="rise-2 mt-2 text-[15px] text-white/80">{site.consultantTitle}</p>
          <p className="rise-2 font-signature text-[26px] leading-tight text-sage-text md:text-[28px]">{site.brandSignature}</p>
          <p className="rise-2 text-[14px] text-white/70">{site.serviceAreas.join(", ")}</p>

          {/* Segmented glass control, first segment active (white) as in the reference */}
          <nav aria-label="Contact Aqil" className="glass-photo rise-3 mx-auto mt-6 grid max-w-[440px] grid-cols-3 gap-1 rounded-full p-1">
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

          {/* Glass card: seated full-length portrait beside the consultant's approach */}
          <div className="glass-photo rise-3 mx-auto mt-3 grid max-w-[520px] grid-cols-[104px_1fr] items-center gap-4 rounded-[26px] p-3 pr-5 text-left md:grid-cols-[124px_1fr] md:gap-5">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[18px] shadow-[0_10px_28px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/25">
              <Image
                src={site.consultantSeated}
                alt={`${site.consultantName} seated in a brown suit`}
                fill
                quality={90}
                sizes="(min-width: 768px) 124px, 104px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[12px] font-medium tracking-[0.08em] text-sage-text uppercase">Your consultant</p>
              <p className="mt-0.5 text-[17px] font-semibold text-white">{site.consultantName}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/85 md:text-[14px]">{site.serviceApproach}</p>
            </div>
          </div>

          <a
            href="#more"
            className="glass-photo rise-3 mx-auto mt-4 inline-flex min-h-9 items-center gap-2 rounded-full py-1 pr-1.5 pl-3.5 text-[12px] text-white/90"
          >
            Scroll down to learn more
            <span className="grid size-6 place-items-center rounded-full bg-white/90 text-[#0b1a13]">
              <ChevronDown aria-hidden size={14} />
            </span>
          </a>
        </div>
      </section>

      <section id="more" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-14 sm:px-8">
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
