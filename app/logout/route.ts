import { NextResponse } from "next/server";
import { signOut } from "@/lib/supabase/auth";
import { supabaseConfigurado } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

/** POST /logout — cierra la sesión de Supabase. */
export async function POST() {
  if (supabaseConfigurado()) {
    await signOut();
  }
  const url = new URL("/login", process.env.NEXTAUTH_URL ?? "http://localhost:3002");
  return NextResponse.redirect(url);
}
