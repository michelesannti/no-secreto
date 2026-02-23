"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const supabase = getSupabaseClient(); // 🔥 só cria aqui dentro

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
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}