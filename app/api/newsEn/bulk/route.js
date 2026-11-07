import { NextResponse } from "next/server";
import { ROLES, authErrorResponse, requireAuth } from "@/lib/server/auth";
import { supabaseRest } from "@/lib/server/supabase";
import { deleteNewsImageByUrl } from "@/lib/server/news";

export async function DELETE(req) {
  try {
    await requireAuth(req, { roles: ROLES.ADMIN });
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "ids is required" }, { status: 400 });
    }

    const rows = await supabaseRest("news", {
      query: {
        select: "newsId,image",
        newsId: `in.(${ids.join(",")})`,
      },
    });

    await supabaseRest("news", {
      method: "DELETE",
      query: {
        newsId: `in.(${ids.join(",")})`,
      },
    });

    const images = (rows || []).map((item) => item.image).filter(Boolean);
    await Promise.all(
      images.map(async (image) => {
        try {
          await deleteNewsImageByUrl(image);
        } catch (cleanupError) {
          console.error("Failed to delete bulk news image:", cleanupError);
        }
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    return NextResponse.json(
      { success: false, message: error.message || "Bulk delete failed", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
