import { NextResponse, type NextRequest } from "next/server";

/**
 * Protección de rutas (Next 16 usa `proxy.ts`, antes middleware.ts).
 * Todavía no hay autenticación implementada (ver README §5) — todo
 * accesible por ahora. Cuando exista login real, acá se vuelve a exigir
 * sesión excepto en /login, /api y assets.
 */
export default async function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
