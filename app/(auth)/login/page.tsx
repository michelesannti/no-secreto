"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("ativo")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile?.ativo) {
        await supabase.auth.signOut();
        setMessage("Esse email ainda não possui acesso");
        return;
      }

      router.replace("/hoje");
    }

    checkUser();
  }, [router, supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      setMessage("Email ou senha incorretos");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Não foi possível autenticar. Tente novamente.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("ativo")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || !profile?.ativo) {
      await supabase.auth.signOut();
      setMessage("Esse email ainda não possui acesso");
      setLoading(false);
      return;
    }

    router.replace("/hoje");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5e9] px-6">
      <div className="w-full max-w-sm">

        <div className="mb-12 text-center space-y-4">
          <img
            src="/logo.png"
            alt="No Secreto"
            className="w-24 h-24 mx-auto object-contain"
          />

          <div>
            <h1 className="text-xl font-serif tracking-wide">
              No Secreto
            </h1>
            <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading}
            className="
              px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]
              text-sm tracking-wide transition
              disabled:opacity-80 mt-2 self-center
            "
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="flex items-center justify-center gap-3 text-xs pt-2 text-[#70412d]/70">
            <Link
              href="/primeiro-acesso"
              className="underline hover:text-[#70412d] transition"
            >
              Primeiro Acesso
            </Link>

            <span>•</span>

            <Link
              href="/redefinir-senha"
              className="underline hover:text-[#70412d] transition"
            >
              Esqueci Minha Senha
            </Link>
          </div>

          {message && (
            <p className="text-sm text-center text-[#70412d]/80">
              {message}
            </p>
          )}
        </form>

      </div>
    </div>
  );
}