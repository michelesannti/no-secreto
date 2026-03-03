"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Email ou senha inválidos.");
    } else {
      router.push("/secreto");
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

        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          <p className="text-sm text-center text-red-500">{message}</p>
        )}
      </form>
    </div>
  );
}