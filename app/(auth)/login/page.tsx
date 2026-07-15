"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkEnviado, setLinkEnviado] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // ✅ procura profile pelo ID do usuário autenticado
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("ativo")
        .eq("id", user.id)
        .maybeSingle();

      // ❌ sem acesso
      if (profileError || !profile?.ativo) {
        await supabase.auth.signOut();
        setMessage("Esse email ainda não possui acesso");
        return;
      }

      // ✅ acesso liberado
      router.replace("/hoje");
    }

    checkUser();
  }, [router, supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    const redirectTo = `${window.location.origin}/login`;

    // ✅ envia magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setMessage("Erro ao enviar link de acesso");
      setLoading(false);
      return;
    }

    setLinkEnviado(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] flex items-center justify-center text-[#70412d] px-6">
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
            disabled={loading || linkEnviado}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading || linkEnviado}
            className="
              px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]
              text-sm tracking-wide transition
              disabled:opacity-80 mt-2 self-center
            "
          >
            {loading
              ? "Enviando..."
              : linkEnviado
              ? "Acesso enviado no email"
              : "Entrar"}
          </button>

          {message && !linkEnviado && (
            <p className="text-sm text-center text-[#70412d]/80">
              {message}
            </p>
          )}

        </form>

      </div>
    </div>
  );
}