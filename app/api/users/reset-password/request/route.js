import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/server/supabase";
import {
  RESEND_COOLDOWN_SECONDS,
  getCodeRow,
  newCode,
  saveCode,
  sendCodeEmail,
} from "@/lib/server/resetCodes";

const GENERIC_OK = {
  success: true,
  message: "If an account exists for this email, a 6-digit code has been sent.",
};

export async function POST(req) {
  try {
    const { email } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const users = await supabaseRest("users", {
      query: { select: "authUserId", qnews: `eq.${normalizedEmail}`, limit: "1" },
    });
    // Same answer whether or not the account exists.
    if (!users?.[0]?.authUserId) return NextResponse.json(GENERIC_OK);

    const existing = await getCodeRow(normalizedEmail);
    if (existing && Date.now() - new Date(existing.created_at).getTime() < RESEND_COOLDOWN_SECONDS * 1000) {
      return NextResponse.json(
        { success: false, message: "Please wait a minute before requesting another code." },
        { status: 429 }
      );
    }

    const code = newCode();
    await saveCode(normalizedEmail, code);
    await sendCodeEmail(normalizedEmail, code);

    return NextResponse.json(GENERIC_OK);
  } catch (error) {
    console.error("Password reset request failed:", error);
    return NextResponse.json(
      { success: false, message: "Could not send the code right now. Please try again later." },
      { status: 500 }
    );
  }
}
