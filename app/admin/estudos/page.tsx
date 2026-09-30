"use client";

import { useState, useEffect } from "react";

interface BlocoEstudo {
  versiculo_inicio: number;
  versiculo_fim: number | "";
  texto: string;
  contexto: string;
  aplicacao: string;
  destaque: string;
}

export default function AdminEstudosPage() {
  const [livro, setLivro] = useState("");
  const [capitulo, setCapitulo] = useState<number>(1);
  const [jornadaOrdem, setJornadaOrdem] = useState<number>(1);
  const [qtdBlocos, setQtdBlocos] = useState<number | "">("");
  const [carregandoProximo, setCarregandoProximo] = useState(true);

  const [blocos, setBlocos] = useState<BlocoEstudo[]>([
    { versiculo_inicio: 1, versiculo_fim: "", texto: "", contexto: "", aplicacao: "", destaque: "" }
  ]);

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  // Consulta a API Admin para trazer o próximo estudo sequencial
  const carregarProximoCapitulo = async () => {
    setCarregandoProximo(true);
    try {
      const res = await fetch("/api/admin/estudos");
      const data = await res.json();

      if (data.proximoLivro && data.proximoCapitulo) {
        setLivro(data.proximoLivro);
        setCapitulo(data.proximoCapitulo);
        setJornadaOrdem(data.proximaJornadaOrdem || data.proximoCapitulo);

        setBlocos([
          { versiculo_inicio: 1, versiculo_fim: "", texto: "", contexto: "", aplicacao: "", destaque: "" }
        ]);
        setQtdBlocos("");
      }
    } catch (err) {
      console.error("Erro ao carregar próximo estudo:", err);
    } finally {
      setCarregandoProximo(false);
    }
  };

  useEffect(() => {
    carregarProximoCapitulo();
  }, []);

  const handleQtdBlocosChange = (novaQtd: number) => {
    setQtdBlocos(novaQtd);
    setBlocos((prevBlocos) => {
      const novos = [...prevBlocos];
      if (novaQtd > novos.length) {
        for (let i = novos.length; i < novaQtd; i++) {
          const ultimoFim = typeof novos[i - 1]?.versiculo_fim === "number" ? (novos[i - 1].versiculo_fim as number) : novos[i - 1].versiculo_inicio;
          novos.push({
            versiculo_inicio: ultimoFim + 1,
            versiculo_fim: "",
            texto: "",
            contexto: "",
            aplicacao: "",
            destaque: "",
          });
        }
      } else {
        novos.splice(novaQtd);
      }
      return novos;
    });
  };

  const handleBlocoChange = (index: number, field: keyof BlocoEstudo, value: any) => {
    setBlocos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };

      if (field === "versiculo_fim" && value && copy[index + 1]) {
        copy[index + 1].versiculo_inicio = parseInt(value, 10) + 1;
      }

      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    if (!qtdBlocos) {
      setMensagem({ tipo: "erro", texto: "Selecione a quantidade de estudos antes de registrar." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/estudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          livro,
          capitulo,
          jornada_ordem: jornadaOrdem,
          blocos,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar estudos.");
      }

      setMensagem({ tipo: "sucesso", texto: data.message || "Estudos registrados 🤎" });

      await carregarProximoCapitulo();
    } catch (err: any) {
      setMensagem({ tipo: "erro", texto: err.message || "Ocorreu um erro ao registrar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5e9] px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Cabeçalho Identidade No Secreto */}
        <div className="mb-12 text-center space-y-4">
          <img
            src="/logo.webp"
            alt="No Secreto"
            className="w-24 h-24 mx-auto object-contain"
          />

          <div>
            <h1 className="text-xl font-serif tracking-wide text-[#70412d]">
              Estudo Bíblico
            </h1>
            <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
          </div>
        </div>

        {/* Formulário Estilo Login / Creators */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {carregandoProximo ? (
            <p className="text-xs text-center text-[#70412d]/60 italic">
              Buscando próximo capítulo do banco...
            </p>
          ) : (
            <>
              {/* Referência do Capítulo */}
              <p className="text-lg font-serif font-semibold text-[#70412d] text-center">
                {livro} {capitulo}
              </p>

              {/* Seletor de Quantidade de Estudos */}
              <select
                value={qtdBlocos}
                onChange={(e) => handleQtdBlocosChange(parseInt(e.target.value, 10))}
                disabled={loading}
                required
                className={`bg-transparent border-b border-[#e9d5bb] p-2 focus:outline-none disabled:opacity-60 ${
                  qtdBlocos === "" ? "text-[#70412d]/60" : "text-[#70412d]"
                }`}
              >
                <option value="" disabled hidden className="bg-[#f9f5e9] text-[#70412d]/60">
                  Quantidade de Estudos
                </option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num} className="bg-[#f9f5e9] text-[#70412d]">
                    {num}
                  </option>
                ))}
              </select>

              {/* Blocos de Estudos */}
              <div className="flex flex-col gap-8">
                {blocos.map((bloco, idx) => (
                  <div key={idx} className="flex flex-col gap-8 pt-4 border-t border-[#e9d5bb]/60">
                    <div className="text-xs font-serif text-[#70412d]/70 tracking-wider uppercase">
                      Bloco {idx + 1} de {qtdBlocos || 1}
                    </div>

                    {/* Versículos */}
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Versículo Início"
                        value={bloco.versiculo_inicio}
                        readOnly
                        className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60 cursor-not-allowed"
                      />

                      <input
                        type="number"
                        min={bloco.versiculo_inicio}
                        placeholder="Versículo Fim"
                        value={bloco.versiculo_fim}
                        onChange={(e) =>
                          handleBlocoChange(idx, "versiculo_fim", e.target.value ? parseInt(e.target.value, 10) : "")
                        }
                        required
                        disabled={loading}
                        className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
                      />
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Texto"
                      value={bloco.texto}
                      onChange={(e) => handleBlocoChange(idx, "texto", e.target.value)}
                      disabled={loading}
                      className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60 resize-none"
                    />

                    <textarea
                      rows={2}
                      placeholder="Contexto"
                      value={bloco.contexto}
                      onChange={(e) => handleBlocoChange(idx, "contexto", e.target.value)}
                      disabled={loading}
                      className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60 resize-none"
                    />

                    <textarea
                      rows={2}
                      placeholder="Aplicação"
                      value={bloco.aplicacao}
                      onChange={(e) => handleBlocoChange(idx, "aplicacao", e.target.value)}
                      disabled={loading}
                      className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60 resize-none"
                    />

                    <input
                      type="text"
                      placeholder="Destaque"
                      value={bloco.destaque}
                      onChange={(e) => handleBlocoChange(idx, "destaque", e.target.value)}
                      disabled={loading}
                      className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]
                  text-sm tracking-wide transition
                  disabled:opacity-80 mt-2 self-center
                "
              >
                {loading ? "Registrando..." : "Registrar Capítulo"}
              </button>
            </>
          )}

          {mensagem && (
            <p
              className={`text-sm text-center ${
                mensagem.tipo === "sucesso" ? "text-[#70412d]" : "text-[#9b2c2c]"
              }`}
            >
              {mensagem.texto}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}