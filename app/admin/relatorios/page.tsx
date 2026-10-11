"use client";

import { useState, useEffect } from "react";

interface UsuariaDetalhe {
  id: string;
  nome: string;
  instagram: string;
  email: string;
  creator: boolean;
  ativo?: boolean;
  acesso?: string;
  estudos_concluidos: number;
  primeiro_estudo: string | null;
  ultimo_estudo: string | null;
}

interface RelatoriosData {
  instagram: {
    seguidores: number | "";
    visitasPerfil: number | "";
    cliquesBio: number | "";
  };
  tiktok: {
    seguidores: number | "";
    visitasPerfil: number | "";
  };
  whatsapp: Record<string, number | "">;
  supabase: {
    estudosConcluidos: number;
    conteudosPublicados: number | "";
  };
  cakto: {
    vendas: number | "";
    vendasAbandonadas: number | "";
    vendasAfiliadas: number | "";
  };
  usuariasDetalhes?: UsuariaDetalhe[];
}

export default function AdminRelatoriosPage() {
  const [abaAtiva, setAbaAtiva] = useState<"metricas" | "relatorio">("metricas");
  const [data, setData] = useState<RelatoriosData>({
    instagram: { seguidores: "", visitasPerfil: "", cliquesBio: "" },
    tiktok: { seguidores: "", visitasPerfil: "" },
    whatsapp: {},
    supabase: { estudosConcluidos: 0, conteudosPublicados: "" },
    cakto: { vendas: "", vendasAbandonadas: "", vendasAfiliadas: "" },
    usuariasDetalhes: [],
  });

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    async function fetchRelatorios() {
      try {
        const res = await fetch("/api/admin/relatorios");
        const json = await res.json();
        if (res.ok && json) {
          setData(json);
        }
      } catch (err) {
        console.error("Erro na busca dos relatórios:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRelatorios();
  }, []);

  const handleChange = (
    secao: keyof RelatoriosData,
    campo: string,
    valor: string
  ) => {
    const num = valor === "" ? "" : parseInt(valor, 10) || 0;
    setData((prev) => ({
      ...prev,
      [secao]: {
        ...(prev[secao] as any),
        [campo]: num,
      },
    }));
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setSalvando(true);

    try {
      const res = await fetch("/api/admin/relatorios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao salvar relatório.");

      setMensagem({ tipo: "sucesso", texto: "Relatório salvo com sucesso 🤎" });
    } catch (err: any) {
      setMensagem({ tipo: "erro", texto: err.message || "Erro ao salvar dados." });
    } finally {
      setSalvando(false);
    }
  };

  const formatarData = (strData: string | null) => {
    if (!strData) return "Nenhum";
    const parteData = strData.split("T")[0];
    const partes = parteData.split("-");
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia}/${mes}/${ano}`;
    }
    return strData;
  };

  // Função para verificar se o estudo foi realizado HOJE (data local do navegador)
  const fezEstudoHoje = (strData: string | null) => {
    if (!strData) return false;
    const dataEstudo = strData.split("T")[0];
    
    // Pega a data local de hoje no formato YYYY-MM-DD
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    const hojeStr = `${ano}-${mes}-${dia}`;

    return dataEstudo === hojeStr;
  };

  const clientesTotal = (data.usuariasDetalhes || []).filter((u) => u.acesso === "PAGO");
  const creatorsTotal = (data.usuariasDetalhes || []).filter((u) => u.creator);

  const clientesComEstudos = clientesTotal.filter((u) => u.estudos_concluidos > 0);
  const creatorsComEstudos = creatorsTotal.filter((u) => u.estudos_concluidos > 0);

  // Contagem de quem fez estudo hoje
  const clientesHojeCount = clientesComEstudos.filter((u) => fezEstudoHoje(u.ultimo_estudo)).length;
  const creatorsHojeCount = creatorsComEstudos.filter((u) => fezEstudoHoje(u.ultimo_estudo)).length;

  const totalUsuariasComAcesso = (data.usuariasDetalhes || []).length;

  return (
    <div className="min-h-screen bg-[#f9f5e9] text-[#70412d] px-4 py-8 md:px-6 md:py-10 selection:bg-[#e9d5bb]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabeçalho Principal */}
        <div className="text-center space-y-3">
          <img
            src="/logo.webp"
            alt="No Secreto"
            className="w-20 h-20 mx-auto object-contain"
          />
          <div>
            <h1 className="text-2xl font-serif tracking-wide text-[#70412d] font-bold">
              Métricas & Relatórios
            </h1>
            <div className="w-12 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
          </div>

          {/* Seletor de Abas */}
          <div className="flex justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setAbaAtiva("metricas")}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition ${
                abaAtiva === "metricas"
                  ? "bg-[#70412d] text-[#f9f5e9] shadow-sm"
                  : "bg-[#efe2cc]/60 text-[#70412d]/70 hover:bg-[#efe2cc]"
              }`}
            >
              📊 Métricas
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva("relatorio")}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition ${
                abaAtiva === "relatorio"
                  ? "bg-[#70412d] text-[#f9f5e9] shadow-sm"
                  : "bg-[#efe2cc]/60 text-[#70412d]/70 hover:bg-[#efe2cc]"
              }`}
            >
              📝 Preencher Relatório
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-center text-[#70412d]/60 italic font-serif py-12">
            Carregando dados...
          </p>
        ) : abaAtiva === "metricas" ? (
          /* ABA 1: VISUALIZAÇÃO DE MÉTRICAS */
          <div className="space-y-6">
            
            {/* Card Cakto (Mês Atual) Padronizado */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-3 sm:p-5 shadow-sm space-y-4">
                <span className="text-sm font-bold tracking-wider uppercase text-[#70412d] text-center flex items-center justify-center border-b border-[#e9d5bb] pb-2 leading-none">
                  CAKTO (MÊS ATUAL)
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex justify-between py-1 border-r border-[#e9d5bb]/40 pr-2">
                    <span className="text-[#70412d]/70">Vendas:</span>
                    <span className="font-mono font-bold text-[#70412d]">{data.cakto.vendas !== "" ? data.cakto.vendas : "-"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-r border-[#e9d5bb]/40 px-2">
                    <span className="text-[#70412d]/70">Abandonadas:</span>
                    <span className="font-mono font-bold text-amber-800">{data.cakto.vendasAbandonadas !== "" ? data.cakto.vendasAbandonadas : "-"}</span>
                  </div>
                  <div className="flex justify-between py-1 pl-2">
                    <span className="text-[#70412d]/70">Afiliadas:</span>
                    <span className="font-mono font-bold text-[#70412d]">{data.cakto.vendasAfiliadas !== "" ? data.cakto.vendasAfiliadas : "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD ÚNICO UNIFICADO COM DESTAQUE DE ESTUDOS HOJE */}
            <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-3 sm:p-5 shadow-sm space-y-4">
              
              {/* Título Principal Padronizado */}
              <div className="border-b border-[#e9d5bb] pb-2 text-center">
                <span className="text-sm font-bold tracking-wider uppercase text-[#70412d]">
                  USUÁRIAS ({totalUsuariasComAcesso})
                </span>
              </div>

              {/* Grid Interno Lado a Lado com Linha Divisória */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6 items-start divide-x divide-[#e9d5bb]">
                
                {/* Coluna 1: Clientes */}
                <div className="space-y-3 pr-1 sm:pr-2">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-[#70412d]/90 border-b border-[#e9d5bb]/60 pb-1.5 flex flex-wrap justify-center items-center gap-1.5">
                    <span>CLIENTES ({clientesComEstudos.length} / {clientesTotal.length})</span>
                    {clientesHojeCount > 0 && (
                      <span className="bg-[#70412d] text-[#f9f5e9] text-[9px] px-2 py-0.5 rounded-full font-extrabold normal-case tracking-normal">
                        🔥 {clientesHojeCount} hoje
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#e9d5bb] text-[#70412d]/60 uppercase text-[10px]">
                          <th className="pb-2 font-bold pl-6">Usuária</th>
                          <th className="pb-2 text-center font-bold">Estudos</th>
                          <th className="pb-2 text-center font-bold">Último</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e9d5bb]/60">
                        {clientesComEstudos.length > 0 ? (
                          clientesComEstudos.map((u) => {
                            const fezHoje = fezEstudoHoje(u.ultimo_estudo);
                            return (
                              <tr 
                                key={u.id} 
                                className={`transition-colors ${
                                  fezHoje 
                                    ? "bg-[#e9d5bb]/50 font-medium" 
                                    : "hover:bg-[#e9d5bb]/20"
                                }`}
                              >
                                <td className="py-2.5 font-medium text-[#70412d] pl-6 relative">
                                  <span className="absolute left-1 top-2.5 w-4 text-center text-xs" title={fezHoje ? "Fez estudo hoje!" : ""}>
                                    {fezHoje ? "🔥" : ""}
                                  </span>
                                  <div className="font-bold truncate">
                                    {u.nome}
                                  </div>
                                  <div className="text-[10px] text-[#70412d]/60 truncate max-w-[90px] sm:max-w-none">
                                    {u.instagram ? `@${u.instagram}` : u.email}
                                  </div>
                                </td>
                                <td className="py-2.5 text-center font-mono font-bold text-[#70412d]">
                                  {u.estudos_concluidos}
                                </td>
                                <td className="py-2.5 text-center font-mono text-[11px] text-[#70412d]/80">
                                  {formatarData(u.ultimo_estudo)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-6 text-center text-[#70412d]/60 italic">
                              Nenhuma cliente com estudos concluídos.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Coluna 2: Creators */}
                <div className="space-y-3 pl-3 sm:pl-6">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-[#70412d]/90 border-b border-[#e9d5bb]/60 pb-1.5 flex flex-wrap justify-center items-center gap-1.5">
                    <span>CREATORS ({creatorsComEstudos.length} / {creatorsTotal.length})</span>
                    {creatorsHojeCount > 0 && (
                      <span className="bg-[#70412d] text-[#f9f5e9] text-[9px] px-2 py-0.5 rounded-full font-extrabold normal-case tracking-normal">
                        🔥 {creatorsHojeCount} hoje
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#e9d5bb] text-[#70412d]/60 uppercase text-[10px]">
                          <th className="pb-2 font-bold pl-6">Usuária</th>
                          <th className="pb-2 text-center font-bold">Estudos</th>
                          <th className="pb-2 text-center font-bold">Último</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e9d5bb]/60">
                        {creatorsComEstudos.length > 0 ? (
                          creatorsComEstudos.map((u) => {
                            const fezHoje = fezEstudoHoje(u.ultimo_estudo);
                            return (
                              <tr 
                                key={u.id} 
                                className={`transition-colors ${
                                  fezHoje 
                                    ? "bg-[#e9d5bb]/50 font-medium" 
                                    : "hover:bg-[#e9d5bb]/20"
                                }`}
                              >
                                <td className="py-2.5 font-medium text-[#70412d] pl-6 relative">
                                  <span className="absolute left-1 top-2.5 w-4 text-center text-xs" title={fezHoje ? "Fez estudo hoje!" : ""}>
                                    {fezHoje ? "🔥" : ""}
                                  </span>
                                  <div className="font-bold truncate">
                                    {u.nome}
                                  </div>
                                  <div className="text-[10px] text-[#70412d]/60 truncate max-w-[90px] sm:max-w-none">
                                    {u.instagram ? `@${u.instagram}` : u.email}
                                  </div>
                                </td>
                                <td className="py-2.5 text-center font-mono font-bold text-[#70412d]">
                                  {u.estudos_concluidos}
                                </td>
                                <td className="py-2.5 text-center font-mono text-[11px] text-[#70412d]/80">
                                  {formatarData(u.ultimo_estudo)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-6 text-center text-[#70412d]/60 italic">
                              Nenhuma creator com estudos concluídos.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* ABA 2: PREENCHIMENTO DO RELATÓRIO OPERACIONAL */
          <form onSubmit={handleSalvar} className="space-y-8">
            <div className="bg-[#EFE2CC]/50 border border-[#E9D5BB] rounded-2xl p-5 shadow-sm space-y-4">
              <span className="text-xs font-bold tracking-wider text-[#70412d] uppercase block border-b border-[#E9D5BB] pb-2">
                ⚡ SUPABASE (CONTEÚDOS)
              </span>
              <div>
                <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1">Conteúdos Publicados</label>
                <input
                  type="number"
                  value={data.supabase.conteudosPublicados}
                  onChange={(e) => handleChange("supabase", "conteudosPublicados", e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#EFE2CC]/50 border border-[#E9D5BB] rounded-2xl p-5 shadow-sm space-y-4">
                <span className="text-xs font-bold tracking-wider text-[#70412d] uppercase block border-b border-[#E9D5BB] pb-2">
                  📸 INSTAGRAM
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1">Seguidores</label>
                    <input
                      type="number"
                      value={data.instagram.seguidores}
                      onChange={(e) => handleChange("instagram", "seguidores", e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1">Visitas ao Perfil</label>
                    <input
                      type="number"
                      value={data.instagram.visitasPerfil}
                      onChange={(e) => handleChange("instagram", "visitasPerfil", e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1">Cliques no Link da Bio</label>
                    <input
                      type="number"
                      value={data.instagram.cliquesBio}
                      onChange={(e) => handleChange("instagram", "cliquesBio", e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#EFE2CC]/50 border border-[#E9D5BB] rounded-2xl p-5 shadow-sm space-y-4">
                <span className="text-xs font-bold tracking-wider text-[#70412d] uppercase block border-b border-[#E9D5BB] pb-2">
                  🎵 TIKTOK
                </span>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1">Seguidores</label>
                    <input
                      type="number"
                      value={data.tiktok.seguidores}
                      onChange={(e) => handleChange("tiktok", "seguidores", e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1">Visitas ao Perfil</label>
                    <input
                      type="number"
                      value={data.tiktok.visitasPerfil}
                      onChange={(e) => handleChange("tiktok", "visitasPerfil", e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#EFE2CC]/50 border border-[#E9D5BB] rounded-2xl p-5 shadow-sm space-y-4">
              <span className="text-xs font-bold tracking-wider text-[#70412d] uppercase block border-b border-[#E9D5BB] pb-2">
                💳 CAKTO (MÊS ATUAL)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1">Vendas</label>
                  <input
                    type="number"
                    value={data.cakto.vendas}
                    onChange={(e) => handleChange("cakto", "vendas", e.target.value)}
                    placeholder="0"
                    className="w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1">Vendas Abandonadas</label>
                  <input
                    type="number"
                    value={data.cakto.vendasAbandonadas}
                    onChange={(e) => handleChange("cakto", "vendasAbandonadas", e.target.value)}
                    placeholder="0"
                    className="w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1">Vendas Afiliadas</label>
                  <input
                    type="number"
                    value={data.cakto.vendasAfiliadas}
                    onChange={(e) => handleChange("cakto", "vendasAfiliadas", e.target.value)}
                    placeholder="0"
                    className="w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={salvando}
                className="px-8 py-3 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm font-medium tracking-wide transition shadow-md hover:bg-[#5c3524] disabled:opacity-80"
              >
                {salvando ? "Salvando..." : "Salvar Relatório"}
              </button>
            </div>

            {mensagem && (
              <p className={`text-sm text-center font-medium ${
                mensagem.tipo === "sucesso" ? "text-[#70412d]" : "text-[#9b2c2c]"
              }`}>
                {mensagem.texto}
              </p>
            )}
          </form>
        )}

      </div>
    </div>
  );
}