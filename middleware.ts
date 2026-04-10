import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  const isLogin = pathname.startsWith("/login");

  // 🚫 não logado → bloqueia tudo menos login
  if (!user && !isLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔥 NÃO valida ativo na hora do login
  if (user && !isLogin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("ativo")
      .eq("id", user.id)
      .single();

    if (!profile?.ativo) {
      // 👉 redireciona pra login SEM quebrar sessão
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/hoje",
    "/secreto/:path*",
    "/diario",
    "/perfil",
  ],
};