"use client";

import { Bath, BedDouble, Expand, Minus, Plus, Ruler, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Project, UnitType } from "@/data/types";
import { lp } from "@/i18n/config";
import { useLang, useT } from "@/i18n/client";
import { formatNum, sqftRange } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";
import { SaveButton } from "./save-button";
import { WhatsAppIcon } from "./whatsapp";

type Floor = "ground" | "first";

function PlanViewer({ unit, projectName }: { unit: UnitType; projectName: string }) {
  const [floor, setFloor] = useState<Floor>("ground");
  const [zoom, setZoom] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = useT().unit;
  const src = floor === "ground" ? unit.floorPlanGround : unit.floorPlanFirst;
  const alt = t.planAlt(projectName, unit.name, floor);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div role="tablist" aria-label={t.floor} className="inline-flex rounded-full bg-black/30 p-1">
          {(["ground", "first"] as const).map((f) => (
            <button
              key={f}
              role="tab"
              type="button"
              aria-selected={floor === f}
              onClick={() => {
                setFloor(f);
                setZoom(1);
              }}
              className={`min-h-9 rounded-full px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-200 sm:min-h-10 sm:px-4 sm:text-[14px] ${
                floor === f ? "pill-active" : "text-muted hover:text-text"
              }`}
            >
              <span className="sm:hidden">{f === "ground" ? t.ground : t.first}</span>
              <span className="max-sm:hidden">{f === "ground" ? t.groundFloor : t.firstFloor}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          aria-label={t.fullScreenLabel}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 text-[13px] whitespace-nowrap text-text hover:bg-white/5 sm:px-3.5"
        >
          <Expand aria-hidden size={15} /> <span className="max-sm:hidden">{t.fullScreen}</span>
          <span className="sm:hidden">{t.expand}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[18px] border border-white/10 bg-[#0b0d0c]"
        aria-label={t.openFull(alt)}
      >
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="plan-invert object-contain p-4" />
      </button>
      <p className="text-[13px] leading-relaxed text-muted">{unit.floorPlanNote}</p>

      <dialog
        ref={dialogRef}
        aria-label={alt}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-[#0b0d0c] p-0 text-text backdrop:bg-black/80"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
            <p className="truncate text-[14px]">
              {unit.name} · {floor === "ground" ? t.groundFloor : t.firstFloor}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" aria-label={t.zoomOut} onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="grid size-11 place-items-center rounded-full hover:bg-white/10">
                <Minus aria-hidden size={18} />
              </button>
              <span className="w-12 text-center text-[13px] tabular">{Math.round(zoom * 100)}%</span>
              <button type="button" aria-label={t.zoomIn} onClick={() => setZoom((z) => Math.min(4, z + 0.5))} className="grid size-11 place-items-center rounded-full hover:bg-white/10">
                <Plus aria-hidden size={18} />
              </button>
              <button type="button" aria-label={t.close} onClick={() => dialogRef.current?.close()} className="ml-2 grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <X aria-hidden size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto" style={{ touchAction: "pan-x pan-y pinch-zoom" }}>
            <div className="relative mx-auto h-full min-h-[70vh]" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
              <Image src={src} alt={alt} fill sizes="100vw" className="plan-invert object-contain p-6" />
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export function UnitExplorer({ project, units }: { project: Project; units: UnitType[] }) {
  const [activeId, setActiveId] = useState(units[0]?.id);
  const lang = useLang();
  const t = useT().unit;
  const unit = units.find((u) => u.id === activeId) ?? units[0];
  if (!unit) return null;
  const title = `${project.name} ${project.productName}`;

  return (
    <div>
      <div role="tablist" aria-label={t.unitTypes} className="scroll-row -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
        {units.map((u) => (
          <button
            key={u.id}
            role="tab"
            type="button"
            aria-selected={u.id === unit.id}
            onClick={() => setActiveId(u.id)}
            className={`min-h-10 shrink-0 rounded-full border px-4 text-[14px] font-medium transition-colors sm:min-h-11 sm:px-5 duration-200 ${
              u.id === unit.id ? "pill-active border-transparent" : "border-line-strong text-muted hover:text-text"
            }`}
          >
            {t.type} {u.code}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-7 rounded-[24px] border border-line bg-surface p-4 sm:mt-6 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-5 sm:gap-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.16em] text-muted uppercase sm:text-[13px] sm:tracking-[0.18em]">{unit.storeys}</p>
              <h3 className="mt-1 font-display text-[22px] leading-tight sm:text-[30px]">{unit.name}</h3>
            </div>
            <SaveButton id={unit.id} name={`${title} ${unit.name}`} variant="icon" className="sm:hidden" />
            <SaveButton id={unit.id} name={`${title} ${unit.name}`} className="max-sm:hidden" />
          </div>
          <dl className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: BedDouble, label: t.bedrooms, value: unit.bedrooms },
              { icon: Bath, label: t.bathrooms, value: unit.bathrooms },
              { icon: Ruler, label: t.lot, value: unit.lotSize },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-black/25 p-3">
                <Icon aria-hidden size={18} className="text-sage" />
                <dt className="mt-2 text-[12px] text-muted">{label}</dt>
                <dd className="text-[15px] font-medium whitespace-nowrap sm:text-[16px]">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-[13px] text-muted">{t.builtUp}</p>
            <p className="font-display text-[22px] tabular sm:text-[28px]">{sqftRange(unit.builtUpMin, unit.builtUpMax, lang)}</p>
            <ul className="mt-2 divide-y divide-white/10 rounded-2xl border border-white/10">
              {unit.variants.map((v) => (
                <li key={v.position} className="flex items-center justify-between gap-3 px-4 py-3 text-[13.5px] sm:text-[14px]">
                  <span className="text-muted">{v.position}</span>
                  <span className="shrink-0 tabular whitespace-nowrap">{formatNum(v.builtUpSqft)} sq ft</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] text-muted">{t.keySpaces}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {unit.keySpaces.map((s) => (
                <li key={s} className="rounded-full bg-sage-deep/70 px-3 py-1.5 text-[13px] text-sage-text">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 p-4">
            <p className="text-[15px] font-medium">{unit.priceLabel}</p>
            <p className="mt-1 text-[13px] text-muted">{unit.availabilityNote}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
            <a
              href={whatsappHref(
                "unit_type",
                {
                  unit: unit.name,
                  project: title,
                  config: t.config(unit.bedrooms, unit.bathrooms, unit.lotSize),
                  price: t.askPrice,
                },
                lang,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary !px-3 sm:!px-5"
            >
              <WhatsAppIcon size={18} /> {t.askAbout(unit.code)}
            </a>
            <a href={lp(lang, `/enquire?project=${project.slug}&unit=${unit.id}&intent=viewing`)} className="btn btn-ghost !px-3 sm:!px-5">
              <span className="sm:hidden">{t.viewingShort}</span>
              <span className="max-sm:hidden">{t.viewingLong}</span>
            </a>
          </div>
        </div>

        <PlanViewer key={unit.id} unit={unit} projectName={title} />
      </div>
    </div>
  );
}
