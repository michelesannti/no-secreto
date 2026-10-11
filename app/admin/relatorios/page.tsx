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

  // Obter o nome do mês atual em maiúsculas (ex: "OUTUBRO")
  const mesAtualNome = new Date()
    .toLocaleDateString("pt-BR", { month: "long" })
    .toUpperCase();

  const clientesTotal = (data.usuariasDetalhes || []).filter((u) => u.acesso === "PAGO");
  const creatorsTotal = (data.usuariasDetalhes || []).filter((u) => u.creator);

  const clientesComEstudos = clientesTotal.filter((u) => u.estudos_concluidos > 0);
  const creatorsComEstudos = creatorsTotal.filter((u) => u.creator && u.estudos_concluidos > 0);

  // Contagem de quem fez estudo hoje
  const clientesHojeCount = clientesComEstudos.filter((u) => fezEstudoHoje(u.ultimo_estudo)).length;
  const creatorsHojeCount = creatorsComEstudos.filter((u) => fezEstudoHoje(u.ultimo_estudo)).length;

  const totalUsuariasComAcesso = (data.usuariasDetalhes || []).length;

  // OPÇÃO B: Cálculos das Alturas das Barras Comparativas Verticais
  const vConcluidas = typeof data.cakto.vendas === "number" ? data.cakto.vendas : 0;
  const vAbandonadas = typeof data.cakto.vendasAbandonadas === "number" ? data.cakto.vendasAbandonadas : 0;
  const vAfiliadas = typeof data.cakto.vendasAfiliadas === "number" ? data.cakto.vendasAfiliadas : 0;

  // Valor máximo para escala visual (garante pelo menos 1 para evitar divisão por 0)
  const maxValor = Math.max(vConcluidas, vAbandonadas, vAfiliadas, 1);

  const hConcluidas = Math.round((vConcluidas / maxValor) * 100);
  const hAfiliadas = Math.round((vAfiliadas / maxValor) * 100);
  const hAbandonadas = Math.round((vAbandonadas / maxValor) * 100);

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
            
            {/* OPÇÃO B: CARD DE VENDAS COM BARRAS COMPARATIVAS VERTICAIS */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                
                <div className="border-b border-[#e9d5bb] pb-2 text-center">
                  <span className="text-sm font-bold tracking-wider uppercase text-[#70412d]">
                    VENDAS ({mesAtualNome})
                  </span>
                </div>

                {/* Área do Gráfico de Barras Verticais */}
                <div className="pt-2 pb-1">
                  <div className="flex items-end justify-around h-28 border-b border-[#e9d5bb]/60 px-4 gap-4">
                    
                    {/* Barra 1: Vendas Diretas */}
                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <span className="text-[11px] font-mono font-bold text-[#70412d] mb-1">
                        {vConcluidas}
                      </span>
                      <div 
                        style={{ height: `${Math.max(hConcluidas, 6)}%` }}
                        className="w-full max-w-[40px] bg-[#70412d] rounded-t-lg transition-all duration-500"
                      />
                    </div>

                    {/* Barra 2: Afiliadas */}
                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <span className="text-[11px] font-mono font-bold text-[#70412d] mb-1">
                        {vAfiliadas}
                      </span>
                      <div 
                        style={{ height: `${Math.max(hAfiliadas, 6)}%` }}
                        className="w-full max-w-[40px] bg-[#b8805f] rounded-t-lg transition-all duration-500"
                      />
                    </div>

                    {/* Barra 3: Abandonadas */}
                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <span className="text-[11px] font-mono font-bold text-amber-900 mb-1">
                        {vAbandonadas}
                      </span>
                      <div 
                        style={{ height: `${Math.max(hAbandonadas, 6)}%` }}
                        className="w-full max-w-[40px] bg-amber-700/60 rounded-t-lg transition-all duration-500"
                      />
                    </div>

                  </div>

                  {/* Rótulos Abaixo do Gráfico */}
                  <div className="flex justify-around text-center text-xs pt-2">
                    <div className="flex-1 text-[11px] font-bold text-[#70412d]">Vendas</div>
                    <div className="flex-1 text-[11px] font-bold text-[#70412d]">Afiliadas</div>
                    <div className="flex-1 text-[11px] font-bold text-amber-900">Abandonadas</div>
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
              <div className="grid grid-cols-2 gap-2 sm:gap-6 items-start divide-x divide-[#e9d5bb]">
                
                {/* Coluna 1: Clientes */}
                <div className="space-y-3 pr-1 sm:pr-2">
                  <div className="text-center font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#70412d]/90 border-b border-[#e9d5bb]/60 pb-1.5 min-h-[48px] flex flex-col sm:flex-row items-center justify-center gap-1">
                    <span className="text-center">CLIENTES ({clientesComEstudos.length} / {clientesTotal.length})</span>
                    {clientesHojeCount > 0 && (
                      <span className="bg-[#70412d] text-[#f9f5e9] text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-extrabold normal-case tracking-normal shrink-0">
                        🔥 {clientesHojeCount}
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
                <div className="space-y-3 pl-2 sm:pl-6">
                  <div className="text-center font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#70412d]/90 border-b border-[#e9d5bb]/60 pb-1.5 min-h-[48px] flex flex-col sm:flex-row items-center justify-center gap-1">
                    <span className="text-center">CREATORS ({creatorsComEstudos.length} / {creatorsTotal.length})</span>
                    {creatorsHojeCount > 0 && (
                      <span className="bg-[#70412d] text-[#f9f5e9] text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-extrabold normal-case tracking-normal shrink-0">
                        🔥 {creatorsHojeCount}
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
                💳 VENDAS ({mesAtualNome})
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