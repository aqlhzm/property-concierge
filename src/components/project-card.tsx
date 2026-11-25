import { ArrowRight, ArrowUpRight, Bath, BedDouble, Flame, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { ImageLabel, Project } from "@/data/types";
import { lp, type Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { formatRMShort, sqftRange } from "@/lib/format";

export function ImageBadge({ label, lang = "en" }: { label: ImageLabel; lang?: Lang }) {
  return (
    <span className="inline-block rounded-full border border-white/10 bg-black/35 px-2 py-[2px] text-[10px] font-medium tracking-[0.02em] text-white/80 backdrop-blur-md sm:px-2.5 sm:py-[3px] sm:text-[11px]">
      {dict(lang).imageLabel[label]}
    </span>
  );
}

export function PriceLine({ project, className = "", lang = "en" }: { project: Project; className?: string; lang?: Lang }) {
  const t = dict(lang).card;
  if (!project.showPrice) {
    return <span className={className}>{t.toReconfirm}</span>;
  }
  return (
    <span className={`tabular ${className}`}>
      {formatRMShort(project.priceMin, lang)} {t.to} {formatRMShort(project.priceMax, lang)}
    </span>
  );
}

/** Shared-element name: the card image morphs into the project hero on navigation. */
export const heroTransitionName = (slug: string) => `hero-${slug}`;

/** Image shown on listing cards (falls back to the hero). */
export const cardImage = (p: Project) => p.cardImage ?? p.heroImage;

/** Only morph card to hero when they are the same picture; a different picture just navigates. */
const cardMorphName = (p: Project) => (cardImage(p).url === p.heroImage.url ? heroTransitionName(p.slug) : undefined);

export function ProjectCard({ project, priority = false, lang = "en" }: { project: Project; priority?: boolean; lang?: Lang }) {
  const t = dict(lang).card;
  return (
    <Link
      href={lp(lang, `/projects/${project.slug}`)}
      className="group card card-press relative flex flex-col overflow-hidden hover:border-line-strong"
      aria-label={`${project.name} ${project.productName}, ${project.location}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ViewTransition name={cardMorphName(project)} share="morph" default="none">
          <div className="absolute inset-0">
            <Image
              src={cardImage(project).url}
              alt={`${project.name} ${project.productName}: ${cardImage(project).caption}`}
              fill
              quality={85}
              sizes="(min-width: 1280px) 384px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-apple group-hover:scale-[1.05]"
            />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.38)_32%,rgba(0,0,0,0)_58%),linear-gradient(to_bottom,rgba(0,0,0,0.2),transparent_24%)]" />
        <span className="sheen" aria-hidden />

        <div className="absolute top-3 left-3">
          <ImageBadge label={cardImage(project).label} lang={lang} />
        </div>
        {/* The whole card is the button; the arrow only appears where there is a pointer to hover with */}
        <span
          aria-hidden
          className="glass-photo absolute top-3 right-3 hidden size-10 place-items-center rounded-full text-white transition-[transform,background-color] duration-300 ease-spring group-hover:rotate-45 group-hover:bg-[rgba(70,170,130,0.55)] sm:grid"
        >
          <ArrowUpRight size={18} />
        </span>

        {/* Title sits on the photo's own scrim (content layer: no glass panel) */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3.5 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-spring group-hover:-translate-y-1 sm:px-5 sm:pb-4">
          <p className="truncate text-[10.5px] font-medium tracking-[0.14em] text-white/75 uppercase sm:text-[11px]">
            {project.township} · {project.location}
          </p>
          <h3 className="mt-0.5 font-display text-[22px] leading-tight text-white sm:text-[24px]">{project.name}</h3>
          <p className="text-[13.5px] font-medium sm:text-[14px]" style={{ color: project.theme.accent }}>
            {project.productName}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:gap-4 sm:p-5">
        <dl className="grid grid-cols-3 gap-2 text-[13px] text-muted">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <BedDouble aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">{t.bedrooms}</dt>
            <dd>
              {project.bedrooms} {t.bed}
            </dd>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Bath aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">{t.bathrooms}</dt>
            <dd>
              {project.bathrooms} {t.bath}
            </dd>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Ruler aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">{t.lotSize}</dt>
            <dd>{project.lotSize}</dd>
          </div>
        </dl>
        <p className="text-[13px] text-muted sm:text-[14px]">
          {lang === "ms" ? `${t.builtUp} ${sqftRange(project.builtUpMin, project.builtUpMax, lang)}` : `${sqftRange(project.builtUpMin, project.builtUpMax)} ${t.builtUpSuffix}`}
        </p>
        <div className="mt-auto border-t border-line pt-3 sm:pt-4">
          <p className="text-[12px] text-subtle">{project.showPrice ? project.priceRangeLabel : t.availability}</p>
          <PriceLine project={project} lang={lang} className="text-[16px] font-medium text-text sm:text-[17px]" />
        </div>
      </div>
    </Link>
  );
}

export function SpotlightBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#f2b35b,#e0763d)] px-2.5 py-[3px] text-[11px] font-semibold tracking-wide text-[#1d1208] shadow-[0_6px_20px_-6px_rgba(224,118,61,0.65)] sm:px-3 sm:py-1 sm:text-[12px]">
      <Flame aria-hidden size={13} strokeWidth={2.4} />
      {label}
    </span>
  );
}

/** Wide card for the spotlight development, at the top of listings. */
export function FeaturedProjectCard({ project, priority = false, lang = "en" }: { project: Project; priority?: boolean; lang?: Lang }) {
  const spotlight = project.spotlight;
  const t = dict(lang).card;
  return (
    <Link
      href={lp(lang, `/projects/${project.slug}`)}
      className="group card card-press relative grid overflow-hidden hover:border-line-strong lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      aria-label={`${project.name} ${project.productName}, ${project.township}${spotlight ? `, ${spotlight.label}` : ""}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:min-h-[440px]">
        <ViewTransition name={cardMorphName(project)} share="morph" default="none">
          <div className="absolute inset-0">
            <Image
              src={cardImage(project).url}
              alt={`${project.name} ${project.productName}: ${cardImage(project).caption}`}
              fill
              quality={85}
              sizes="(min-width: 1280px) 680px, (min-width: 1024px) 58vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-apple group-hover:scale-[1.04]"
            />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.28),transparent_30%)]" />
        <span className="sheen" aria-hidden />
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          {spotlight && <SpotlightBadge label={spotlight.label} />}
          <ImageBadge label={cardImage(project).label} lang={lang} />
        </div>
      </div>

      <div className="flex flex-col gap-3.5 p-4 sm:gap-5 sm:p-8">
        <div>
          <p className="text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase sm:text-[11px] sm:tracking-[0.16em]">
            {project.township} · {project.location} · {project.state}
          </p>
          <h3 className="mt-1 font-display text-[26px] leading-[1.08] sm:mt-1.5 sm:text-[40px]">{project.name}</h3>
          <p className="mt-0.5 text-[14px] font-medium sm:mt-1 sm:text-[15px]" style={{ color: project.theme.accent }}>
            {project.productName} · {project.lotSize}
          </p>
        </div>
        {spotlight && (
          <ul className="space-y-1.5 text-[14px] leading-snug text-text/85 sm:space-y-2.5 sm:text-[15px]">
            {spotlight.reasons.map((r) => (
              <li key={r} className="flex gap-3">
                <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-emerald sm:size-1.5" />
                {r}
              </li>
            ))}
          </ul>
        )}
        <dl className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-muted">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <BedDouble aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">{t.bedrooms}</dt>
            <dd>
              {project.bedrooms} {t.bed}
            </dd>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Bath aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">{t.bathrooms}</dt>
            <dd>
              {project.bathrooms} {t.bath}
            </dd>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Ruler aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">{t.builtUp}</dt>
            <dd>{sqftRange(project.builtUpMin, project.builtUpMax, lang)}</dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-line pt-3 sm:pt-5">
          <div className="min-w-0">
            <p className="text-[12px] text-subtle">{project.showPrice ? project.priceRangeLabel : t.availability}</p>
            <PriceLine project={project} lang={lang} className="text-[16px] font-medium text-text sm:text-[19px]" />
          </div>
          {/* One line, never squeezed by the price beside it */}
          <span className="btn btn-primary !min-h-11 shrink-0 gap-2 !pr-4 !pl-5 text-[14px] leading-none whitespace-nowrap max-sm:hidden">
            {t.explore(project.name)}
            <ArrowRight aria-hidden size={16} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span aria-hidden className="btn btn-primary !min-h-9 !min-w-9 !px-0 sm:hidden">
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Listing grid: the spotlight development (if it leads the list) as a wide card, the rest three across. */
export function ProjectGrid({ projects, lang = "en" }: { projects: Project[]; lang?: Lang }) {
  const [first, ...rest] = projects;
  if (!first) return null;
  const lead = first.spotlight ? first : null;
  const others = lead ? rest : projects;
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {lead && <FeaturedProjectCard project={lead} priority lang={lang} />}
      {others.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
          {others.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={!lead && i === 0} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
