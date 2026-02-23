"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("email ou senha inválidos");
      return;
    }

    const user = data.user;

    const { data: profile } = await supabase
      .from("profiles")
      .select("ativo")
      .eq("id", user?.id)
      .single();

    if (!profile || !profile.ativo) {
      setMessage("seu acesso ainda não está ativo");
      return;
    }

    window.location.href = "/hoje";
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Entrar No Secreto</h1>

      <input
        className="w-full border p-2 mb-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-[#3e3a36] text-white p-2"
        onClick={handleLogin}
      >
        Entrar
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}