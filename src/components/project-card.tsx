import { ArrowUpRight, Bath, BedDouble, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { ImageLabel, Project } from "@/data/types";
import { formatRMShort, sqftRange } from "@/lib/format";

export function ImageBadge({ label }: { label: ImageLabel }) {
  return (
    <span className="glass-photo rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/90">{label}</span>
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
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-apple group-hover:scale-[1.05]"
            />
          </div>
        </ViewTransition>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        <span className="sheen" aria-hidden />

        <div className="absolute top-3 left-3">
          <ImageBadge label={project.heroImage.label} />
        </div>
        <span
          aria-hidden
          className="glass-photo absolute top-3 right-3 grid size-10 place-items-center rounded-full text-white transition-[transform,background-color] duration-300 ease-spring group-hover:rotate-45 group-hover:bg-[#7bb9a2] group-hover:text-[#06231a]"
        >
          <ArrowUpRight size={18} />
        </span>

        {/* Liquid Glass title panel, contained at the bottom of the image */}
        <div className="glass-photo absolute inset-x-3 bottom-3 rounded-[18px] px-4 py-3 transition-transform duration-500 ease-spring group-hover:-translate-y-1">
          <p className="truncate text-[11px] font-medium tracking-[0.16em] text-[#d5ddd6] uppercase">
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
          <p className="text-[12px] text-subtle">{project.showPrice ? "Permit price range" : "Availability and pricing"}</p>
          <PriceLine project={project} className="text-[17px] font-medium text-text" />
        </div>
      </div>
    </Link>
  );
}
