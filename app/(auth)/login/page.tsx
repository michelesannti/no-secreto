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

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("ativo")
        .eq("id", user.id)
        .single();

      if (error || !profile?.ativo) {
        setMessage("Seu acesso ainda não foi liberado");
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

    const redirectTo = `${window.location.origin}/login`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setMessage("Erro ao enviar link de acesso");
      setLoading(false);
      return;
    }

    setMessage("Te enviei um link no email ✨");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] flex items-center justify-center text-[#70412d] px-6">
      <div className="w-full max-w-sm">

        <div className="mb-12 text-center">
          <h1 className="text-xl font-serif tracking-wide">
            No Secreto
          </h1>
          <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="
              px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]
              text-sm tracking-wide transition hover:opacity-90
              disabled:opacity-60 mt-2 self-center
            "
          >
            {loading ? "Enviando..." : "Entrar"}
          </button>

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