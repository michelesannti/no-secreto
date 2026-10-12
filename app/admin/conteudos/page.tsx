"use client";

import { useState, useEffect, useRef } from "react";

interface Creator {
  id: string;
  nome: string;
  instagram: string;
}

// SVG do chevron em creme (#f9f5e9) para fundos marrons
const CHEVRON_CREME_SVG = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23f9f5e9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`;

// SVG do chevron em marrom (#70412d) para fundos claros
const CHEVRON_MARROM_SVG = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2370412d' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`;

// Dropdown Customizado para Selecionar a Creator com Pesquisa
function DropdownCreatorCustomizado({
  creators,
  selectedId,
  onChange,
  disabled,
}: {
  creators: Creator[];
  selectedId: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
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

  const creatorSelecionada = creators.find((c) => c.id === selectedId);
  const labelAtual = creatorSelecionada 
    ? `${creatorSelecionada.nome} (@${creatorSelecionada.instagram})` 
    : "Creator";

  const creatorsFiltradas = creators.filter((c) => {
    const texto = `${c.nome} (@${c.instagram})`.toLowerCase();
    return texto.includes(busca.toLowerCase());
  });

  const temSelecao = Boolean(selectedId);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setAberto(!aberto)}
        style={{
          backgroundImage: temSelecao ? CHEVRON_CREME_SVG : CHEVRON_MARROM_SVG,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.25em 1.25em",
        }}
        className={`w-full rounded-xl pl-3 pr-8 py-2 text-sm text-center focus:outline-none transition shadow-sm truncate ${
          temSelecao
            ? "bg-[#70412d] text-[#f9f5e9] font-medium"
            : "bg-transparent border-b border-[#e9d5bb] text-[#70412d]/60 text-left pl-2"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="block truncate">{labelAtual}</span>
      </button>

      {aberto && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#f9f5e9] border border-[#e9d5bb] rounded-2xl p-2 shadow-xl space-y-2">
          {/* Input de Pesquisa interno */}
          <input
            type="text"
            placeholder="Pesquisar creator..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            autoFocus
            className="w-full bg-white border border-[#e9d5bb] rounded-xl px-3 py-1.5 text-xs text-[#70412d] focus:outline-none shadow-inner"
          />

          <div className="max-h-48 overflow-y-auto space-y-1">
            {creatorsFiltradas.length > 0 ? (
              creatorsFiltradas.map((c) => {
                const ehSelecionado = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onChange(c.id);
                      setAberto(false);
                      setBusca("");
                    }}
                    className={`w-full text-left py-2 px-3 rounded-xl text-xs transition ${
                      ehSelecionado
                        ? "bg-[#70412d] text-[#f9f5e9] font-bold shadow-sm"
                        : "text-[#70412d] hover:bg-[#efe2cc]"
                    }`}
                  >
                    {c.nome} (@{c.instagram})
                  </button>
                );
              })
            ) : (
              <p className="text-center text-[11px] text-[#70412d]/60 py-2 italic">
                Nenhuma creator encontrada.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Dropdown Customizado genérico para Formato e Tipo
function DropdownCustomizado({
  valor,
  placeholder,
  opcoes,
  onChange,
  disabled,
}: {
  valor: string;
  placeholder: string;
  opcoes: string[];
  onChange: (val: string) => void;
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

  const temSelecao = Boolean(valor);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setAberto(!aberto)}
        style={{
          backgroundImage: temSelecao ? CHEVRON_CREME_SVG : CHEVRON_MARROM_SVG,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.25em 1.25em",
        }}
        className={`w-full rounded-xl pl-3 pr-8 py-2 text-sm text-center focus:outline-none transition shadow-sm truncate ${
          temSelecao
            ? "bg-[#70412d] text-[#f9f5e9] font-medium"
            : "bg-transparent border-b border-[#e9d5bb] text-[#70412d]/60 text-left pl-2"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="block truncate">{valor !== "" ? valor : placeholder}</span>
      </button>

      {aberto && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#f9f5e9] border border-[#e9d5bb] rounded-2xl p-1.5 shadow-xl space-y-1">
          {opcoes.map((op) => {
            const ehSelecionado = op === valor;
            return (
              <button
                key={op}
                type="button"
                onClick={() => {
                  onChange(op);
                  setAberto(false);
                }}
                className={`w-full text-center py-2 px-3 rounded-xl text-xs transition ${
                  ehSelecionado
                    ? "bg-[#70412d] text-[#f9f5e9] font-bold shadow-sm"
                    : "text-[#70412d] hover:bg-[#efe2cc]"
                }`}
              >
                {op}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminConteudosPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState("");

  const [linkInstagram, setLinkInstagram] = useState("");
  const [linkTiktok, setLinkTiktok] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("");
  const [formato, setFormato] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  // Buscar Creators ativas via API Admin (Bypassa RLS)
  useEffect(() => {
    async function fetchCreators() {
      try {
        const res = await fetch("/api/admin/creators/list");
        const data = await res.json();

        if (res.ok && data.creators) {
          setCreators(data.creators);
        } else {
          console.error("Erro ao carregar creators:", data.error);
        }
      } catch (err) {
        console.error("Erro na requisição das creators:", err);
      } finally {
        setLoadingCreators(false);
      }
    }
    fetchCreators();
  }, []);

  const isStory = formato === "STORY";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    if (!selectedCreatorId) {
      setMensagem({
        tipo: "erro",
        texto: "Selecione uma Creator.",
      });
      return;
    }

    if (!formato) {
      setMensagem({ tipo: "erro", texto: "Selecione o formato do conteúdo." });
      return;
    }

    if (!tipoConteudo) {
      setMensagem({ tipo: "erro", texto: "Selecione o tipo do conteúdo." });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/conteudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_id: selectedCreatorId,
          link_instagram: isStory ? "" : linkInstagram,
          link_tiktok: isStory ? "" : linkTiktok,
          tipo_conteudo: tipoConteudo,
          formato,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar conteúdo.");
      }

      setMensagem({ tipo: "sucesso", texto: data.message || "Conteúdo registrado 🤎" });

      // Limpar campos
      setLinkInstagram("");
      setLinkTiktok("");
      setSelectedCreatorId("");
      setFormato("");
      setTipoConteudo("");
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
              Registro de Conteúdos
            </h1>
            <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
          </div>
        </div>

        {/* Formulário Estilo Login */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Seletor Customizado de Creator com Pesquisa */}
          <DropdownCreatorCustomizado
            creators={creators}
            selectedId={selectedCreatorId}
            onChange={setSelectedCreatorId}
            disabled={loading || loadingCreators}
          />

          {/* Formato e Tipo com Dropdowns Customizados */}
          <div className="grid grid-cols-2 gap-4">
            <DropdownCustomizado
              valor={formato}
              placeholder="Formato"
              opcoes={["REEL", "FOTO", "STORY"]}
              onChange={setFormato}
              disabled={loading}
            />

            <DropdownCustomizado
              valor={tipoConteudo}
              placeholder="Tipo"
              opcoes={["RELATO", "ROTINA", "REFLEXÃO", "EXPERIÊNCIA"]}
              onChange={setTipoConteudo}
              disabled={loading}
            />
          </div>

          {/* Link do Instagram */}
          <input
            type="url"
            placeholder="Link Instagram"
            value={linkInstagram}
            onChange={(e) => setLinkInstagram(e.target.value)}
            required={!isStory}
            disabled={loading || isStory}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none text-sm disabled:opacity-40"
          />

          {/* Link do TikTok */}
          <input
            type="url"
            placeholder="Link TikTok"
            value={linkTiktok}
            onChange={(e) => setLinkTiktok(e.target.value)}
            disabled={loading || isStory}
            className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none text-sm disabled:opacity-40"
          />

          <button
            type="submit"
            disabled={loading || loadingCreators}
            className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide transition disabled:opacity-80 mt-2 self-center cursor-pointer hover:bg-[#5c3524]"
          >
            {loading ? "Registrando..." : "Registrar"}
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