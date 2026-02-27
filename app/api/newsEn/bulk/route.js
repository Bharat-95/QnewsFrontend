import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/server/supabase";

export async function DELETE(req) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "ids is required" }, { status: 400 });
    }

    await supabaseRest("news", {
      method: "DELETE",
      query: {
        newsId: `in.(${ids.join(",")})`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Bulk delete failed", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
