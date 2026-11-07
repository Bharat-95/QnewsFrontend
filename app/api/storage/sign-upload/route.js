import { NextResponse } from "next/server";
import { ROLES, authErrorResponse, requireAuth } from "@/lib/server/auth";
import { getSupabaseConfig } from "@/lib/server/supabase";
import { NO_STORE_HEADERS } from "@/lib/server/cache";

// Buckets staff may upload to from the browser.
const ALLOWED_BUCKETS = new Set(["news-images", "video-thumbnails", "papers", "paper-thumbnails"]);

function safeSegment(value, fallback) {
  const cleaned = String(value || "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/^\.+/, "")
    .toLowerCase()
    .slice(0, 120);
  return cleaned || fallback;
}

// Issues a one-time signed upload URL. Only signed-in staff can get one, so
// the public anon key no longer needs upload rights on storage.
export async function POST(req) {
  try {
    await requireAuth(req, { roles: ROLES.STAFF });

    const { bucket, folder, fileName } = await req.json();
    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ message: "Invalid bucket" }, { status: 400 });
    }

    const { url, serviceRoleKey } = getSupabaseConfig();
    const objectPath = `${safeSegment(folder, "uploads")}/${Date.now()}-${crypto.randomUUID()}-${safeSegment(fileName, "file")}`;

    const res = await fetch(`${url}/storage/v1/object/upload/sign/${bucket}/${objectPath}`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: "{}",
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.url) {
      return NextResponse.json(
        { message: data?.message || "Could not create upload URL" },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(
      {
        uploadUrl: `${url}/storage/v1${data.url}`,
        publicUrl: `${url}/storage/v1/object/public/${bucket}/${objectPath}`,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    return NextResponse.json({ message: error.message || "Upload signing failed" }, { status: 500 });
  }
}
