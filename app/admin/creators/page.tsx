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
        texto: "Por favor, preencha todos os campos obrigatórios (Nome, E-mail e Instagram).",
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
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F0EBE1]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#3C3835] tracking-tight mb-2">
            Cadastrar Creator
          </h1>
          <p className="text-sm text-[#8C827A]">
            Preencha os dados abaixo para dar acesso e permissão de Creator à usuária.
          </p>
        </div>

        {mensagem && (
          <div
            className={`p-4 rounded-xl text-sm mb-6 ${
              mensagem.tipo === "sucesso"
                ? "bg-[#F2F7F2] text-[#2D5A27] border border-[#D3E4D1]"
                : "bg-[#FDF2F2] text-[#9B2C2C] border border-[#F8D7DA]"
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-xs font-medium text-[#655E57] uppercase tracking-wider mb-2">
              Nome Completo *
            </label>
            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Maria Silva"
              className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-[#E8E3DA] rounded-xl text-sm text-[#3C3835] placeholder-[#B5AEA7] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-[#655E57] uppercase tracking-wider mb-2">
              E-mail *
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@email.com"
              className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-[#E8E3DA] rounded-xl text-sm text-[#3C3835] placeholder-[#B5AEA7] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-xs font-medium text-[#655E57] uppercase tracking-wider mb-2">
              Instagram *
            </label>
            <input
              id="instagram"
              type="text"
              required
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@nomedeusuario"
              className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-[#E8E3DA] rounded-xl text-sm text-[#3C3835] placeholder-[#B5AEA7] focus:outline-none focus:ring-2 focus:ring-[#8C7A6B] focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 px-6 bg-[#3C3835] hover:bg-[#2A2725] text-white font-medium rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? "Cadastrando..." : "Cadastrar Creator"}
          </button>
        </form>
      </div>
    </div>
  );
}