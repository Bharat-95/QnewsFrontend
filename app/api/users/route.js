import { NextResponse } from "next/server";
import { ROLES, authErrorResponse, requireAuth } from "@/lib/server/auth";
import { supabaseRest } from "@/lib/server/supabase";

export async function GET(req) {
  try {
    await requireAuth(req, { roles: ROLES.ADMIN });
    const users = await supabaseRest("users", {
      query: {
        select: "*",
        order: "createdAt.desc",
      },
    });

    return NextResponse.json({ data: users || [] });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    return NextResponse.json(
      { message: error.message || "Failed to fetch users", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
