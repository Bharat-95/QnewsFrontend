import { NextResponse } from "next/server";
import { ROLES, authErrorResponse, requireAuth } from "@/lib/server/auth";
import { supabaseRest } from "@/lib/server/supabase";

export async function PUT(req, { params }) {
  try {
    await requireAuth(req, { roles: ROLES.ADMIN });
    const { videoId } = await params;
    const payload = await req.json();

    const rows = await supabaseRest("videos", {
      method: "PATCH",
      query: {
        videoId: `eq.${videoId}`,
        select: "*",
      },
      headers: {
        Prefer: "return=representation",
      },
      body: payload,
    });

    return NextResponse.json({ success: true, data: rows?.[0] || null });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    return NextResponse.json(
      { success: false, message: error.message || "Error updating video", error: error.data || null },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAuth(req, { roles: ROLES.ADMIN });
    const { videoId } = await params;

    await supabaseRest("videos", {
      method: "DELETE",
      query: {
        videoId: `eq.${videoId}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    return NextResponse.json(
      { success: false, message: error.message || "Error deleting video", error: error.data || null },
      { status: error.status || 500 }
    );
  }
}
