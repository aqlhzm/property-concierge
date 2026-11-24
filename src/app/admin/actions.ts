"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { fromLocalInput, LOG_TYPE_KEYS, PRIORITY_KEYS, STATUS_KEYS } from "@/lib/crm";
import { requireStaff } from "@/lib/supabase-auth";

/**
 * Staff actions. Each one checks the session again and runs with the staff member's own token,
 * so the database policies (is_staff) decide what is allowed. The timeline entries for these
 * changes are written by database triggers.
 */

export type ActionResult = { ok: boolean; error?: string; savedAt?: number };

const SAVE_FAILED = "Could not save. Check your connection and try again.";

const leadId = z.uuid();

const saveSchema = z.object({
  leadId,
  status: z.enum(STATUS_KEYS),
  priority: z
    .union([z.enum(PRIORITY_KEYS), z.literal("")])
    .transform((v) => v || null),
  nextAction: z
    .string()
    .trim()
    .max(200, "Keep the next action under 200 characters")
    .transform((v) => v || null),
  followUp: z.string().trim(),
});

export async function saveLead(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireStaff();
  const parsed = saveSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
    priority: formData.get("priority") ?? "",
    nextAction: formData.get("nextAction") ?? "",
    followUp: formData.get("followUp") ?? "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? SAVE_FAILED };

  const { followUp, ...d } = parsed.data;
  const followUpAt = followUp ? fromLocalInput(followUp) : null;
  if (followUp && !followUpAt) return { ok: false, error: "Choose a valid follow-up date and time." };

  const { data, error } = await supabase
    .from("leads")
    .update({ status: d.status, priority: d.priority, next_action: d.nextAction, next_follow_up_at: followUpAt })
    .eq("id", d.leadId)
    .select("id");
  if (error || !data?.length) {
    if (error) console.error("saveLead failed", error.code);
    return { ok: false, error: SAVE_FAILED };
  }
  refresh();
  return { ok: true, savedAt: Date.now() };
}

const logSchema = z
  .object({
    leadId,
    type: z.enum(LOG_TYPE_KEYS),
    body: z
      .string()
      .trim()
      .max(4000, "Keep it under 4,000 characters")
      .transform((v) => v || null),
  })
  .refine((v) => v.type !== "note" || v.body, { message: "Write the note first.", path: ["body"] });

export async function addLog(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { supabase, staff } = await requireStaff();
  const parsed = logSchema.safeParse({
    leadId: formData.get("leadId"),
    type: formData.get("type"),
    body: formData.get("body") ?? "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? SAVE_FAILED };

  const { error } = await supabase.from("lead_activities").insert({
    lead_id: parsed.data.leadId,
    staff_id: staff.userId,
    type: parsed.data.type,
    body: parsed.data.body,
  });
  if (error) {
    console.error("addLog failed", error.code);
    return { ok: false, error: SAVE_FAILED };
  }
  refresh();
  return { ok: true, savedAt: Date.now() };
}

export async function setArchived(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = leadId.safeParse(formData.get("leadId"));
  if (!id.success) return;
  const archive = formData.get("archive") === "1";
  const { error } = await supabase
    .from("leads")
    .update({ archived_at: archive ? new Date().toISOString() : null })
    .eq("id", id.data);
  if (error) console.error("setArchived failed", error.code);
  refresh();
}
