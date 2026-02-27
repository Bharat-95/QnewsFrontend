import { NextResponse } from "next/server";
import { supabaseAuth, supabaseRest } from "@/lib/server/supabase";

export async function PUT(req, { params }) {
  try {
    const { email } = await params;
    const payload = await req.json();

    const rows = await supabaseRest("users", {
      method: "PATCH",
      query: {
        qnews: `eq.${decodeURIComponent(email).toLowerCase()}`,
        select: "*",
      },
      body: payload,
      headers: { Prefer: "return=representation" },
    });

    return NextResponse.json({ success: true, data: rows?.[0] || null });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update user", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { email } = await params;
    const normalizedEmail = decodeURIComponent(email).toLowerCase();

    const users = await supabaseRest("users", {
      query: { select: "*", qnews: `eq.${normalizedEmail}`, limit: "1" },
    });

    const user = users?.[0];
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    await supabaseRest("users", {
      method: "DELETE",
      query: { qnews: `eq.${normalizedEmail}` },
    });

    if (user.authUserId) {
      await supabaseAuth(`admin/users/${user.authUserId}`, {
        method: "DELETE",
        useServiceRole: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete user", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
