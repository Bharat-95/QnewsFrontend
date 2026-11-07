import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { supabaseRest } from "./supabase";

export const CODE_TTL_MINUTES = 10;
export const MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 60;

function secret() {
  const value = process.env.PASSWORD_RESET_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("Missing PASSWORD_RESET_SECRET / SUPABASE_SERVICE_ROLE_KEY");
  return value;
}

export function hashCode(email, code) {
  return createHmac("sha256", secret()).update(`${email}:${code}`).digest("hex");
}

export function codesMatch(email, code, storedHash) {
  const a = Buffer.from(hashCode(email, String(code).trim()), "hex");
  const b = Buffer.from(String(storedHash || ""), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function newCode() {
  return String(randomInt(100000, 1000000));
}

export async function getCodeRow(email) {
  const rows = await supabaseRest("password_reset_codes", {
    query: { select: "*", email: `eq.${email}`, limit: "1" },
  });
  return rows?.[0] || null;
}

export async function saveCode(email, code) {
  await supabaseRest("password_reset_codes", {
    method: "POST",
    query: { on_conflict: "email" },
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: {
      email,
      code_hash: hashCode(email, code),
      expires_at: new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString(),
      attempts: 0,
      created_at: new Date().toISOString(),
    },
  });
}

export async function recordFailedAttempt(email, attempts) {
  await supabaseRest("password_reset_codes", {
    method: "PATCH",
    query: { email: `eq.${email}` },
    body: { attempts: attempts + 1 },
  });
}

export async function deleteCode(email) {
  await supabaseRest("password_reset_codes", {
    method: "DELETE",
    query: { email: `eq.${email}` },
  });
}

// Sends the code with the existing EmailJS template, from the server.
export async function sendCodeEmail(email, code) {
  const body = {
    service_id: process.env.EMAILJS_SERVICE_ID || "service_zemecne",
    template_id: process.env.EMAILJS_TEMPLATE_ID || "template_40yjuqe",
    user_id: process.env.EMAILJS_PUBLIC_KEY || "y7xRvo7Xp8BAipO4x",
    template_params: { to_email: email, otp: code },
  };
  if (process.env.EMAILJS_PRIVATE_KEY) body.accessToken = process.env.EMAILJS_PRIVATE_KEY;

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Email service error (${res.status}): ${text}`);
  }
}
