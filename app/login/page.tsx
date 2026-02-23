"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      setMessage("Erro ao enviar email.");
    } else {
      setMessage("Verifique seu email para o link de acesso.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6]">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <h1 className="text-xl font-serif text-center">
          Entrar
        </h1>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-[#7a5c45] text-white py-2 rounded"
        >
          Entrar
        </button>

        {message && (
          <p className="text-sm text-center">{message}</p>
        )}
      </form>
    </div>
  );
}