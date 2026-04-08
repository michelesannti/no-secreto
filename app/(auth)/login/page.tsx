"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 NOVO: se já estiver logado, pula login
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/hoje");
      }
    }

    checkUser();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Email ou senha inválidos");
      setLoading(false);
      return;
    }

    router.replace("/hoje");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] flex items-center justify-center text-[#70412d] px-6">
      <div className="w-full max-w-sm">

        {/* TOPO PADRONIZADO */}
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

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none"
          />

          {/* BOTÃO PADRONIZADO */}
          <button
            type="submit"
            disabled={loading}
            className="
              px-6
              py-2
              rounded-full
              bg-[#70412d]
              text-[#f9f5e9]
              text-sm
              tracking-wide
              transition
              hover:opacity-90
              disabled:opacity-60
              mt-2
              self-center
            "
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {message && (
            <p className="text-sm text-center text-red-500">
              {message}
            </p>
          )}

        </form>

      </div>
    </div>
  );
}