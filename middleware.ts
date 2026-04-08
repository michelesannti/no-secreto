import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sb-access-token");

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  // 🔥 não logado → bloqueia tudo
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔥 já logado → não deixa voltar pro login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/hoje", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};