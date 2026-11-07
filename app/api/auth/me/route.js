import { NextResponse } from "next/server";
import { authErrorResponse, requireAuth } from "@/lib/server/auth";
import { NO_STORE_HEADERS } from "@/lib/server/cache";

// Returns only the signed-in user's own profile.
export async function GET(req) {
  try {
    const { profile } = await requireAuth(req);
    return NextResponse.json(
      {
        user: {
          email: profile.qnews,
          role: profile.role,
          status: profile.status,
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          phoneNumber: profile.phoneNumber || "",
        },
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    return NextResponse.json({ message: error.message || "Failed to load user" }, { status: 500 });
  }
}
