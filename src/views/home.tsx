import { ArrowRight, Calculator, ChevronRight, GitCompareArrows } from "lucide-react";
import Link from "next/link";
import { site } from "@/data/content";
import { lp, type Lang } from "@/i18n/config";
import { dict } from "@/i18n/dict";
import { HERO_SLIDES, IMAGES } from "@/data/projects";
import { ConsultantPhoto } from "@/components/consultant-photo";
import { Journey } from "@/components/journey";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { ProjectGrid } from "@/components/project-card";
import { SearchBar } from "@/components/search-bar";
import { WhatsAppFloat, WhatsAppLink } from "@/components/whatsapp";
import { getProjects, siteText } from "@/lib/data";

export function HomeView({ lang }: { lang: Lang }) {
  const t = dict(lang).home;
  const st = siteText(lang);
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        {/* Garden gazebo, then the Airria Plus grounds: clubhouse, lake park, lakeside track, playground (nearly still clips, crossfading) */}
        <HeroSlideshow slides={HERO_SLIDES} note={t.heroNote} />
        {/* Mobile: copy spans the full width, so darken more evenly */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#090e0b_0%,rgba(9,14,11,0.8)_24%,rgba(9,14,11,0.45)_46%,rgba(9,14,11,0.1)_68%,rgba(9,14,11,0.18)_100%)] sm:hidden" />
        {/* Larger screens: lighter overlay so glass buttons show the photo, darker behind the copy on the left */}
        <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(to_top,#090e0b_0%,rgba(9,14,11,0.6)_18%,rgba(9,14,11,0.26)_44%,rgba(9,14,11,0.06)_80%)] sm:block" />
        <div className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_70%_70%_at_0%_80%,rgba(9,14,11,0.7),transparent_70%)] sm:block" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_100%,rgba(52,196,140,0.16),transparent_55%)]" />
        <div className="hero-copy mx-auto w-full max-w-6xl px-5 pt-32 pb-[calc(var(--tabbar-h)+var(--tabbar-gap)+24px)] sm:px-8 md:pt-40 md:pb-20">
          <p className="eyebrow rise">{t.eyebrow}</p>
          <h1 className="t-hero rise-2 mt-2.5 max-w-[17ch] text-balance sm:mt-3 sm:max-w-3xl">{t.title}</h1>
          <p className="t-lead rise-3 mt-3 max-w-[34ch] sm:mt-5 sm:max-w-[46ch]">{t.lead}</p>
          <SearchBar className="rise-3 mt-6 max-w-md sm:mt-8" />
        </div>
      </section>

      {/* Developments */}
      <section className="mx-auto max-w-6xl px-5 pt-12 sm:px-8 sm:pt-16" aria-labelledby="dev-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t.devEyebrow}</p>
            <h2 id="dev-title" className="t-section mt-1.5">
              {t.devTitle}
            </h2>
          </div>
          <Link href={lp(lang, "/projects")} className="hidden min-h-11 items-center gap-1.5 text-[15px] text-emerald-text hover:underline sm:inline-flex">
            {t.viewAll} <ArrowRight aria-hidden size={16} />
          </Link>
        </div>
        <div className="mt-6 sm:mt-8">
          <ProjectGrid projects={getProjects(lang)} lang={lang} />
        </div>
      </section>

      {/* Tools. Phone: one inset grouped list (icon, title, one line, chevron), as in iOS Settings.
          Larger screens: two cards side by side. */}
      <section className="mx-auto mt-14 max-w-6xl px-5 sm:mt-20 sm:px-8" aria-label={t.tools}>
        <div className="card divide-y divide-line overflow-hidden md:grid md:grid-cols-2 md:gap-5 md:divide-y-0 md:overflow-visible md:border-0 md:bg-transparent">
          {[
            {
              href: "/calculator",
              icon: Calculator,
              tone: "bg-forest text-emerald-text",
              link: "text-emerald-text",
              ...t.planner,
            },
            {
              href: "/compare",
              icon: GitCompareArrows,
              tone: "bg-sage-deep text-sage-text",
              link: "text-sage-text",
              ...t.compare,
            },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={lp(lang, tool.href)}
              className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors duration-200 active:bg-white/[0.04] md:rounded-[20px] md:border md:border-line md:bg-surface md:flex-col md:items-start md:gap-6 md:p-7 md:hover:border-line-strong"
            >
              <span className={`grid size-9 shrink-0 place-items-center rounded-[10px] md:size-12 md:rounded-2xl ${tool.tone}`}>
                <tool.icon aria-hidden size={18} className="md:size-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] font-medium md:font-display md:text-[26px] md:leading-tight md:font-normal">{tool.title}</h3>
                <p className="truncate text-[13px] text-muted md:hidden">{tool.short}</p>
                <p className="mt-2 hidden text-[15px] leading-relaxed text-muted md:block">{tool.body}</p>
              </div>
              <ChevronRight aria-hidden size={18} className="shrink-0 text-subtle md:hidden" />
              <span className={`mt-auto hidden items-center gap-1.5 text-[15px] md:inline-flex ${tool.link}`}>
                {tool.cta} <ArrowRight aria-hidden size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Journey: heading in the page column, film full width */}
      <section className="mt-16 sm:mt-24" aria-labelledby="journey-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="eyebrow">{t.journeyEyebrow}</p>
          <h2 id="journey-title" className="t-section mt-1.5 max-w-2xl">
            {t.journeyTitle}
          </h2>
          <p className="t-lead mt-2 max-w-xl sm:mt-3">{t.journeyLead}</p>
        </div>
        <div className="mt-8 sm:mt-10">
          <Journey
            steps={dict(lang).journey.steps}
            film={{ src: IMAGES.journeyFilm, srcSmall: IMAGES.journeyFilmSmall, srcVp9: IMAGES.journeyFilmVp9, poster: IMAGES.journeyPoster, still: IMAGES.journeyStill }}
          />
        </div>
      </section>

      {/* Consultant */}
      <section className="mx-auto mt-16 max-w-6xl px-5 sm:mt-24 sm:px-8" aria-labelledby="consultant-title">
        <div className="card grid overflow-hidden md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Same box as before: on larger screens the height follows the copy; the photo melts into it and opens on click */}
          <div className="relative">
            <ConsultantPhoto
              src={site.consultantFeature}
              alt={t.consultantAlt(site.consultantName)}
              name={site.consultantName}
              title={st.consultantTitle}
            />
          </div>
          <div className="flex flex-col justify-center gap-4 p-5 sm:gap-5 sm:p-10">
            <p className="eyebrow">{t.consultantEyebrow}</p>
            <h2 id="consultant-title" className="t-section">
              {site.consultantName}
            </h2>
            <p className="-mt-3 text-[13px] text-muted sm:text-[15px]">
              {st.consultantTitle} · {site.serviceAreas.join(", ")}
            </p>
            <p className="max-w-lg text-[15px] leading-relaxed text-text/90 sm:text-[17px]">{st.serviceApproach}</p>
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
              <WhatsAppLink context="general" lang={lang} className="btn btn-primary !px-3 sm:!px-5">
                WhatsApp
              </WhatsAppLink>
              <Link href={lp(lang, "/about")} className="btn btn-ghost !px-3 sm:!px-5">
                {t.aboutAqil}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppFloat />
    </>
  );
}
