"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase";

function PrimeiroAcessoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Estados para solicitar e-mail (sem token)
  const [email, setEmail] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  // Estados para cadastrar senha (com token)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validatingToken, setValidatingToken] = useState(!!token);
  const [tokenValid, setTokenValid] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    async function validateToken() {
      try {
        const res = await fetch("/api/primeiro-acesso/validar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok && data.userId) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch {
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    }

    validateToken();
  }, [token]);

  async function handleRequestAccess(e: React.FormEvent) {
    e.preventDefault();
    setRequestLoading(true);
    setRequestMessage("");

    try {
      const res = await fetch("/api/primeiro-acesso/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setRequestMessage(
        data.message || data.error || "Acesso enviado no email 🤎"
      );
    } catch {
      setRequestMessage("Erro ao enviar email. Tente novamente.");
    } finally {
      setRequestLoading(false);
    }
  }

  async function handleCreatePassword(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setResetMessage("As senhas não coincidem");
      return;
    }

    setResetLoading(true);
    setResetMessage("");

    try {
      const res = await fetch("/api/primeiro-acesso/concluir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResetMessage(data.error || "Erro ao cadastrar senha");
        setResetLoading(false);
        return;
      }

      const supabase = getSupabaseClient();
      await supabase.auth.signInWithPassword({
        email: data.email,
        password,
      });

      router.replace("/hoje");
    } catch {
      setResetMessage("Erro ao cadastrar senha. Tente novamente.");
      setResetLoading(false);
    }
  }

  // ESTADO 1: Validando token
  if (token && validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f5e9] px-6">
        <p className="text-[#70412d] text-sm">Validando seu acesso...</p>
      </div>
    );
  }

  // ESTADO 2: Token inválido ou expirado
  if (token && !tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f5e9] px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <p className="text-sm text-[#70412d]">
            Este link de primeiro acesso é inválido ou expirou.
          </p>

          <Link
            href="/login"
            className="text-xs text-[#70412d]/70 underline inline-block"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  // ESTADO 3: Token válido (Criar Senha)
  if (token && tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f5e9] px-6">
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

          <form onSubmit={handleCreatePassword} className="flex flex-col gap-8">
            <input
              type="password"
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={resetLoading}
              className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
            />

            <input
              type="password"
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={resetLoading}
              className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={resetLoading}
              className="
                px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]
                text-sm tracking-wide transition
                disabled:opacity-80 mt-2 self-center
              "
            >
              {resetLoading ? "Cadastrando..." : "Cadastrar Senha"}
            </button>

            {resetMessage && (
              <p className="text-sm text-center text-[#70412d]/80">
                {resetMessage}
              </p>
            )}

            <Link
              href="/login"
              className="text-xs text-center text-[#70412d]/70 underline"
            >
              Voltar para o login
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // ESTADO 4: Pedir e-mail de Primeiro Acesso
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5e9] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center space-y-4">
          <img
            src="/logo.png"
            alt="No Secreto"
            className="w-24 h-24 mx-auto object-contain"
          />

          <div>
            <h1 className="text-xl font-serif tracking-wide">
              Primeiro Acesso
            </h1>

            <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
          </div>
        </div>

        <form onSubmit={handleRequestAccess} className="flex flex-col gap-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={requestLoading}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={requestLoading}
            className="
              px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]
              text-sm tracking-wide transition
              disabled:opacity-80 mt-2 self-center
            "
          >
            {requestLoading ? "Enviando..." : "Continuar"}
          </button>

          {requestMessage && (
            <p className="text-sm text-center text-[#70412d]/80">
              {requestMessage}
            </p>
          )}

          <Link
            href="/login"
            className="text-xs text-center text-[#70412d]/70 underline"
          >
            Voltar para o login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default function PrimeiroAcessoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f9f5e9]" />}>
      <PrimeiroAcessoContent />
    </Suspense>
  );
}