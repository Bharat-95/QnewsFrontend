import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseRest } from "./supabase";

export const ROLES = {
  STAFF: ["Employee", "Admin", "SuperAdmin"],
  ADMIN: ["Admin", "SuperAdmin"],
  SUPERADMIN: ["SuperAdmin"],
};

export class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function bearerToken(req) {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

// Verifies the Supabase access token with Supabase Auth and loads the
// matching profile row. Returns null when there is no valid session.
export async function getSession(req) {
  const token = bearerToken(req);
  if (!token) return null;

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) throw new Error("Supabase auth is not configured");

  const res = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const authUser = await res.json().catch(() => null);
  if (!authUser?.id) return null;

  const rows = await supabaseRest("users", {
    query: { select: "*", authUserId: `eq.${authUser.id}`, limit: "1" },
  });
  const profile = Array.isArray(rows) ? rows[0] : null;
  if (!profile) return null;

  return { authUser, profile, email: (profile.qnews || "").toLowerCase(), role: profile.role };
}

// Throws AuthError (401/403) unless the caller is signed in, not blocked,
// and (when roles are given) has one of the allowed roles.
export async function requireAuth(req, { roles } = {}) {
  const session = await getSession(req);
  if (!session) throw new AuthError("Please log in again.", 401);
  if (session.profile.status === "Blocked") throw new AuthError("User is blocked", 403);
  if (roles && !roles.includes(session.role)) {
    throw new AuthError("You do not have permission to do this.", 403);
  }
  return session;
}

export function isAdmin(session) {
  return !!session && ROLES.ADMIN.includes(session.role);
}

export function authErrorResponse(error) {
  if (error instanceof AuthError) {
    return NextResponse.json({ success: false, message: error.message }, { status: error.status });
  }
  return null;
}
