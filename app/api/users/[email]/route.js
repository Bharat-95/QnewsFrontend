import { NextResponse } from "next/server";
import { ROLES, authErrorResponse, isAdmin, requireAuth } from "@/lib/server/auth";
import { supabaseAuth, supabaseRest } from "@/lib/server/supabase";

// Fields a signed-in user may change on their own profile.
const SELF_EDITABLE = ["firstName", "lastName", "phoneNumber"];
// Extra fields only admins may change.
const ADMIN_EDITABLE = [...SELF_EDITABLE, "role", "status"];
const VALID_ROLES = new Set(["User", "Employee", "Admin", "SuperAdmin"]);

function pick(source, keys) {
  const out = {};
  for (const key of keys) {
    if (source?.[key] !== undefined) out[key] = source[key];
  }
  return out;
}

async function loadTarget(email) {
  const rows = await supabaseRest("users", {
    query: { select: "*", qnews: `eq.${email}`, limit: "1" },
  });
  return rows?.[0] || null;
}

export async function PUT(req, { params }) {
  try {
    const session = await requireAuth(req);
    const { email } = await params;
    const targetEmail = decodeURIComponent(email).toLowerCase();
    const isSelf = session.email === targetEmail;
    const admin = isAdmin(session);

    if (!isSelf && !admin) {
      return NextResponse.json({ success: false, message: "You can only edit your own account." }, { status: 403 });
    }

    const target = await loadTarget(targetEmail);
    if (!target) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const payload = await req.json();
    const patch = pick(payload, admin ? ADMIN_EDITABLE : SELF_EDITABLE);

    if (patch.role !== undefined && !VALID_ROLES.has(patch.role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    // Only a SuperAdmin may grant SuperAdmin or modify an existing SuperAdmin.
    const touchesSuperAdmin = target.role === "SuperAdmin" || patch.role === "SuperAdmin";
    if (touchesSuperAdmin && !isSelf && !ROLES.SUPERADMIN.includes(session.role)) {
      return NextResponse.json({ success: false, message: "Only a SuperAdmin can do this." }, { status: 403 });
    }
    // Nobody changes their own role or status.
    if (isSelf) {
      delete patch.role;
      delete patch.status;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ success: true, data: target });
    }

    const rows = await supabaseRest("users", {
      method: "PATCH",
      query: { qnews: `eq.${targetEmail}`, select: "*" },
      body: patch,
      headers: { Prefer: "return=representation" },
    });

    return NextResponse.json({ success: true, data: rows?.[0] || null });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update user", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await requireAuth(req);
    const { email } = await params;
    const targetEmail = decodeURIComponent(email).toLowerCase();
    const isSelf = session.email === targetEmail;

    if (!isSelf && !isAdmin(session)) {
      return NextResponse.json({ success: false, message: "You can only delete your own account." }, { status: 403 });
    }

    const user = await loadTarget(targetEmail);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!isSelf && user.role === "SuperAdmin" && !ROLES.SUPERADMIN.includes(session.role)) {
      return NextResponse.json({ success: false, message: "Only a SuperAdmin can do this." }, { status: 403 });
    }

    await supabaseRest("users", {
      method: "DELETE",
      query: { qnews: `eq.${targetEmail}` },
    });

    if (user.authUserId) {
      await supabaseAuth(`admin/users/${user.authUserId}`, {
        method: "DELETE",
        useServiceRole: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete user", details: error.data || null },
      { status: error.status || 500 }
    );
  }
}
