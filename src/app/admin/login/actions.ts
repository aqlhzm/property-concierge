"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { safeAdminPath } from "@/lib/auth-cookies";
import { getAuthClient } from "@/lib/supabase-auth";
import { getSupabase } from "@/lib/supabase-server";

export type LoginState = { step: "email" | "code"; email?: string; error?: string };

const emailSchema = z.email();

function readEmail(formData: FormData) {
  const parsed = emailSchema.safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  return parsed.success ? parsed.data : null;
}

/**
 * Sends a one-time code, but only to invited or active staff. The reply is the same either way,
 * so the form never reveals which emails have access.
 */
async function requestCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = readEmail(formData);
  if (!email) return { step: "email", error: "Enter a valid email address." };

  const anon = getSupabase();
  const auth = await getAuthClient();
  if (!anon || !auth) return { step: "email", email, error: "Sign-in is not available right now." };

  const { data: allowed, error: checkError } = await anon.rpc("staff_login_allowed", { p_email: email });
  if (checkError) {
    console.error("staff_login_allowed failed", checkError.code);
    return { step: "email", email, error: "Sign-in is not available right now. Please try again shortly." };
  }

  if (allowed === true) {
    const { error } = await auth.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) {
      if (error.status === 429) {
        return { step: "email", email, error: "A code was sent a moment ago. Please wait a minute, then try again." };
      }
      console.error("signInWithOtp failed", error.status, error.code);
      return { step: "email", email, error: "We could not send a code just now. Please try again shortly." };
    }
  }
  return { step: "code", email };
}

async function verifyCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = readEmail(formData);
  if (!email) return { step: "email", error: "Enter a valid email address." };
  const code = String(formData.get("code") ?? "").replace(/\D/g, "");
  if (!/^\d{6,10}$/.test(code)) return { step: "code", email, error: "Enter the code from the email." };

  const auth = await getAuthClient();
  if (!auth) return { step: "code", email, error: "Sign-in is not available right now." };

  const { error } = await auth.auth.verifyOtp({ email, token: code, type: "email" });
  if (error) return { step: "code", email, error: "That code is not valid or has expired. Request a new one." };

  const { data: role } = await auth.rpc("claim_staff");
  if (!role) {
    await auth.auth.signOut();
    return { step: "email", error: "This email does not have access." };
  }
  redirect(safeAdminPath(formData.get("next")));
}

/** One action for both steps, chosen by the button that submitted the form. */
export async function login(prev: LoginState, formData: FormData): Promise<LoginState> {
  return formData.get("intent") === "verify" ? verifyCode(prev, formData) : requestCode(prev, formData);
}

export async function signOut() {
  const auth = await getAuthClient();
  await auth?.auth.signOut();
  redirect("/admin/login");
}
