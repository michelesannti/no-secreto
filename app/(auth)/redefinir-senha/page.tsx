"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

export default function RedefinirSenhaPage() {
  const supabase = getSupabaseClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: `${window.location.origin}/nova-senha`,
      }
    );

    if (error) {
      setMessage("Não foi possível enviar o email. Tente novamente.");
      setLoading(false);
      return;
    }

    setMessage("Email de redefinição enviado");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#f9f5e9]">
      <div className="w-full max-w-sm">

        <div className="mb-12 text-center space-y-4">
          <img
            src="/logo.png"
            alt="No Secreto"
            className="w-24 h-24 mx-auto object-contain"
          />

          <div>
            <h1 className="text-xl font-serif tracking-wide">
              Redefinir Senha
            </h1>

            <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
          </div>
        </div>

        <form onSubmit={handleReset} className="flex flex-col gap-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Enviando..." : "Continuar"}
          </button>

          {message && (
            <p className="text-sm text-center text-[#70412d]/80">
              {message}
            </p>
          )}

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs text-[#70412d]/70 underline"
            >
              Voltar para o login
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}