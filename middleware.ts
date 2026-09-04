import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  // 1. Se acessar o domínio principal (nosecretoapp.com.br) na raiz (/), direciona para a página de vendas
  const isMainDomain = hostname === "nosecretoapp.com.br" || hostname === "www.nosecretoapp.com.br";
  if (isMainDomain && pathname === "/") {
    return NextResponse.rewrite(new URL("/vendas", req.url));
  }

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

  const isLogin = pathname.startsWith("/login");
  const isVendas = pathname.startsWith("/vendas");
  const isAuthRoute = pathname.startsWith("/primeiro-acesso") || pathname.startsWith("/redefinir-senha");

  // Permite acesso livre à página de vendas e rotas públicas de autenticação
  if (isVendas || isAuthRoute) {
    return res;
  }

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
    "/",
    "/hoje",
    "/secreto/:path*",
    "/diario",
    "/perfil",
    "/vendas",
  ],
};