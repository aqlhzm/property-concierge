"use client";

import { Bath, BedDouble, Expand, Minus, Plus, Ruler, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Project, UnitType } from "@/data/types";
import { formatNum, sqftRange } from "@/lib/format";
import { whatsappHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp";

type Floor = "ground" | "first";

function PlanViewer({ unit, projectName }: { unit: UnitType; projectName: string }) {
  const [floor, setFloor] = useState<Floor>("ground");
  const [zoom, setZoom] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const src = floor === "ground" ? unit.floorPlanGround : unit.floorPlanFirst;
  const alt = `${projectName} ${unit.name}, ${floor === "ground" ? "ground" : "first"} floor plan`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div role="tablist" aria-label="Floor" className="inline-flex rounded-full bg-black/30 p-1">
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
              className={`min-h-10 rounded-full px-4 text-[14px] font-medium transition-colors duration-200 ${
                floor === f ? "pill-active" : "text-muted hover:text-text"
              }`}
            >
              {f === "ground" ? "Ground floor" : "First floor"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/15 px-3.5 text-[13px] text-text hover:bg-white/5"
        >
          <Expand aria-hidden size={15} /> Full screen
        </button>
      </div>

      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[18px] border border-white/10 bg-[#0b0d0c]"
        aria-label={`Open ${alt} full screen`}
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
              {unit.name} · {floor === "ground" ? "Ground floor" : "First floor"}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="grid size-11 place-items-center rounded-full hover:bg-white/10">
                <Minus aria-hidden size={18} />
              </button>
              <span className="w-12 text-center text-[13px] tabular">{Math.round(zoom * 100)}%</span>
              <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(4, z + 0.5))} className="grid size-11 place-items-center rounded-full hover:bg-white/10">
                <Plus aria-hidden size={18} />
              </button>
              <button type="button" aria-label="Close" onClick={() => dialogRef.current?.close()} className="ml-2 grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
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
  const unit = units.find((u) => u.id === activeId) ?? units[0];
  if (!unit) return null;
  const title = `${project.name} ${project.productName}`;

  return (
    <div>
      <div role="tablist" aria-label="Unit types" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
        {units.map((u) => (
          <button
            key={u.id}
            role="tab"
            type="button"
            aria-selected={u.id === unit.id}
            onClick={() => setActiveId(u.id)}
            className={`min-h-11 shrink-0 rounded-full border px-5 text-[14px] font-medium transition-colors duration-200 ${
              u.id === unit.id ? "pill-active border-transparent" : "border-line-strong text-muted hover:text-text"
            }`}
          >
            Type {u.code}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 rounded-[24px] border border-line bg-surface p-5 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[13px] tracking-[0.18em] text-muted uppercase">{unit.storeys}</p>
            <h3 className="mt-1 font-display text-[30px] leading-tight">{unit.name}</h3>
          </div>
          <dl className="grid grid-cols-3 gap-3">
            {[
              { icon: BedDouble, label: "Bedrooms", value: unit.bedrooms },
              { icon: Bath, label: "Bathrooms", value: unit.bathrooms },
              { icon: Ruler, label: "Lot", value: unit.lotSize },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-black/25 p-3">
                <Icon aria-hidden size={18} className="text-sage" />
                <dt className="mt-2 text-[12px] text-muted">{label}</dt>
                <dd className="text-[16px] font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-[13px] text-muted">Built up</p>
            <p className="font-display text-[28px] tabular">{sqftRange(unit.builtUpMin, unit.builtUpMax)}</p>
            <ul className="mt-2 divide-y divide-white/10 rounded-2xl border border-white/10">
              {unit.variants.map((v) => (
                <li key={v.position} className="flex items-center justify-between px-4 py-3 text-[14px]">
                  <span className="text-muted">{v.position}</span>
                  <span className="tabular">{formatNum(v.builtUpSqft)} sq ft</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] text-muted">Key spaces</p>
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

          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappHref("unit_type", {
                unit: unit.name,
                project: title,
                config: `${unit.bedrooms} bed · ${unit.bathrooms} bath · ${unit.lotSize}`,
                price: "Could you share the latest price and availability?",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <WhatsAppIcon size={18} /> Ask about Type {unit.code}
            </a>
            <a href={`/enquire?project=${project.slug}&unit=${unit.id}&intent=viewing`} className="btn btn-ghost">
              Arrange a viewing
            </a>
          </div>
        </div>

        <PlanViewer key={unit.id} unit={unit} projectName={title} />
      </div>
    </div>
  );
}
