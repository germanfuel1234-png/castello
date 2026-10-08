import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** POST /logout — no-op hasta que haya login real (ver README §5). */
export async function POST() {
  const url = new URL("/login", process.env.NEXTAUTH_URL ?? "http://localhost:3002");
  return NextResponse.redirect(url);
}
