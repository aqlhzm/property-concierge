"use client";

import { ArrowRight, Bath, BedDouble, Bookmark, BookmarkPlus, GitCompareArrows, Ruler, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Project, UnitType } from "@/data/types";
import { lp } from "@/i18n/config";
import { useLang, useT } from "@/i18n/client";
import { sqftRange } from "@/lib/format";
import { addToShortlist, parseShortlist, removeFromShortlist, SHORTLIST_MAX, splitShortlist, useShortlist } from "@/lib/shortlist";
import { cardImage, PriceLine } from "./project-card";
import { ShareButton } from "./share-button";

/**
 * Saved homes, side by side. With ?d=…&u=… in the address it shows a shortlist someone shared, and offers
 * to save those homes on this device; otherwise it shows this device's own list.
 */
export function ShortlistView({ projects, units }: { projects: Project[]; units: UnitType[] }) {
  const params = useSearchParams();
  const mine = useShortlist();
  const lang = useLang();
  const d = useT();
  const t = d.shortlist;
  const c = d.card;
  const sharedIds = parseShortlist(JSON.stringify([...(params.get("d") ?? "").split(","), ...(params.get("u") ?? "").split(",")].filter(Boolean)));
  const isShared = sharedIds.length > 0;
  const ids = isShared ? sharedIds : mine;

  const { developments, unitTypes } = splitShortlist(
    ids,
    projects.map((p) => p.slug),
    units.map((u) => u.id),
  );
  const devs = developments.map((s) => projects.find((p) => p.slug === s)!);
  const types = unitTypes.map((id) => units.find((u) => u.id === id)!);
  const total = devs.length + types.length;

  const shareUrl = `${lp(lang, "/shortlist")}?${new URLSearchParams({
    ...(developments.length ? { d: developments.join(",") } : {}),
    ...(unitTypes.length ? { u: unitTypes.join(",") } : {}),
  })
    .toString()
    .replace(/%2C/g, ",")}`;
  const compareSlugs = [...new Set([...developments, ...types.map((u) => u.projectSlug)])];
  const sendHref = lp(lang, `/enquire?intent=recommendation&shortlist=${[...developments, ...unitTypes].join(",")}`);
  const unsaved = sharedIds.filter((id) => !mine.includes(id));

  return (
    <div>
      <p className="eyebrow">{isShared ? t.sharedEyebrow : t.eyebrow}</p>
      <h1 className="t-title mt-2">{isShared ? t.sharedTitle : t.title}</h1>
      <p className="t-lead mt-2 max-w-2xl sm:mt-3">{isShared ? t.sharedLead : t.lead}</p>

      {total === 0 ? (
        <div className="card mt-8 flex flex-col items-start gap-4 p-6 sm:p-8">
          <span className="grid size-11 place-items-center rounded-full bg-forest text-emerald-text">
            <Bookmark aria-hidden size={20} />
          </span>
          <div>
            <h2 className="text-[17px] font-medium">{t.emptyTitle}</h2>
            <p className="mt-1 max-w-md text-[14px] leading-relaxed text-muted">{t.emptyBody}</p>
          </div>
          <Link href={lp(lang, "/projects")} className="btn btn-primary">
            {t.browse} <ArrowRight aria-hidden size={16} />
          </Link>
        </div>
      ) : (
        <>
          {/* Actions: one row, the main one first */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
            <Link href={sendHref} className="btn btn-primary col-span-2 sm:col-span-1">
              {t.send} <ArrowRight aria-hidden size={16} />
            </Link>
            {isShared && unsaved.length > 0 ? (
              <button type="button" onClick={() => addToShortlist(unsaved)} className="btn btn-ghost !px-3 sm:!px-5">
                <BookmarkPlus aria-hidden size={17} /> {t.saveAll}
              </button>
            ) : (
              <ShareButton title={t.shareTitle} url={shareUrl} label={d.share.share} className="btn btn-ghost !px-3 sm:!px-5" />
            )}
            {compareSlugs.length > 1 && (
              <Link href={lp(lang, `/compare?p=${compareSlugs.join(",")}`)} className="btn btn-ghost !px-3 sm:!px-5">
                <GitCompareArrows aria-hidden size={17} /> {t.compare}
              </Link>
            )}
          </div>
          <p className="mt-3 text-[12px] text-subtle">
            {t.count(total, SHORTLIST_MAX)}
          </p>

          {devs.length > 0 && (
            <section aria-labelledby="sl-devs" className="mt-8 sm:mt-10">
              <h2 id="sl-devs" className="text-[13px] font-medium tracking-[0.14em] text-muted uppercase">
                {t.developments}
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {devs.map((p) => (
                  <li key={p.slug} className="card relative overflow-hidden">
                    <Link href={lp(lang, `/projects/${p.slug}`)} className="group block">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image src={cardImage(p).url} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.65),transparent_55%)]" />
                        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                          <p className="text-[10.5px] tracking-[0.14em] text-white/75 uppercase">
                            {p.township} · {p.location}
                          </p>
                          <h3 className="font-display text-[21px] leading-tight text-white">{p.name}</h3>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-[13px] text-muted">
                          {p.productName} · {p.bedrooms} {c.bed} · {p.bathrooms} {c.bath}
                        </p>
                        <PriceLine project={p} lang={lang} className="mt-0.5 text-[15px] font-medium" />
                      </div>
                    </Link>
                    {!isShared && <RemoveButton id={p.slug} name={p.name} label={d.save.remove(p.name)} />}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {types.length > 0 && (
            <section aria-labelledby="sl-units" className="mt-8 sm:mt-10">
              <h2 id="sl-units" className="text-[13px] font-medium tracking-[0.14em] text-muted uppercase">
                {t.unitTypes}
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {types.map((u) => {
                  const p = projects.find((x) => x.slug === u.projectSlug)!;
                  return (
                    <li key={u.id} className="card relative p-4 sm:p-5">
                      <Link href={lp(lang, `/projects/${p.slug}#units`)} className="block pr-10">
                        <p className="text-[11px] tracking-[0.14em] text-muted uppercase">
                          {p.name} · {u.storeys}
                        </p>
                        <h3 className="mt-1 font-display text-[20px] leading-tight">{u.name}</h3>
                      </Link>
                      <dl className="mt-3 grid grid-cols-3 gap-2 text-[13px] text-muted">
                        <div className="flex items-center gap-1.5">
                          <BedDouble aria-hidden size={15} className="text-sage" />
                          <dt className="sr-only">{c.bedrooms}</dt>
                          <dd>
                            {u.bedrooms} {c.bed}
                          </dd>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath aria-hidden size={15} className="text-sage" />
                          <dt className="sr-only">{c.bathrooms}</dt>
                          <dd className="whitespace-nowrap">
                            {u.bathrooms} {c.bath}
                          </dd>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Ruler aria-hidden size={15} className="text-sage" />
                          <dt className="sr-only">{c.lotSize}</dt>
                          <dd>{u.lotSize}</dd>
                        </div>
                      </dl>
                      <div className="mt-3 border-t border-line pt-3">
                        <p className="text-[13px] text-muted">
                          {lang === "ms" ? `${c.builtUp} ${sqftRange(u.builtUpMin, u.builtUpMax, lang)}` : `${sqftRange(u.builtUpMin, u.builtUpMax)} ${c.builtUpSuffix}`}
                        </p>
                        <p className="mt-0.5 text-[15px] font-medium">{u.priceLabel}</p>
                      </div>
                      {!isShared && <RemoveButton id={u.id} name={`${p.name} ${u.name}`} label={d.save.remove(`${p.name} ${u.name}`)} />}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {isShared && (
            <p className="mt-8 text-[13px] text-muted">
              <Link href={lp(lang, "/shortlist")} className="inline-flex min-h-11 items-center text-emerald-text">
                {t.mine}
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}

function RemoveButton({ id, label }: { id: string; name: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => removeFromShortlist(id)}
      aria-label={label}
      className="absolute top-2 right-2 grid size-11 place-items-center rounded-full border border-white/15 bg-black/45 text-white/90 backdrop-blur-md transition-colors hover:bg-black/65"
    >
      <X aria-hidden size={16} />
    </button>
  );
}
