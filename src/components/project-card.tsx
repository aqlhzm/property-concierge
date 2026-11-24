import { ArrowRight, ArrowUpRight, Bath, BedDouble, Flame, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { ImageLabel, Project } from "@/data/types";
import { formatRMShort, sqftRange } from "@/lib/format";

export function ImageBadge({ label }: { label: ImageLabel }) {
  return (
    <span className="glass-photo inline-block rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/90">{label}</span>
  );
}

export function PriceLine({ project, className = "" }: { project: Project; className?: string }) {
  if (!project.showPrice) {
    return <span className={className}>Pricing to be reconfirmed</span>;
  }
  return (
    <span className={`tabular ${className}`}>
      {formatRMShort(project.priceMin)} to {formatRMShort(project.priceMax)}
    </span>
  );
}

/** Shared-element name: the card image morphs into the project hero on navigation. */
export const heroTransitionName = (slug: string) => `hero-${slug}`;

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group card card-press relative flex flex-col overflow-hidden hover:border-line-strong"
      aria-label={`${project.name} ${project.productName}, ${project.location}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ViewTransition name={heroTransitionName(project.slug)} share="morph" default="none">
          <div className="absolute inset-0">
            <Image
              src={project.heroImage.url}
              alt={`${project.name} ${project.productName}: ${project.heroImage.caption}`}
              fill
              quality={85}
              sizes="(min-width: 1280px) 384px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-apple group-hover:scale-[1.05]"
            />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.32)_34%,rgba(0,0,0,0)_62%),linear-gradient(to_bottom,rgba(0,0,0,0.18),transparent_22%)]" />
        <span className="sheen" aria-hidden />

        <div className="absolute top-3 left-3">
          <ImageBadge label={project.heroImage.label} />
        </div>
        <span
          aria-hidden
          className="glass-photo absolute top-3 right-3 grid size-10 place-items-center rounded-full text-white transition-[transform,background-color] duration-300 ease-spring group-hover:rotate-45 group-hover:bg-[rgba(70,170,130,0.55)]"
        >
          <ArrowUpRight size={18} />
        </span>

        {/* Liquid Glass title panel, contained at the bottom of the image */}
        <div className="glass-photo glass-clear absolute inset-x-3 bottom-3 rounded-[18px] px-4 py-3 transition-transform duration-500 ease-spring group-hover:-translate-y-1">
          <p className="truncate text-[11px] font-medium tracking-[0.16em] text-[#e3e9e3] uppercase">
            {project.township} · {project.location}
          </p>
          <h3 className="mt-0.5 font-display text-[24px] leading-tight text-white">{project.name}</h3>
          <p className="text-[14px] font-medium" style={{ color: project.theme.accent }}>
            {project.productName}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <dl className="grid grid-cols-3 gap-2 text-[13px] text-muted">
          <div className="flex items-center gap-1.5">
            <BedDouble aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">Bedrooms</dt>
            <dd>{project.bedrooms} bed</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">Bathrooms</dt>
            <dd>{project.bathrooms} bath</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">Lot size</dt>
            <dd>{project.lotSize}</dd>
          </div>
        </dl>
        <p className="text-[14px] text-muted">{sqftRange(project.builtUpMin, project.builtUpMax)} built up</p>
        <div className="mt-auto border-t border-line pt-4">
          <p className="text-[12px] text-subtle">{project.showPrice ? project.priceRangeLabel : "Availability and pricing"}</p>
          <PriceLine project={project} className="text-[17px] font-medium text-text" />
        </div>
      </div>
    </Link>
  );
}

export function SpotlightBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#f2b35b,#e0763d)] px-3 py-1 text-[12px] font-semibold tracking-wide text-[#1d1208] shadow-[0_6px_20px_-6px_rgba(224,118,61,0.65)]">
      <Flame aria-hidden size={14} strokeWidth={2.4} />
      {label}
    </span>
  );
}

/** Wide card for the spotlight development, at the top of listings. */
export function FeaturedProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const spotlight = project.spotlight;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group card card-press relative grid overflow-hidden hover:border-line-strong lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      aria-label={`${project.name} ${project.productName}, ${project.township}${spotlight ? `, ${spotlight.label}` : ""}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:min-h-[440px]">
        <ViewTransition name={heroTransitionName(project.slug)} share="morph" default="none">
          <div className="absolute inset-0">
            <Image
              src={project.heroImage.url}
              alt={`${project.name} ${project.productName}: ${project.heroImage.caption}`}
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
          <ImageBadge label={project.heroImage.label} />
        </div>
      </div>

      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div>
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
            {project.township} · {project.location} · {project.state}
          </p>
          <h3 className="mt-1.5 font-display text-[34px] leading-[1.05] sm:text-[40px]">{project.name}</h3>
          <p className="mt-1 text-[15px] font-medium" style={{ color: project.theme.accent }}>
            {project.productName} · {project.lotSize}
          </p>
        </div>
        {spotlight && (
          <ul className="space-y-2.5 text-[15px]">
            {spotlight.reasons.map((r) => (
              <li key={r} className="flex gap-3">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-emerald" />
                {r}
              </li>
            ))}
          </ul>
        )}
        <dl className="grid grid-cols-3 gap-2 text-[13px] text-muted">
          <div className="flex items-center gap-1.5">
            <BedDouble aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">Bedrooms</dt>
            <dd>{project.bedrooms} bed</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">Bathrooms</dt>
            <dd>{project.bathrooms} bath</dd>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Ruler aria-hidden size={16} className="text-sage" />
            <dt className="sr-only">Built up</dt>
            <dd>{sqftRange(project.builtUpMin, project.builtUpMax)}</dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <p className="text-[12px] text-subtle">{project.showPrice ? project.priceRangeLabel : "Availability and pricing"}</p>
            <PriceLine project={project} className="text-[19px] font-medium text-text" />
          </div>
          <span className="btn btn-primary !min-h-11 !px-5 text-[14px]">
            Explore {project.name} <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Listing grid: the spotlight development (if it leads the list) as a wide card, the rest three across. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [first, ...rest] = projects;
  if (!first) return null;
  const lead = first.spotlight ? first : null;
  const others = lead ? rest : projects;
  return (
    <div className="flex flex-col gap-5">
      {lead && <FeaturedProjectCard project={lead} priority />}
      {others.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {others.map((p, i) => (
            <ProjectCard key={p.slug} project={p} priority={!lead && i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
