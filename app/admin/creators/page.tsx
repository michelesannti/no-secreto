"use client";

import { useState } from "react";

export default function AdminCreatorsPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    if (!nome.trim() || !email.trim() || !instagram.trim()) {
      setMensagem({
        tipo: "erro",
        texto: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, instagram }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar Creator.");
      }

      setMensagem({
        tipo: "sucesso",
        texto: data.message || "Creator cadastrada com sucesso!",
      });

      // Limpa os campos após o sucesso
      setNome("");
      setEmail("");
      setInstagram("");
    } catch (err: any) {
      setMensagem({
        tipo: "erro",
        texto: err.message || "Ocorreu um erro ao processar o cadastro.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5e9] px-6">
      <div className="w-full max-w-sm">
        {/* Cabeçalho Identidade No Secreto */}
        <div className="mb-12 text-center space-y-4">
          <img
            src="/logo.png"
            alt="No Secreto"
            className="w-24 h-24 mx-auto object-contain"
          />

          <div>
            <h1 className="text-xl font-serif tracking-wide text-[#70412d]">
              Cadastro de Creators
            </h1>
            <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
          </div>
        </div>

        {/* Formulário Estilo Login */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={loading}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
          />

          <input
            type="text"
            placeholder="Instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
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
            {loading ? "Cadastrando..." : "Cadastrar Creator"}
          </button>

          {mensagem && (
            <p className={`text-sm text-center ${
              mensagem.tipo === "sucesso" ? "text-[#70412d]" : "text-[#9b2c2c]"
            }`}>
              {mensagem.texto}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}