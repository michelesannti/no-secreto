import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 🔥 pega todos cookies
  const cookies = request.cookies.getAll();

  // 🔥 verifica se existe cookie do Supabase
  const hasSupabaseAuth = cookies.some((cookie) =>
    cookie.name.includes("sb-") && cookie.name.includes("auth-token")
  );

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  // 🚫 não logado → bloqueia
  if (!hasSupabaseAuth && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔁 já logado → não volta pro login
  if (hasSupabaseAuth && isAuthPage) {
    return NextResponse.redirect(new URL("/hoje", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};