import { NextResponse } from "next/server";
import { supabaseAuth, supabaseRest } from "@/lib/server/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const { password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const session = await supabaseAuth("token?grant_type=password", {
      method: "POST",
      body: { email, password },
    });

    const profiles = await supabaseRest("users", {
      query: {
        select: "*",
        authUserId: `eq.${session.user.id}`,
        limit: "1",
      },
    });

    const profile = Array.isArray(profiles) ? profiles[0] : null;

    if (!profile) {
      return NextResponse.json({ message: "User profile not found" }, { status: 404 });
    }

    if (profile.status === "Blocked") {
      return NextResponse.json({ message: "User is blocked" }, { status: 403 });
    }

    return NextResponse.json({
      token: session.access_token,
      user: {
        email: profile.qnews,
        role: profile.role,
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Signin failed", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
