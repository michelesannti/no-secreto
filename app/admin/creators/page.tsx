"use client";

import { useState } from "react";

export default function AdminCreatorsPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, instagram }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar creator.");
      }

      setMessage({ type: "success", text: "Creator cadastrada com sucesso!" });
      setNome("");
      setEmail("");
      setInstagram("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Erro de conexão." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F5E9] text-[#70412D] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#E9D5BB] shadow-sm">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold uppercase tracking-wide">
            Painel Admin
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] opacity-60 mt-1">
            Cadastro de Creators
          </p>
          <div className="w-10 h-[2px] bg-[#E9D5BB] mx-auto mt-4" />
        </div>

        {/* Mensagens de Feedback */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs text-center font-medium ${
              message.type === "success"
                ? "bg-[#70412D]/10 text-[#70412D] border border-[#70412D]/20"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-2 opacity-70">
              Nome da Creator
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Maria Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#F9F5E9] border border-[#E9D5BB] text-sm text-[#70412D] placeholder-[#70412D]/40 focus:outline-none focus:ring-2 focus:ring-[#70412D]/20"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-2 opacity-70">
              E-mail
            </label>
            <input
              type="email"
              required
              placeholder="creator@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#F9F5E9] border border-[#E9D5BB] text-sm text-[#70412D] placeholder-[#70412D]/40 focus:outline-none focus:ring-2 focus:ring-[#70412D]/20"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-2 opacity-70">
              Instagram (Opcional)
            </label>
            <input
              type="text"
              placeholder="@seuinstagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#F9F5E9] border border-[#E9D5BB] text-sm text-[#70412D] placeholder-[#70412D]/40 focus:outline-none focus:ring-2 focus:ring-[#70412D]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-[#70412D] text-[#F9F5E9] rounded-full text-sm font-semibold tracking-wide hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 shadow-md"
          >
            {loading ? "Cadastrando..." : "Cadastrar Creator"}
          </button>
        </form>
      </div>
    </main>
  );
}