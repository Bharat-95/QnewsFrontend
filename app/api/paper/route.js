import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/server/supabase";
import { savePaperFile, savePaperThumbnail } from "@/lib/server/paper";

export async function GET() {
  try {
    const rows = await supabaseRest("papers", {
      query: {
        select: "*",
        order: "publishedAt.desc",
      },
    });

    return NextResponse.json({ success: true, data: rows || [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch papers", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const thumbnail = formData.get("thumbnail");
    const fileUrlInput = formData.get("fileUrl")?.toString() || "";
    const thumbnailUrlInput = formData.get("thumbnailUrl")?.toString() || "";
    const date = (formData.get("date") || "").toString().trim();
    const month = (formData.get("month") || "").toString().trim();
    const year = (formData.get("year") || "").toString().trim();

    if ((!file && !fileUrlInput) || (!thumbnail && !thumbnailUrlInput) || !date || !month || !year) {
      return NextResponse.json(
        { success: false, message: "file/fileUrl, thumbnail/thumbnailUrl, date, month, year are required" },
        { status: 400 }
      );
    }

    const fileUrl = fileUrlInput || (await savePaperFile(file));
    const thumbnailUrl = thumbnailUrlInput || (await savePaperThumbnail(thumbnail));
    const publishedAt = new Date(Number(year), Number(month) - 1, Number(date)).toISOString();

    const rows = await supabaseRest("papers", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: [{
        date,
        month,
        year,
        fileUrl,
        thumbnailUrl,
        publishedAt,
      }],
    });

    return NextResponse.json({ success: true, data: rows?.[0] || null });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload paper", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
