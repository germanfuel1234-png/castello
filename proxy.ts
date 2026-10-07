import { NextResponse, type NextRequest } from "next/server";
import { proxyClient } from "@/lib/supabase/auth";
import { supabaseConfigurado } from "@/lib/supabase/client";

/**
 * Protección de rutas (Next 16 usa `proxy.ts`, antes middleware.ts).
 * - Modo demo (sin credenciales): todo accesible, sin sesión.
 * - Con Supabase configurado: exige sesión excepto en /login, /api y assets.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login") || pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (!supabaseConfigurado()) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = proxyClient(request, response);
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
