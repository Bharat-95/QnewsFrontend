import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/server/supabase";

export async function GET() {
  try {
    const data = await supabaseRest("news", {
      query: {
        select: "*",
        order: "createdAt.desc",
      },
    });

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch all news", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
