"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function NovaSenhaPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage("Não foi possível salvar a senha. Tente novamente.");
      setLoading(false);
      return;
    }

    setMessage("Senha salva com sucesso");

    setTimeout(() => {
      router.replace("/login");
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="mb-12 text-center space-y-4">
          <img
            src="/logo.png"
            alt="No Secreto"
            className="w-24 h-24 mx-auto object-contain"
          />

          <div>
            <h1 className="text-xl font-serif tracking-wide">
              Senha
            </h1>

            <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
          </div>
        </div>

        <form
          onSubmit={handleUpdatePassword}
          className="flex flex-col gap-8"
        >
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
          />

          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Salvando..." : "Salvar"}
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