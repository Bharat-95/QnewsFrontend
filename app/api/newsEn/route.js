import { NextResponse } from "next/server";
import { fetchNewsList, saveNewsImage, toSlug } from "@/lib/server/news";
import { supabaseRest } from "@/lib/server/supabase";

const LIST_PARAMS = ["category", "status", "sort", "limit"];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // List mode: filtered, limited, card columns only. Used by the public pages.
    if (LIST_PARAMS.some((key) => searchParams.has(key))) {
      const data = await fetchNewsList({
        category: searchParams.get("category") || undefined,
        status: searchParams.get("status") || undefined,
        sort: searchParams.get("sort") || undefined,
        limit: searchParams.get("limit") || undefined,
      });

      return NextResponse.json(
        { data },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
      );
    }

    // No params: full rows for the admin pages (approve-news, add-news).
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
