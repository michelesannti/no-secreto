"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RedefinirSenhaPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    const savedSuccess = sessionStorage.getItem("redefinir_senha_enviado");
    const savedEmail = sessionStorage.getItem("redefinir_senha_email");
    const savedMessage = sessionStorage.getItem("redefinir_senha_message");

    if (savedSuccess === "true") {
      setRequestSuccess(true);
      if (savedEmail) setEmail(savedEmail);
      if (savedMessage) setMessage(savedMessage);
    }
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (requestSuccess) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Não foi possível enviar o email. Tente novamente.");
        setLoading(false);
        return;
      }

      const msg = data.message || "Email de redefinição enviado 🤎";
      setMessage(msg);
      setRequestSuccess(true);

      sessionStorage.setItem("redefinir_senha_enviado", "true");
      sessionStorage.setItem("redefinir_senha_email", email);
      sessionStorage.setItem("redefinir_senha_message", msg);
    } catch {
      setMessage("Erro ao solicitar redefinição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#f9f5e9]">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center space-y-4">
          <img
            src="/logo.webp"
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
            disabled={loading || requestSuccess}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading || requestSuccess}
            className="
              px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]
              text-sm tracking-wide transition
              disabled:opacity-60 mt-2 self-center cursor-pointer disabled:cursor-not-allowed
            "
          >
            {loading ? "Enviando..." : requestSuccess ? "Enviado" : "Continuar"}
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