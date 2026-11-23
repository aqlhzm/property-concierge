import { ArrowUpRight, BedDouble, Bath, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ImageLabel, Project } from "@/data/types";
import { formatRMShort, sqftRange } from "@/lib/format";

export function ImageBadge({ label }: { label: ImageLabel }) {
  return (
    <span className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/85 backdrop-blur-sm">
      {label}
    </span>
  );
}

export function PriceLine({ project, className = "" }: { project: Project; className?: string }) {
  if (!project.showPrice) {
    return <span className={className}>Pricing to be reconfirmed</span>;
  }
  return (
    <span className={`tabular ${className}`}>
      {formatRMShort(project.priceMin)} – {formatRMShort(project.priceMax)}
    </span>
  );
}

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group card relative flex flex-col overflow-hidden transition-[transform,border-color] duration-300 ease-apple hover:-translate-y-1 hover:border-line-strong"
      style={{ ["--card-accent" as string]: project.theme.primary }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.heroImage.url}
          alt={`${project.name} ${project.productName} — ${project.heroImage.caption}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-apple group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute top-3 left-3">
          <ImageBadge label={project.heroImage.label} />
        </div>
        <div className="absolute right-4 bottom-4 left-4">
          <p className="text-[12px] tracking-[0.18em] text-white/75 uppercase">
            {project.township} · {project.location}
          </p>
          <h3 className="mt-1 font-display text-[26px] leading-tight text-white">{project.name}</h3>
          <p className="text-[15px]" style={{ color: project.theme.accent }}>
            {project.productName}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <dl className="grid grid-cols-3 gap-2 text-[13px] text-muted">
          <div className="flex items-center gap-1.5">
            <BedDouble aria-hidden size={16} />
            <dt className="sr-only">Bedrooms</dt>
            <dd>{project.bedrooms} bed</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath aria-hidden size={16} />
            <dt className="sr-only">Bathrooms</dt>
            <dd>{project.bathrooms} bath</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler aria-hidden size={16} />
            <dt className="sr-only">Lot size</dt>
            <dd>{project.lotSize}</dd>
          </div>
        </dl>
        <p className="text-[14px] text-muted">{sqftRange(project.builtUpMin, project.builtUpMax)} built-up</p>
        <div className="mt-auto flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="text-[12px] text-subtle">{project.showPrice ? "Permit price range" : project.salesStatus}</p>
            <PriceLine project={project} className="text-[17px] font-medium text-text" />
          </div>
          <span className="grid size-10 place-items-center rounded-full border border-line-strong text-muted transition-colors duration-200 group-hover:border-transparent group-hover:bg-emerald group-hover:text-on-emerald">
            <ArrowUpRight aria-hidden size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
