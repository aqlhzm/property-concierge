"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { site } from "@/data/content";
import { units } from "@/data/units";
import { allProjects, getProject } from "@/lib/data";
import { enquirySchema, type EnquiryState } from "@/lib/enquiry-schema";
import { getSupabase } from "@/lib/supabase-server";
import { whatsappHref } from "@/lib/whatsapp";

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key === "company") return { status: "error", message: "Something went wrong. Please try again." };
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  const d = parsed.data;
  const project = d.projectSlug ? getProject(d.projectSlug) : null;
  const unit = d.unitId ? units.find((u) => u.id === d.unitId && u.projectSlug === project?.slug) : undefined;
  const projectName = project ? `${project.name} ${project.productName}` : undefined;

  const whatsappUrl =
    d.intent === "Viewing request" && project
      ? whatsappHref("viewing", { project: projectName, unit: unit ? ` (${unit.name})` : "" })
      : project
        ? whatsappHref("project_overview", { project: project.whatsappProjectLine, location: `${project.location}, ${project.state}` })
        : whatsappHref("general");

  // Only ids we know (unit types, developments) are kept, at most 12
  const shortlist = (d.shortlist ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((id, i, all) => all.indexOf(id) === i && (units.some((u) => u.id === id) || allProjects.some((p) => p.slug === id)))
    .slice(0, 12);

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[enquiry] Supabase env vars are not configured");
    return {
      status: "error",
      message: "Online enquiries are temporarily unavailable. Please message Aqil on WhatsApp instead.",
      whatsappUrl,
    };
  }

  // Rate limiting is keyed on a one-way hash of the visitor's IP; the raw IP is never stored.
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "";
  const salt = process.env.LEAD_HASH_SALT ?? "property-concierge:lead-throttle:v1";
  const clientKey = ip ? createHash("sha256").update(`${salt}:${ip}`).digest("hex") : null;

  const { data: code, error } = await supabase.rpc("submit_lead", {
    payload: {
      client_key: clientKey,
      full_name: d.fullName,
      phone: d.phone,
      email: d.email ?? null,
      preferred_contact: d.preferredContact,
      intent: d.intent,
      project_slug: project?.slug ?? null,
      project_name: projectName ?? null,
      unit_type_id: unit?.id ?? null,
      unit_type_name: unit?.name ?? null,
      preferred_viewing_date: d.preferredViewingDate ?? null,
      preferred_viewing_time: d.preferredViewingTime ?? null,
      message: d.message ?? null,
      dream_desire: d.dreamDesire ?? null,
      dream_readiness: d.dreamReadiness ?? null,
      dream_eligibility: d.dreamEligibility ?? null,
      dream_affordability: d.dreamAffordability ?? null,
      dream_match: d.dreamMatch ?? null,
      consent_given: true,
      consent_text: site.consentText,
      consent_version: site.consentVersion,
      cta_source: d.ctaSource ?? null,
      utm_source: d.utmSource ?? null,
      utm_medium: d.utmMedium ?? null,
      utm_campaign: d.utmCampaign ?? null,
      shortlist: shortlist.length ? shortlist : null,
    },
  });

  if (error?.code === "P0429") {
    return {
      status: "error",
      message: "We have received several enquiries from you already. Aqil will be in touch soon, or you can message him on WhatsApp now.",
      whatsappUrl,
    };
  }

  if (error || typeof code !== "string") {
    console.error("[enquiry] submit_lead failed", error?.code, error?.message);
    return {
      status: "error",
      message: "We couldn't send your enquiry just now. Please try again, or message Aqil on WhatsApp.",
      whatsappUrl,
    };
  }

  return { status: "success", leadCode: code, whatsappUrl };
}
