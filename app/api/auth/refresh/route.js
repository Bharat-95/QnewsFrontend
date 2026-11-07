import { NextResponse } from "next/server";
import { supabaseAuth } from "@/lib/server/supabase";
import { NO_STORE_HEADERS } from "@/lib/server/cache";

// Exchanges a refresh token for a new access token so staff are not logged
// out every hour when their Supabase access token expires.
export async function POST(req) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json({ message: "refreshToken is required" }, { status: 400 });
    }

    const session = await supabaseAuth("token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: refreshToken },
    });

    return NextResponse.json(
      { token: session.access_token, refreshToken: session.refresh_token },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    return NextResponse.json({ message: "Session expired. Please log in again." }, { status: 401 });
  }
}
