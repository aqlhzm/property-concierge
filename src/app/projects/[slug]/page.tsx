import { AlertCircle, Calculator, CalendarDays, MapPin, Navigation, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageBadge } from "@/components/project-card";
import { UnitExplorer } from "@/components/unit-explorer";
import { WhatsAppFloat, WhatsAppLink } from "@/components/whatsapp";
import { allProjects, getFaqs, getNearby, getProject, getUnits } from "@/lib/data";
import { formatDate, formatRM, sqftRange } from "@/lib/format";
import { wazeHref } from "@/lib/whatsapp";

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} ${p.productName}`,
    description: `${p.productLabel} at ${p.township}, ${p.location}. ${p.tagline}`,
    openGraph: { images: [{ url: p.heroImage.url }] },
  };
}

function groupSpecs(specs: { group: string; item: string; value: string }[]) {
  const map = new Map<string, { item: string; value: string }[]>();
  for (const s of specs) map.set(s.group, [...(map.get(s.group) ?? []), { item: s.item, value: s.value }]);
  return [...map.entries()];
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const units = getUnits(slug);
  const faqs = getFaqs(slug);
  const nearby = getNearby(slug);
  const title = `${project.name} ${project.productName}`;
  const t = project.theme;

  const themeVars = {
    "--p-bg": t.background,
    "--p-surface": t.surface,
    "--p-primary": t.primary,
    "--p-accent": t.accent,
    "--p-secondary": t.secondary,
    "--p-text": t.text,
    "--p-muted": t.muted,
    background: t.background,
    color: t.text,
  } as React.CSSProperties;

  const facts = [
    { label: project.showPrice ? "Permit price range" : "Price", value: project.showPrice ? `${formatRM(project.priceMin)} – ${formatRM(project.priceMax)}` : "To be reconfirmed" },
    { label: "Built-up", value: sqftRange(project.builtUpMin, project.builtUpMax) },
    { label: "Lot size", value: project.lotSize },
    { label: "Expected completion", value: project.expectedCompletion.replace(/\s*\(.*\)$/, "") },
  ];

  const legal = [
    ["Developer", `${project.developerEntity} · ${project.developerBrand}`],
    ["Developer licence", project.developerLicense],
    ["Advertising & sales permit", project.advertisingPermit],
    ["Permit validity", project.advertisingPermitValidity],
    ["Approving authority", project.approvingAuthority],
    ["Building plan reference", project.buildingPlanRef],
    ["Land tenure", project.landTenure],
    ["Land encumbrances", project.landEncumbrances ?? "None stated in brochure"],
    ["Restriction in interest", project.restrictionOfInterest],
    ["Total units", String(project.totalUnits)],
  ];

  return (
    <div style={themeVars} className="-mb-24 pb-24">
      {/* Hero */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden">
        <Image src={project.heroImage.url} alt={`${title} — ${project.heroImage.caption}`} fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(to top, ${t.background} 4%, ${t.background}cc 38%, transparent 80%)` }} />
        <div className="absolute top-24 right-4 sm:right-8">
          <ImageBadge label={project.heroImage.label} />
        </div>
        <div className="mx-auto w-full max-w-6xl px-5 pt-40 pb-12 sm:px-8">
          <nav aria-label="Breadcrumb" className="rise text-[13px] text-p-muted">
            <Link href="/projects" className="hover:text-p-text">
              Developments
            </Link>{" "}
            / {project.township}
          </nav>
          <h1 className="rise-2 mt-3 font-display text-[48px] leading-[1.02] sm:text-[72px]">{project.name}</h1>
          <p className="rise-2 mt-1 text-[20px] text-p-accent sm:text-[24px]">{project.productLabel.replace(/ x /g, "\u00a0x\u00a0")}</p>
          <p className="rise-3 mt-4 max-w-xl font-display text-[19px] italic text-p-muted">{project.tagline}</p>
          <div className="rise-3 mt-8 flex flex-wrap gap-3">
            <WhatsAppLink
              context="project_overview"
              vars={{ project: project.whatsappProjectLine, location: `${project.location}, ${project.state}` }}
              className="btn bg-p-primary text-black hover:opacity-90"
            >
              Ask Aqil about this project
            </WhatsAppLink>
            <Link href={`/enquire?project=${project.slug}&intent=viewing`} className="btn border border-white/20 bg-black/20 backdrop-blur-sm hover:bg-white/10">
              <CalendarDays aria-hidden size={17} /> Arrange a viewing
            </Link>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8" aria-label="Key facts">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-white/10 bg-white/10 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="bg-p-surface p-5">
              <dt className="text-[12px] tracking-[0.14em] text-p-muted uppercase">{f.label}</dt>
              <dd className="mt-1.5 text-[17px] font-medium tabular sm:text-[19px]">{f.value}</dd>
            </div>
          ))}
        </dl>
        {!project.showPrice ? (
          <div role="note" className="mt-4 flex gap-3 rounded-2xl border border-p-accent/40 bg-p-surface p-4 text-[14px]">
            <AlertCircle aria-hidden size={20} className="mt-0.5 shrink-0 text-p-accent" />
            <p>
              <span className="font-medium">{project.salesStatus}.</span> <span className="text-p-muted">{project.priceNote}</span>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-[13px] leading-relaxed text-p-muted">
            {project.priceNote} Source: {project.priceSource}. Last verified {formatDate(project.priceLastVerified)}.
          </p>
        )}
      </section>

      {/* Overview */}
      <section className="mx-auto mt-20 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" aria-labelledby="overview">
        <div>
          <p className="eyebrow !text-p-muted">Overview</p>
          <h2 id="overview" className="mt-2 font-display text-[34px] leading-tight">
            {project.propertyType}
          </h2>
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed">{project.description}</p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-[20px] border border-white/10 bg-p-surface p-6">
            <p className="text-[13px] tracking-[0.14em] text-p-muted uppercase">Highlights</p>
            <ul className="mt-3 space-y-2.5 text-[15px]">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-p-primary" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-p-surface p-6">
            <p className="text-[13px] tracking-[0.14em] text-p-muted uppercase">Facilities in brochure</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.facilities.map((f) => (
                <li key={f} className="rounded-full bg-black/25 px-3 py-1.5 text-[13px]">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Units */}
      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8" aria-labelledby="units">
        <p className="eyebrow !text-p-muted">Homes</p>
        <h2 id="units" className="mt-2 mb-6 font-display text-[34px] leading-tight">
          {units.length} unit types
        </h2>
        <UnitExplorer project={project} units={units} />
      </section>

      {/* Gallery */}
      {project.gallery.length > 1 && (
        <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8" aria-labelledby="gallery">
          <h2 id="gallery" className="font-display text-[34px] leading-tight">
            Gallery
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((g) => (
              <figure key={g.url} className="overflow-hidden rounded-[20px] border border-white/10 bg-p-surface">
                <div className="relative aspect-[16/10]">
                  <Image src={g.url} alt={g.caption} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <ImageBadge label={g.label} />
                  </div>
                </div>
                <figcaption className="px-4 py-3 text-[14px] text-p-muted">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Specs */}
      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8" aria-labelledby="specs">
        <h2 id="specs" className="font-display text-[34px] leading-tight">
          Specifications
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {groupSpecs(project.specifications).map(([group, rows]) => (
            <div key={group} className="rounded-[20px] border border-white/10 bg-p-surface p-6">
              <h3 className="text-[13px] tracking-[0.14em] text-p-muted uppercase">{group}</h3>
              <dl className="mt-3 divide-y divide-white/10">
                {rows.map((r) => (
                  <div key={r.item} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 py-2.5 text-[14px]">
                    <dt className="text-p-muted">{r.item}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="mx-auto mt-20 grid max-w-6xl gap-5 px-5 sm:px-8 md:grid-cols-2" aria-labelledby="location">
        <div className="rounded-[20px] border border-white/10 bg-p-surface p-6 sm:p-8">
          <h2 id="location" className="font-display text-[30px] leading-tight">
            Location & access
          </h2>
          <p className="mt-2 flex items-center gap-2 text-[15px] text-p-muted">
            <MapPin aria-hidden size={16} /> {project.township}, {project.location}, {project.state}
          </p>
          <p className="mt-4 text-[15px]">{project.locationAccessNote}</p>
          <ul className="mt-5 space-y-2">
            {nearby.map((n) => (
              <li key={n.name} className="flex items-center justify-between rounded-xl bg-black/25 px-4 py-3 text-[14px]">
                <span>{n.name}</span>
                <span className="text-p-muted">{n.distanceKm ? `${n.distanceKm} km` : n.category}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-p-muted">Distances are not stated in the brochure.</p>
        </div>
        <div className="flex flex-col rounded-[20px] border border-white/10 bg-p-surface p-6 sm:p-8">
          <p className="text-[13px] tracking-[0.14em] text-p-muted uppercase">Sales gallery</p>
          <h3 className="mt-2 font-display text-[26px] leading-tight">{project.salesGallery.name}</h3>
          <p className="mt-3 text-[15px]">{project.salesGallery.address}</p>
          <p className="mt-2 text-[14px] text-p-muted">{project.salesGallery.hours}</p>
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <a href={wazeHref(project.salesGallery.wazeQuery)} target="_blank" rel="noopener noreferrer" className="btn border border-white/15 hover:bg-white/5">
              <Navigation aria-hidden size={17} /> Open in Waze
            </a>
            <a href={`tel:${project.salesGallery.phone.replace(/\s/g, "")}`} className="btn border border-white/15 hover:bg-white/5">
              <Phone aria-hidden size={17} /> {project.salesGallery.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Plan financing */}
      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[24px] border border-white/10 p-7 sm:flex-row sm:items-center sm:p-10" style={{ background: `linear-gradient(135deg, ${t.secondary}55, ${t.surface})` }}>
          <div>
            <h2 className="font-display text-[30px] leading-tight">Plan your financing</h2>
            <p className="mt-2 max-w-lg text-[15px] text-p-muted">
              Estimate the monthly instalment for {title}
              {project.showPrice ? ` from ${formatRM(project.priceMin)}` : ""}. Planning estimates only.
            </p>
          </div>
          <Link
            href={project.showPrice ? `/calculator?project=${project.slug}&price=${project.priceMin}` : `/calculator?project=${project.slug}`}
            className="btn bg-p-primary text-black hover:opacity-90"
          >
            <Calculator aria-hidden size={17} /> Open financial planner
          </Link>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mx-auto mt-20 max-w-3xl px-5 sm:px-8" aria-labelledby="faq">
          <h2 id="faq" className="font-display text-[34px] leading-tight">
            Questions buyers ask
          </h2>
          <div className="mt-6 divide-y divide-white/10 rounded-[20px] border border-white/10 bg-p-surface">
            {faqs.map((f) => (
              <details key={f.question} className="group px-5 sm:px-6">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-medium">
                  {f.question}
                  <span aria-hidden className="text-[22px] text-p-accent transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-5 text-[15px] text-p-muted">
                  {f.answer} <span className="text-[12px]">({f.source})</span>
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Particulars */}
      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8" aria-labelledby="particulars">
        <details className="rounded-[20px] border border-white/10 bg-p-surface">
          <summary id="particulars" className="flex min-h-14 cursor-pointer list-none items-center justify-between px-6 py-4 text-[16px] font-medium">
            Developer & legal particulars
            <span aria-hidden className="text-p-accent">
              View
            </span>
          </summary>
          <dl className="divide-y divide-white/10 border-t border-white/10 px-6">
            {legal.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 text-[14px] sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6">
                <dt className="text-p-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </details>
        <p className="mt-6 text-[12px] leading-relaxed text-p-muted">
          {project.disclaimer} Content source: {project.dataSource}. Last updated {formatDate(project.contentLastUpdated)}.
        </p>
      </section>

      <WhatsAppFloat
        context="project_overview"
        vars={{ project: project.whatsappProjectLine, location: `${project.location}, ${project.state}` }}
      />
    </div>
  );
}
