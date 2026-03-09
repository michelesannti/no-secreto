"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

    // redireciona direto para HOJE
    router.replace("/hoje");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] flex items-center justify-center text-[#70412d] px-6">
      <div className="w-full max-w-sm">

        <div className="mb-12 text-center">
          <h1 className="text-xl font-serif tracking-wide">
            No Secreto
          </h1>

          <div className="w-12 h-px bg-[#C6A46A]/50 mt-3 mx-auto"></div>
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

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide transition hover:opacity-90 disabled:opacity-60"
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