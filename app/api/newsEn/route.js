import { NextResponse } from "next/server";
import { saveNewsImage, toSlug } from "@/lib/server/news";
import { supabaseRest } from "@/lib/server/supabase";

export async function GET() {
  try {
    const data = await supabaseRest("news", {
      query: {
        select: "*",
        order: "createdAt.desc",
      },
    });

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch news", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const headlineEn = formData.get("headlineEn")?.toString() || "";
    const headlineTe = formData.get("headlineTe")?.toString() || "";
    const newsEn = formData.get("newsEn")?.toString() || "";
    const newsTe = formData.get("newsTe")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const employeeId = formData.get("employeeId")?.toString() || "";
    const imageInput = formData.get("image");

    if (!headlineEn || !headlineTe || !newsEn || !newsTe || !category || !employeeId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const imagePath =
      typeof imageInput === "string"
        ? imageInput
        : imageInput && typeof imageInput === "object"
          ? await saveNewsImage(imageInput)
          : "";

    const inserted = await supabaseRest("news", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: {
        headlineEn,
        headlineTe,
        newsEn,
        newsTe,
        category,
        employeeId,
        image: imagePath,
        status: "Pending",
        likes: 0,
        likedBy: [],
        comments: [],
        slug: toSlug(headlineEn),
      },
    });

    return NextResponse.json({ success: true, data: inserted?.[0] || null });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add news", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
