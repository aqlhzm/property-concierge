import { ArrowRight, Calculator, GitCompareArrows } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/content";
import { IMAGES } from "@/data/projects";
import { Journey, type JourneyStep } from "@/components/journey";
import { ImageBadge, ProjectCard } from "@/components/project-card";
import { SearchBar } from "@/components/search-bar";
import { WhatsAppFloat, WhatsAppLink } from "@/components/whatsapp";
import { allProjects } from "@/lib/data";

const JOURNEY: JourneyStep[] = [
  { n: "01", title: "Discover", body: "Developments matched to your budget, location and lifestyle.", online: true },
  { n: "02", title: "Understand", body: "Unit plans, specifications, comparisons and estimates in one place.", online: true },
  { n: "03", title: "Qualify", body: "A clear read on readiness, eligibility and what you can comfortably afford.", online: false },
  { n: "04", title: "Experience", body: "Personal recommendations and viewings arranged around you.", online: true },
  { n: "05", title: "Purchase", body: "Booking, documents, financing and SPA, coordinated step by step.", online: false },
  { n: "06", title: "Track", body: "Progress on financing, construction and outstanding requirements.", online: false },
  { n: "07", title: "Handover", body: "Vacant possession, key collection, defect inspection and after sales.", online: false },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src={IMAGES.gazebo}
          quality={85}
          alt="Stargazer's Gazebo at Wellington Garden, Eco Grandeur, at dusk"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        {/* Mobile: copy spans the full width, so darken more evenly */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#090e0b_0%,rgba(9,14,11,0.74)_26%,rgba(9,14,11,0.5)_56%,rgba(9,14,11,0.2)_85%)] sm:hidden" />
        {/* Larger screens: lighter overlay so glass buttons show the photo, darker behind the copy on the left */}
        <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(to_top,#090e0b_0%,rgba(9,14,11,0.6)_18%,rgba(9,14,11,0.26)_44%,rgba(9,14,11,0.06)_80%)] sm:block" />
        <div className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_70%_70%_at_0%_80%,rgba(9,14,11,0.62),transparent_70%)] sm:block" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_100%,rgba(52,196,140,0.16),transparent_55%)]" />
        <div className="absolute top-24 right-4 sm:right-8">
          <ImageBadge label="Artist's impression" />
        </div>
        <div className="hero-copy mx-auto w-full max-w-6xl px-5 pt-40 pb-28 sm:px-8 md:pb-20">
          <p className="eyebrow rise">Personal property advisory · Selangor</p>
          <h1 className="rise-2 mt-4 max-w-3xl font-display text-[44px] leading-[1.05] tracking-tight text-balance sm:text-[64px]">
            Don’t just find a house. Make the right decision. Receive your keys.
          </h1>
          <p className="rise-3 mt-5 max-w-xl text-[17px] text-muted">
            Explore selected developments, compare homes side by side and plan your financing, with Aqil guiding you from
            first enquiry to key collection.
          </p>
          <SearchBar className="rise-3 mt-8 max-w-2xl" />
        </div>
      </section>

      {/* Developments */}
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8" aria-labelledby="dev-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Now advising</p>
            <h2 id="dev-title" className="mt-2 font-display text-[34px] leading-tight sm:text-[40px]">
              Selected developments
            </h2>
          </div>
          <Link href="/projects" className="hidden min-h-11 items-center gap-1.5 text-[15px] text-emerald-text hover:underline sm:inline-flex">
            View all <ArrowRight aria-hidden size={16} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto mt-20 grid max-w-6xl gap-5 px-5 sm:px-8 md:grid-cols-2" aria-label="Buyer tools">
        <Link href="/calculator" className="card group flex flex-col gap-6 p-7 transition-colors duration-200 hover:border-line-strong">
          <span className="grid size-12 place-items-center rounded-2xl bg-forest text-emerald-text">
            <Calculator aria-hidden size={22} />
          </span>
          <div>
            <h3 className="font-display text-[26px]">Financial planner</h3>
            <p className="mt-2 text-[15px] text-muted">
              Estimate your monthly instalment, down payment and total interest before you speak to a bank.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 text-[15px] text-emerald-text">
            Open planner <ArrowRight aria-hidden size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </Link>
        <Link href="/compare" className="card group flex flex-col gap-6 p-7 transition-colors duration-200 hover:border-line-strong">
          <span className="grid size-12 place-items-center rounded-2xl bg-sage-deep text-sage-text">
            <GitCompareArrows aria-hidden size={22} />
          </span>
          <div>
            <h3 className="font-display text-[26px]">Compare side by side</h3>
            <p className="mt-2 text-[15px] text-muted">
              Lot size, built up, tenure, completion and price range for each development, on one screen.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 text-[15px] text-sage-text">
            Start comparing <ArrowRight aria-hidden size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      {/* Journey */}
      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8" aria-labelledby="journey-title">
        <p className="eyebrow">The concierge journey</p>
        <h2 id="journey-title" className="mt-2 max-w-2xl font-display text-[34px] leading-tight sm:text-[40px]">
          From first discovery to receiving your keys
        </h2>
        <Journey steps={JOURNEY} />
      </section>

      {/* Consultant */}
      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8" aria-labelledby="consultant-title">
        <div className="card grid overflow-hidden md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative aspect-[4/5] md:aspect-auto">
            <Image
              src={site.consultantFeature}
              quality={90}
              alt={`Portrait of ${site.consultantName}`}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-[50%_18%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-surface" />
          </div>
          <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
            <p className="eyebrow">Your consultant</p>
            <h2 id="consultant-title" className="font-display text-[38px] leading-tight">
              {site.consultantName}
            </h2>
            <p className="-mt-3 text-[15px] text-muted">
              {site.consultantTitle} · {site.serviceAreas.join(", ")}
            </p>
            <p className="max-w-lg text-[17px]">{site.serviceApproach}</p>
            <div className="flex flex-wrap gap-3">
              <WhatsAppLink context="general">Chat on WhatsApp</WhatsAppLink>
              <Link href="/about" className="btn btn-ghost">
                About Aqil
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppFloat />
    </>
  );
}
