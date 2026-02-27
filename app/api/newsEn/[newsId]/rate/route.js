import { NextResponse } from "next/server";

export async function PUT() {
  return NextResponse.json({ success: true, message: "Rating is currently disabled" });
}
