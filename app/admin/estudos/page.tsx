"use client";

import { useState, useEffect, useRef } from "react";

interface BlocoEstudo {
  versiculo_inicio: number;
  versiculo_fim: number | "";
  texto: string;
  contexto: string;
  aplicacao: string;
  destaque: string;
  carregandoTexto?: boolean;
}

// SVG exato do chevron nativo (#70412d)
const CHEVRON_NATIVO_SVG = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2370412d' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`;

// Dropdown Customizado para a Quantidade de Estudos
function DropdownQtdEstudos({
  valor,
  onChange,
  disabled,
}: {
  valor: number | "";
  onChange: (val: number) => void;
  disabled?: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const opcoes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const labelAtual = valor !== "" ? `${valor} ${valor === 1 ? "Estudo" : "Estudos"}` : "Total de Estudos";

  return (
    <div className="relative w-full max-w-xs mx-auto" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setAberto(!aberto)}
        style={{
          backgroundImage: CHEVRON_NATIVO_SVG,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.25em 1.25em",
        }}
        className={`w-full bg-transparent border-b border-[#e9d5bb] pl-2 pr-8 py-2 text-sm text-center focus:outline-none transition tabular-nums ${
          valor === "" ? "text-[#70412d]/60" : "text-[#70412d] font-medium"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="block text-center">{labelAtual}</span>
      </button>

      {aberto && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#f9f5e9] border border-[#e9d5bb] rounded-2xl p-1.5 shadow-xl space-y-1 max-h-60 overflow-y-auto">
          {opcoes.map((num) => {
            const ehSelecionado = num === valor;
            return (
              <button
                key={num}
                type="button"
                onClick={() => {
                  onChange(num);
                  setAberto(false);
                }}
                className={`w-full text-center py-2 px-3 rounded-xl text-sm transition tabular-nums ${
                  ehSelecionado
                    ? "bg-[#70412d] text-[#f9f5e9] font-medium shadow-sm"
                    : "text-[#70412d] hover:bg-[#efe2cc]"
                }`}
              >
                {num} {num === 1 ? "Estudo" : "Estudos"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Dropdown Customizado para o Versículo Fim
function DropdownVersiculoFim({
  valor,
  opcoes,
  onChange,
  disabled,
}: {
  valor: number | "";
  opcoes: number[];
  onChange: (val: number) => void;
  disabled?: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-16" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setAberto(!aberto)}
        style={{
          backgroundImage: CHEVRON_NATIVO_SVG,
          backgroundPosition: "right 0.35rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "0.9em 0.9em",
        }}
        className={`w-16 h-8 bg-white border border-[#E9D5BB] rounded-xl pl-2 pr-5 text-sm text-center focus:outline-none shadow-inner transition flex items-center justify-center font-sans tabular-nums ${
          valor === "" ? "text-[#70412d]/60" : "text-[#70412d] font-medium"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="block text-center">{valor !== "" ? valor : ""}</span>
      </button>

      {aberto && (
        <div className="absolute right-0 top-full mt-2 z-50 w-24 bg-[#f9f5e9] border border-[#e9d5bb] rounded-xl p-1 shadow-xl space-y-1 max-h-48 overflow-y-auto">
          {opcoes.map((v) => {
            const ehSelecionado = v === valor;
            return (
              <button
                key={v}
                type="button"
                onClick={() => {
                  onChange(v);
                  setAberto(false);
                }}
                className={`w-full text-center py-1 px-2 rounded-lg text-xs transition font-sans tabular-nums ${
                  ehSelecionado
                    ? "bg-[#70412d] text-[#f9f5e9] font-bold shadow-sm"
                    : "text-[#70412d] hover:bg-[#efe2cc]"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminEstudosPage() {
  const [livro, setLivro] = useState("");
  const [capitulo, setCapitulo] = useState<number>(1);
  const [totalVersiculos, setTotalVersiculos] = useState<number>(30);
  const [jornadaOrdem, setJornadaOrdem] = useState<number>(1);
  const [qtdBlocos, setQtdBlocos] = useState<number | "">("");
  const [carregandoProximo, setCarregandoProximo] = useState(true);

  const [blocos, setBlocos] = useState<BlocoEstudo[]>([
    { versiculo_inicio: 1, versiculo_fim: "", texto: "", contexto: "", aplicacao: "", destaque: "" }
  ]);

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  const carregarProximoCapitulo = async () => {
    setCarregandoProximo(true);
    try {
      const res = await fetch("/api/admin/estudos");
      const data = await res.json();

      if (data.proximoLivro && data.proximoCapitulo) {
        setLivro(data.proximoLivro);
        setCapitulo(data.proximoCapitulo);
        setTotalVersiculos(data.totalVersiculos || 30);
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

  const buscarTextoAutomatico = async (index: number, inicio: number, fim: number) => {
    if (!fim || fim < inicio) return;

    setBlocos((prev) => {
      const copy = [...prev];
      copy[index].carregandoTexto = true;
      return copy;
    });

    try {
      const res = await fetch(`/api/admin/estudos/versiculos?livro=${encodeURIComponent(livro)}&capitulo=${capitulo}&inicio=${inicio}&fim=${fim}`);
      const data = await res.json();

      setBlocos((prev) => {
        const copy = [...prev];
        copy[index].texto = data.texto || "";
        copy[index].carregandoTexto = false;
        return copy;
      });
    } catch (error) {
      console.error("Erro ao buscar texto automático:", error);
      setBlocos((prev) => {
        const copy = [...prev];
        copy[index].carregandoTexto = false;
        return copy;
      });
    }
  };

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

      if (field === "versiculo_fim" && value) {
        const fimNum = parseInt(value, 10);
        if (copy[index + 1]) {
          copy[index + 1].versiculo_inicio = fimNum + 1;
        }
        buscarTextoAutomatico(index, copy[index].versiculo_inicio, fimNum);
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

    // TRAVA COMPLETA DE CAMPOS
    for (let i = 0; i < blocos.length; i++) {
      const b = blocos[i];
      if (
        b.versiculo_fim === "" ||
        !b.texto?.trim() ||
        !b.contexto?.trim() ||
        !b.aplicacao?.trim() ||
        !b.destaque?.trim()
      ) {
        setMensagem({
          tipo: "erro",
          texto: `Preencha todos os campos do Estudo ${i + 1} antes de registrar`,
        });
        return;
      }
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

  const gerarOpcoesVersiculos = (inicio: number) => {
    const opcoes = [];
    for (let v = inicio; v <= totalVersiculos; v++) {
      opcoes.push(v);
    }
    return opcoes;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5e9] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center space-y-4">
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {carregandoProximo ? (
            <p className="text-xs text-center text-[#70412d]/60 italic">
              Buscando próximo capítulo...
            </p>
          ) : (
            <>
              <p className="text-xl font-sans font-bold text-[#70412d] text-center tracking-wide tabular-nums">
                {livro} {capitulo}
              </p>

              <DropdownQtdEstudos
                valor={qtdBlocos}
                onChange={handleQtdBlocosChange}
                disabled={loading}
              />

              <div className="flex flex-col gap-6">
                {blocos.map((bloco, idx) => (
                  <div
                    key={idx}
                    className="bg-[#EFE2CC]/50 border border-[#E9D5BB] rounded-2xl overflow-hidden shadow-sm flex flex-col backdrop-blur-sm"
                  >
                    <div className="bg-[#EFE2CC] px-4 py-3 flex items-center justify-between border-b border-[#E9D5BB]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#70412d] tabular-nums">
                        Estudo {idx + 1}
                      </span>
                      
                      <div className="flex flex-col items-center">
                        <label className="text-[10px] font-bold tracking-wider text-[#70412d] uppercase mb-1">
                          VERSÍCULOS
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-8 bg-[#E9D5BB]/30 border border-[#E9D5BB] rounded-xl text-sm text-[#70412d]/70 text-center font-medium shadow-inner flex items-center justify-center font-sans tabular-nums cursor-not-allowed select-none">
                            {bloco.versiculo_inicio}
                          </div>
                          <span className="text-xs text-[#70412d]/60">até</span>
                          <DropdownVersiculoFim
                            valor={bloco.versiculo_fim}
                            opcoes={gerarOpcoesVersiculos(bloco.versiculo_inicio)}
                            onChange={(val) => handleBlocoChange(idx, "versiculo_fim", val)}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold tracking-wider text-[#70412d]/80 uppercase flex items-center justify-between">
                          <span>VERSÍCULOS </span>
                          {bloco.carregandoTexto && <span className="text-[9px] italic text-[#70412d]/60">Buscando texto...</span>}
                        </label>
                        <textarea
                          rows={4}
                          value={bloco.texto}
                          readOnly
                          className="bg-[#E9D5BB]/30 border border-[#E9D5BB] rounded-xl p-3 text-sm text-[#70412d]/80 placeholder:text-[#70412d]/40 focus:outline-none resize-none shadow-inner cursor-not-allowed font-sans"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold tracking-wider text-[#70412d]/80 uppercase">
                          CONTEXTO
                        </label>
                        <textarea
                          rows={2}
                          value={bloco.contexto}
                          onChange={(e) => handleBlocoChange(idx, "contexto", e.target.value)}
                          disabled={loading}
                          className="bg-white border border-[#E9D5BB] rounded-xl p-3 text-sm text-[#70412d] focus:outline-none focus:ring-1 focus:ring-[#70412d]/30 resize-none shadow-inner"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold tracking-wider text-[#70412d]/80 uppercase">
                          APLICAÇÃO
                        </label>
                        <textarea
                          rows={2}
                          value={bloco.aplicacao}
                          onChange={(e) => handleBlocoChange(idx, "aplicacao", e.target.value)}
                          disabled={loading}
                          className="bg-white border border-[#E9D5BB] rounded-xl p-3 text-sm text-[#70412d] focus:outline-none focus:ring-1 focus:ring-[#70412d]/30 resize-none shadow-inner"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold tracking-wider text-[#70412d]/80 uppercase">
                          DESTAQUE
                        </label>
                        <input
                          type="text"
                          value={bloco.destaque}
                          onChange={(e) => handleBlocoChange(idx, "destaque", e.target.value)}
                          disabled={loading}
                          className="bg-white border border-[#E9D5BB] rounded-xl p-3 text-sm text-[#70412d] focus:outline-none focus:ring-1 focus:ring-[#70412d]/30 shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  px-8 py-3 rounded-full bg-[#70412d] text-[#f9f5e9]
                  text-sm font-medium tracking-wide transition shadow-md hover:bg-[#5c3524]
                  disabled:opacity-80 mt-2 self-center
                "
              >
                {loading ? "Registrando..." : "Registrar Capítulo"}
              </button>
            </>
          )}

          {mensagem && (
            <p
              className={`text-sm text-center font-medium ${
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