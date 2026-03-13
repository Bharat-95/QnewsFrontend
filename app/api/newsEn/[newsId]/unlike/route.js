import { NextResponse } from "next/server";
import { supabaseRpc } from "@/lib/server/supabase";

export async function PUT(req, { params }) {
  try {
    const { newsId } = await params;
    const { userEmail } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ message: "userEmail is required" }, { status: 400 });
    }

    const updated = await supabaseRpc("unlike_news", {
      p_news_id: newsId,
      p_user_email: userEmail,
    });

    if (!updated) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Unlike failed", details: error.data || null }, { status: error.status || 500 });
  }
}
