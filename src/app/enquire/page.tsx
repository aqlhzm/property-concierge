import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/enquiry-form";
import { WhatsAppLink } from "@/components/whatsapp";
import { units } from "@/data/units";
import { allProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Speak to Aqil",
  description: "Arrange a viewing, ask about prices and availability, or request a personal recommendation.",
};

export default function EnquirePage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-[84px] sm:px-8 sm:pt-32 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      <div>
        <p className="eyebrow">Speak to Aqil</p>
        <h1 className="t-title mt-2">Let’s find the right home together</h1>
        <p className="t-lead mt-2 sm:mt-3">
          Arrange a viewing, ask about the latest prices and availability, or tell Aqil what you need and he will put
          together a shortlist.
        </p>
        <div className="mt-8 rounded-[20px] border border-line p-5">
          <p className="text-[15px]">Prefer to chat?</p>
          <p className="mt-1 text-[14px] text-muted">Most buyers reach Aqil fastest on WhatsApp.</p>
          <WhatsAppLink context="general" className="btn btn-ghost mt-4">
            Open WhatsApp
          </WhatsAppLink>
        </div>
      </div>
      <Suspense fallback={<div className="card h-[640px] animate-pulse" />}>
        <EnquiryForm projects={allProjects} units={units} />
      </Suspense>
    </div>
  );
}
