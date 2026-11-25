import { AlertCircle, Calculator, CalendarDays, ChevronDown, MapPin, Navigation, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { heroTransitionName, ImageBadge, SpotlightBadge } from "@/components/project-card";
import { SaveButton } from "@/components/save-button";
import { UnitExplorer } from "@/components/unit-explorer";
import { WhatsAppFloat, WhatsAppLink } from "@/components/whatsapp";
import { lp, type Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { allProjects, getFaqs, getNearby, getProject, getUnits } from "@/lib/data";
import { formatDate, formatRM, sqftRange } from "@/lib/format";
import { wazeHref } from "@/lib/whatsapp";
import { IMAGES, OG_BY_SLUG } from "@/data/projects";
import { alternates, openGraph } from "@/lib/site";

export function projectStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export function projectMetadata(slug: string, lang: Lang): Metadata {
  const p = getProject(slug, lang);
  if (!p) return {};
  const t = dict(lang).project;
  const title = `${p.name} ${p.productName}`;
  return {
    title,
    description: t.metaDescription(p.productLabel, p.township, p.location, p.tagline),
    alternates: alternates(lang, `/projects/${p.slug}`),
    openGraph: openGraph(OG_BY_SLUG[p.slug] ?? IMAGES.ogDefault, t.ogAlt(title), lang),
    twitter: { card: "summary_large_image" },
  };
}

const NEARBY_SHOWN = 5;

function NearbyRow({ name, meta }: { name: string; meta: string }) {
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-2.5 text-[13.5px] sm:py-3 sm:text-[14px]">
      <span>{name}</span>
      <span className="shrink-0 text-muted">{meta}</span>
    </li>
  );
}

function groupSpecs(specs: { group: string; item: string; value: string }[]) {
  const map = new Map<string, { item: string; value: string }[]>();
  for (const s of specs) map.set(s.group, [...(map.get(s.group) ?? []), { item: s.item, value: s.value }]);
  return [...map.entries()];
}

export function ProjectView({ slug, lang }: { slug: string; lang: Lang }) {
  const project = getProject(slug, lang);
  if (!project) notFound();
  const d = dict(lang);
  const tx = d.project;

  const units = getUnits(slug, lang);
  const faqs = getFaqs(slug, lang);
  const nearby = getNearby(slug, lang);
  const title = `${project.name} ${project.productName}`;
  const t = project.theme;

  const themeVars = { "--p-accent": t.accent } as React.CSSProperties;

  const facts = [
    {
      label: project.showPrice ? project.priceRangeLabel : tx.price,
      value: project.showPrice ? `${formatRM(project.priceMin)} ${d.card.to} ${formatRM(project.priceMax)}` : tx.toReconfirm,
    },
    { label: tx.builtUp, value: sqftRange(project.builtUpMin, project.builtUpMax, lang) },
    { label: tx.lotSize, value: project.lotSize },
    { label: tx.completion, value: project.expectedCompletion.replace(/\s*\(.*\)$/, "") },
  ];

  const L = tx.legal;
  const legal = [
    [L.developer, `${project.developerEntity} · ${project.developerBrand}`],
    [L.licence, project.developerLicense],
    [L.permit, project.advertisingPermit],
    [L.validity, project.advertisingPermitValidity],
    [L.authority, project.approvingAuthority],
    [L.plan, project.buildingPlanRef],
    [L.tenure, project.landTenure],
    [L.encumbrances, project.landEncumbrances ?? L.noEncumbrance],
    [L.restriction, project.restrictionOfInterest],
    [L.units, project.totalUnitsLabel ?? String(project.totalUnits)],
  ];

  return (
    <div style={themeVars} className="-mb-24 pb-24">
      {/* Hero */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden">
        <ViewTransition name={heroTransitionName(project.slug)} share="morph" default="none">
          <div className="absolute inset-0 -z-20">
            <Image src={project.heroImage.url} alt={`${title}: ${project.heroImage.caption}`} fill priority quality={85} sizes="100vw" className="object-cover" />
          </div>
        </ViewTransition>
        {/* Mobile: copy spans the full width, so darken more evenly */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#090e0b_0%,rgba(9,14,11,0.74)_26%,rgba(9,14,11,0.5)_56%,rgba(9,14,11,0.2)_85%)] sm:hidden" />
        {/* Larger screens: lighter overlay so glass buttons show the photo, darker behind the copy on the left */}
        <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(to_top,#090e0b_0%,rgba(9,14,11,0.6)_18%,rgba(9,14,11,0.26)_44%,rgba(9,14,11,0.06)_80%)] sm:block" />
        <div className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_70%_70%_at_0%_80%,rgba(9,14,11,0.62),transparent_70%)] sm:block" />
        <div className="absolute top-[calc(60px+var(--safe-top))] right-4 sm:top-24 sm:right-8">
          <ImageBadge label={project.heroImage.label} lang={lang} />
        </div>
        <div className="hero-copy mx-auto w-full max-w-6xl px-5 pt-32 pb-7 sm:px-8 sm:pt-40 sm:pb-12">
          <nav aria-label="Breadcrumb" className="rise text-[12px] text-muted sm:text-[13px]">
            <Link href={lp(lang, "/projects")} className="hover:text-text">
              {tx.breadcrumb}
            </Link>{" "}
            / {project.township}
          </nav>
          {project.spotlight && (
            <div className="rise mt-3 sm:mt-4">
              <SpotlightBadge label={project.spotlight.label} />
            </div>
          )}
          <div className="rise-2 mt-2.5 flex items-end justify-between gap-4 sm:mt-3">
            <h1 className="font-display text-[34px] leading-[1.05] tracking-[-0.015em] sm:text-[72px]">{project.name}</h1>
            <SaveButton id={project.slug} name={project.name} variant="icon" className="mb-0.5 sm:hidden" />
          </div>
          <p className="rise-2 mt-1 text-[15px] leading-snug text-p-accent sm:text-[24px]">{project.productLabel.replace(/ x /g, "\u00a0x\u00a0")}</p>
          <p className="rise-3 mt-2.5 max-w-xl font-display text-[15px] italic text-muted sm:mt-4 sm:text-[19px]">{project.tagline}</p>
          <div className="rise-3 mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
            <WhatsAppLink
              context="project_overview"
              vars={{ project: project.whatsappProjectLine, location: `${project.location}, ${project.state}` }}
              lang={lang}
              className="btn btn-primary !px-3 sm:!px-5"
            >
              <span className="sm:hidden">{tx.askShort}</span>
              <span className="max-sm:hidden">{tx.askLong}</span>
            </WhatsAppLink>
            <Link href={lp(lang, `/enquire?project=${project.slug}&intent=viewing`)} className="btn btn-ghost !px-3 sm:!px-5">
              <CalendarDays aria-hidden size={17} /> <span className="sm:hidden">{tx.viewingShort}</span>
              <span className="max-sm:hidden">{tx.viewingLong}</span>
            </Link>
            <SaveButton id={project.slug} name={project.name} className="max-sm:hidden" />
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8" aria-label={tx.keyFacts}>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="bg-surface px-4 py-3.5 sm:p-5">
              <dt className="text-[10.5px] tracking-[0.12em] text-muted uppercase sm:text-[12px] sm:tracking-[0.14em]">{f.label}</dt>
              <dd className="mt-1 text-[15px] leading-snug font-medium tabular sm:mt-1.5 sm:text-[19px]">{f.value}</dd>
            </div>
          ))}
        </dl>
        {!project.showPrice ? (
          <div role="note" className="mt-4 flex gap-3 rounded-2xl border border-sage/40 bg-surface p-4 text-[14px]">
            <AlertCircle aria-hidden size={20} className="mt-0.5 shrink-0 text-p-accent" />
            <p>
              <span className="font-medium">{project.salesStatus}.</span> <span className="text-muted">{project.priceNote}</span>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-[12px] leading-relaxed text-muted sm:text-[13px]">
            {project.priceNote} {tx.source}: {project.priceSource}. {tx.lastVerified} {formatDate(project.priceLastVerified, lang)}.
          </p>
        )}
      </section>

      {/* Overview */}
      <section className="mx-auto mt-12 grid max-w-6xl gap-6 px-5 sm:mt-20 sm:gap-10 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" aria-labelledby="overview">
        <div>
          <p className="eyebrow !text-sage">{tx.overview}</p>
          <h2 id="overview" className="t-section mt-2">
            {project.propertyType}
          </h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.65] text-text/90 sm:mt-5 sm:text-[17px]">{project.description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:gap-6">
          <div className="rounded-[20px] border border-line bg-surface p-5 sm:p-6">
            <p className="text-[11px] tracking-[0.14em] text-muted uppercase sm:text-[13px]">{tx.highlights}</p>
            <ul className="mt-3 space-y-2 text-[14px] leading-snug sm:space-y-2.5 sm:text-[15px]">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-emerald sm:mt-2.5 sm:size-1.5" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[20px] border border-line bg-surface p-5 sm:p-6">
            <p className="text-[11px] tracking-[0.14em] text-muted uppercase sm:text-[13px]">
              {tx.facilities} <span className="text-subtle">· {project.facilities.length}</span>
            </p>
            {/* A quiet two column list reads cleaner than a wall of chips */}
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] leading-snug text-text/85 sm:text-[14px]">
              {project.facilities.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden className="mt-[6px] size-1 shrink-0 rounded-full bg-p-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Units */}
      <section className="mx-auto mt-12 sm:mt-20 max-w-6xl px-5 sm:px-8" aria-labelledby="units">
        <p className="eyebrow !text-sage">{tx.homes}</p>
        <h2 id="units" className="t-section mt-2 mb-5 sm:mb-6">
          {tx.unitTypes(units.length)}
        </h2>
        <UnitExplorer project={project} units={units} />
      </section>

      {/* Gallery */}
      {project.gallery.length > 1 && (
        <section className="mx-auto mt-12 sm:mt-20 max-w-6xl px-5 sm:px-8" aria-labelledby="gallery">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="gallery" className="t-section">
              {tx.gallery}
            </h2>
            <p className="text-[13px] text-muted sm:hidden">{tx.photosSwipe(project.gallery.length)}</p>
          </div>
          {/* Phone: a horizontal shelf that peeks the next photo (App Store style) instead of a long stack */}
          <div className="scroll-row -mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0">
            {project.gallery.map((g) => (
              <figure key={g.url} className="w-[84%] shrink-0 snap-center overflow-hidden rounded-[20px] border border-line bg-surface sm:w-auto">
                <div className="relative aspect-[16/10]">
                  <Image src={g.url} alt={g.caption} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <ImageBadge label={g.label} lang={lang} />
                  </div>
                </div>
                <figcaption className="truncate px-4 py-3 text-[13px] text-muted sm:text-[14px]">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Specs */}
      <section className="mx-auto mt-12 sm:mt-20 max-w-6xl px-5 sm:px-8" aria-labelledby="specs">
        <h2 id="specs" className="t-section">
          {tx.specs}
        </h2>
        {/* Grouped and collapsed (progressive disclosure): open only the group you need */}
        <div className="mt-4 grid items-start gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2">
          {groupSpecs(project.specifications).map(([group, rows], i) => (
            <details key={group} open={i === 0} className="group rounded-[20px] border border-line bg-surface">
              <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
                <span>
                  <span className="text-[15px] font-medium">{(tx.specGroups[group] ?? group).replace(/^./, (c) => c.toUpperCase())}</span>
                  <span className="ml-2 text-[13px] text-subtle">{rows.length}</span>
                </span>
                <ChevronDown aria-hidden size={18} className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <dl className="divide-y divide-white/10 border-t border-line px-5 sm:px-6">
                {rows.map((r) => (
                  <div key={r.item} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 py-2.5 text-[13.5px] sm:text-[14px]">
                    <dt className="text-muted">{r.item}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="mx-auto mt-12 sm:mt-20 grid max-w-6xl gap-3 px-5 sm:gap-5 sm:px-8 md:grid-cols-2" aria-labelledby="location">
        <div className="rounded-[20px] border border-line bg-surface p-5 sm:p-8">
          <h2 id="location" className="font-display text-[22px] leading-tight sm:text-[30px]">
            {tx.location}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-[14px] text-muted sm:text-[15px]">
            <MapPin aria-hidden size={16} /> {project.township}, {project.location}, {project.state}
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-text/90 sm:mt-4 sm:text-[15px]">{project.locationAccessNote}</p>
          {/* First few places in view; the rest one tap away */}
          <ul className="mt-4 divide-y divide-white/[0.06] overflow-hidden rounded-xl bg-black/25 sm:mt-5">
            {nearby.slice(0, NEARBY_SHOWN).map((n) => (
              <NearbyRow key={n.name} name={n.name} meta={n.distanceKm ? `${n.distanceKm} km` : d.nearbyCategory[n.category]} />
            ))}
          </ul>
          {nearby.length > NEARBY_SHOWN && (
            <details className="group mt-2">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-[14px] text-p-accent">
                <span className="group-open:hidden">{tx.showMore(nearby.length - NEARBY_SHOWN)}</span>
                <span className="hidden group-open:inline">{tx.showFewer}</span>
                <ChevronDown aria-hidden size={16} className="transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-xl bg-black/25">
                {nearby.slice(NEARBY_SHOWN).map((n) => (
                  <NearbyRow key={n.name} name={n.name} meta={n.distanceKm ? `${n.distanceKm} km` : d.nearbyCategory[n.category]} />
                ))}
              </ul>
            </details>
          )}
          <p className="mt-3 text-[12px] text-muted">{tx.noDistances}</p>
        </div>
        <div className="flex flex-col rounded-[20px] border border-line bg-surface p-5 sm:p-8">
          <p className="text-[11px] tracking-[0.14em] text-muted uppercase sm:text-[13px]">{project.salesGallery.heading ?? tx.salesGallery}</p>
          <h3 className="mt-2 font-display text-[20px] leading-tight sm:text-[26px]">{project.salesGallery.name}</h3>
          <p className="mt-2 text-[14px] sm:mt-3 sm:text-[15px]">{project.salesGallery.address}</p>
          <p className="mt-1.5 text-[13px] text-muted sm:mt-2 sm:text-[14px]">{project.salesGallery.hours}</p>
          <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5 sm:flex sm:flex-wrap sm:gap-3 sm:pt-6">
            <a href={wazeHref(project.salesGallery.wazeQuery)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-3 sm:!px-5">
              <Navigation aria-hidden size={16} /> Waze
            </a>
            <a href={`tel:${project.salesGallery.phone.replace(/\s/g, "")}`} className="btn btn-ghost !px-3 sm:!px-5">
              <Phone aria-hidden size={16} /> <span className="sm:hidden">{tx.call}</span>
              <span className="max-sm:hidden">{project.salesGallery.phone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Plan financing */}
      <section className="mx-auto mt-12 sm:mt-20 max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-[24px] border border-line p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-10" style={{ background: "linear-gradient(135deg, rgba(47,61,51,0.75), rgba(16,23,18,1) 60%, rgba(28,74,55,0.45))" }}>
          <div>
            <h2 className="font-display text-[22px] leading-tight sm:text-[30px]">{tx.planTitle}</h2>
            <p className="mt-1.5 max-w-lg text-[14px] text-muted sm:mt-2 sm:text-[15px]">{tx.planBody(title, project.showPrice ? formatRM(project.priceMin) : "")}</p>
          </div>
          <Link
            href={lp(lang, project.showPrice ? `/calculator?project=${project.slug}&price=${project.priceMin}` : `/calculator?project=${project.slug}`)}
            className="btn btn-primary"
          >
            <Calculator aria-hidden size={17} /> {tx.planCta}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mx-auto mt-12 sm:mt-20 max-w-3xl px-5 sm:px-8" aria-labelledby="faq">
          <h2 id="faq" className="t-section">
            {tx.faq}
          </h2>
          <div className="mt-4 divide-y divide-white/10 rounded-[20px] border border-line bg-surface sm:mt-6">
            {faqs.map((f) => (
              <details key={f.question} className="group px-5 sm:px-6">
                <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-[15px] font-medium sm:min-h-14 sm:py-4 sm:text-[16px]">
                  {f.question}
                  <span aria-hidden className="text-[22px] text-p-accent transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-4 text-[14px] leading-relaxed text-muted sm:pb-5 sm:text-[15px]">
                  {f.answer} <span className="text-[12px]">({f.source})</span>
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Particulars */}
      <section className="mx-auto mt-12 sm:mt-20 max-w-6xl px-5 sm:px-8" aria-labelledby="particulars">
        <details className="rounded-[20px] border border-line bg-surface">
          <summary id="particulars" className="flex min-h-13 cursor-pointer list-none items-center justify-between px-5 py-3.5 text-[15px] font-medium sm:min-h-14 sm:px-6 sm:py-4 sm:text-[16px]">
            {tx.particulars}
            <span aria-hidden className="text-p-accent">
              {tx.view}
            </span>
          </summary>
          <dl className="divide-y divide-white/10 border-t border-line px-5 sm:px-6">
            {legal.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 text-[14px] sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </details>
        <p className="mt-6 text-[12px] leading-relaxed text-muted">
          {project.disclaimer} {tx.contentSource}: {project.dataSource}. {tx.lastUpdated} {formatDate(project.contentLastUpdated, lang)}.
        </p>
      </section>

      <WhatsAppFloat
        context="project_overview"
        vars={{ project: project.whatsappProjectLine, location: `${project.location}, ${project.state}` }}
      />
    </div>
  );
}
