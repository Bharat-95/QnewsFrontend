import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/server/supabase";

export async function GET() {
  try {
    const users = await supabaseRest("users", {
      query: {
        select: "*",
        order: "createdAt.desc",
      },
    });

    return NextResponse.json({ data: users || [] });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch users", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
