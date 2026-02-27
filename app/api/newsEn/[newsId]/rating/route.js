import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ hasRated: false, userRating: 0 });
}
