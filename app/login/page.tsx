"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert("Erro ao enviar email: " + error.message);
    } else {
      alert("Verifique seu email para entrar");
    }

    setLoading(false);
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Enviando..." : "Entrar"}
      </button>
    </div>
  );
}