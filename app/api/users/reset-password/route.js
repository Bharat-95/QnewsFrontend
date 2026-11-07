import { NextResponse } from "next/server";
import { supabaseAuth, supabaseRest } from "@/lib/server/supabase";
import {
  MAX_ATTEMPTS,
  codesMatch,
  deleteCode,
  getCodeRow,
  recordFailedAttempt,
} from "@/lib/server/resetCodes";

// Resets a password only with a valid, unexpired code that the server emailed
// (see /api/users/reset-password/request). The code is never sent to the browser.
export async function POST(req) {
  try {
    const { email, code, newPassword } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !code || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, code and new password are required" },
        { status: 400 }
      );
    }
    if (String(newPassword).length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const row = await getCodeRow(normalizedEmail);
    if (!row || new Date(row.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "This code has expired. Please request a new one." },
        { status: 400 }
      );
    }
    if (row.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { success: false, message: "Too many wrong attempts. Please request a new code." },
        { status: 429 }
      );
    }
    if (!codesMatch(normalizedEmail, code, row.code_hash)) {
      await recordFailedAttempt(normalizedEmail, row.attempts);
      return NextResponse.json({ success: false, message: "Invalid code." }, { status: 400 });
    }

    const users = await supabaseRest("users", {
      query: { select: "authUserId", qnews: `eq.${normalizedEmail}`, limit: "1" },
    });
    const user = users?.[0];
    if (!user?.authUserId) {
      await deleteCode(normalizedEmail);
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    await supabaseAuth(`admin/users/${user.authUserId}`, {
      method: "PUT",
      useServiceRole: true,
      body: { password: newPassword },
    });
    await deleteCode(normalizedEmail);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to reset password" },
      { status: error.status || 500 }
    );
  }
}
