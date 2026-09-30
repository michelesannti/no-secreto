"use client";

import { useState, useEffect } from "react";

interface Creator {
  id: string;
  nome: string;
  instagram: string;
}

export default function AdminConteudosPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [search, setSearch] = useState("");
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

  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Procura a creator correspondente
    const match = creators.find(
      (c) =>
        c.nome?.toLowerCase() === value.toLowerCase() ||
        c.instagram?.toLowerCase().replace(/@/g, "") === value.toLowerCase().replace(/@/g, "") ||
        `${c.nome} (@${c.instagram})`.toLowerCase() === value.toLowerCase()
    );

    if (match) {
      setSelectedCreatorId(match.id);
    } else {
      setSelectedCreatorId("");
    }
  };

  const isStory = formato === "STORY";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    let creatorIdToSubmit = selectedCreatorId;

    if (!creatorIdToSubmit && search) {
      const match = creators.find(
        (c) =>
          c.nome?.toLowerCase().includes(search.toLowerCase()) ||
          c.instagram?.toLowerCase().includes(search.toLowerCase().replace(/@/g, ""))
      );
      if (match) creatorIdToSubmit = match.id;
    }

    if (!creatorIdToSubmit) {
      setMensagem({
        tipo: "erro",
        texto: "Creator não encontrada. Certifique-se de selecionar uma Creator cadastrada.",
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
          creator_id: creatorIdToSubmit,
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
      setSearch("");
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
          {/* Input Unificado com Sugestões (Datalist) */}
          <div className="flex flex-col">
            <input
              type="text"
              list="creators-list"
              placeholder={loadingCreators ? "Carregando creators..." : "Creator"}
              value={search}
              onChange={handleCreatorChange}
              required
              disabled={loading || loadingCreators}
              className="bg-transparent border-b border-[#e9d5bb] p-2 text-[#70412d] placeholder:text-[#70412d]/60 focus:outline-none disabled:opacity-60 text-sm"
            />
            <datalist id="creators-list">
              {creators.map((c) => (
                <option key={c.id} value={`${c.nome} (@${c.instagram})`} />
              ))}
            </datalist>
          </div>

          {/* Formato e Tipo com Rótulos Internos (Placeholder) */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formato}
              onChange={(e) => setFormato(e.target.value)}
              required
              disabled={loading}
              className={`bg-transparent border-b border-[#e9d5bb] p-2 focus:outline-none text-sm disabled:opacity-60 ${
                formato === "" ? "text-[#70412d]/60" : "text-[#70412d]"
              }`}
            >
              <option value="" disabled className="bg-[#f9f5e9] text-[#70412d]/60">
                Formato
              </option>
              <option value="REEL" className="bg-[#f9f5e9] text-[#70412d]">REEL</option>
              <option value="FOTO" className="bg-[#f9f5e9] text-[#70412d]">FOTO</option>
              <option value="STORY" className="bg-[#f9f5e9] text-[#70412d]">STORY</option>
            </select>

            <select
              value={tipoConteudo}
              onChange={(e) => setTipoConteudo(e.target.value)}
              required
              disabled={loading}
              className={`bg-transparent border-b border-[#e9d5bb] p-2 focus:outline-none text-sm disabled:opacity-60 ${
                tipoConteudo === "" ? "text-[#70412d]/60" : "text-[#70412d]"
              }`}
            >
              <option value="" disabled className="bg-[#f9f5e9] text-[#70412d]/60">
                Tipo
              </option>
              <option value="RELATO" className="bg-[#f9f5e9] text-[#70412d]">RELATO</option>
              <option value="ROTINA" className="bg-[#f9f5e9] text-[#70412d]">ROTINA</option>
              <option value="REFLEXÃO" className="bg-[#f9f5e9] text-[#70412d]">REFLEXÃO</option>
              <option value="EXPERIÊNCIA" className="bg-[#f9f5e9] text-[#70412d]">EXPERIÊNCIA</option>
            </select>
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
            className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide transition disabled:opacity-80 mt-2 self-center"
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