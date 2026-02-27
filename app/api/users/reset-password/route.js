import { NextResponse } from "next/server";
import { supabaseAuth, supabaseRest } from "@/lib/server/supabase";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !newPassword) {
      return NextResponse.json({ message: "Email and newPassword are required" }, { status: 400 });
    }

    const users = await supabaseRest("users", {
      query: {
        select: "authUserId",
        qnews: `eq.${normalizedEmail}`,
        limit: "1",
      },
    });

    const user = users?.[0];
    if (!user?.authUserId) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    await supabaseAuth(`admin/users/${user.authUserId}`, {
      method: "PUT",
      useServiceRole: true,
      body: { password: newPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to reset password", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
