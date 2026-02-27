import { NextResponse } from "next/server";
import { supabaseAuth, supabaseRest } from "@/lib/server/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const { password, firstName = "", lastName = "", phoneNumber = "", role = "User" } = body;
    const allowedRoles = new Set(["User", "Employee", "Admin", "SuperAdmin"]);
    const normalizedRole = allowedRoles.has(role) ? role : "User";

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const authUser = await supabaseAuth("signup", {
      method: "POST",
      body: {
        email,
        password,
        data: { firstName, lastName, role: normalizedRole },
      },
    });

    if (!authUser?.user?.id) {
      return NextResponse.json(
        { message: "Signup failed: Supabase user was not created", details: authUser || null },
        { status: 500 }
      );
    }

    await supabaseRest("users", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: {
        authUserId: authUser.user.id,
        qnews: email,
        firstName,
        lastName,
        phoneNumber,
        role: normalizedRole,
        status: "Active",
      },
    });

    const session = await supabaseAuth("token?grant_type=password", {
      method: "POST",
      body: { email, password },
    });

    return NextResponse.json({
      token: session.access_token,
      user: {
        email,
        role: normalizedRole,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { message: error.message || "Signup failed", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
