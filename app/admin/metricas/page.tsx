"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UsuariaDetalhe {
  id: string;
  nome: string;
  instagram: string;
  email: string;
  creator: boolean;
  ativo?: boolean;
  acesso?: string;
  creator_origem?: string | null;
  estudos_concluidos: number;
  primeiro_estudo: string | null;
  ultimo_estudo: string | null;
}

interface MetricasData {
  creatorsAtivasCount?: number;
  ativacaoAfiliadasCount?: number;
  usuariasDetalhes?: UsuariaDetalhe[];
  historicoSemanas?: { semana: string; totalEstudos: number; usuariasAtivasNaSemana?: number; engajamentoPct?: number }[];
  cakto?: {
    vendasAfiliadas?: number;
  };
}

export default function AdminMetricasPage() {
  const [data, setData] = useState<MetricasData>({
    creatorsAtivasCount: 0,
    ativacaoAfiliadasCount: 0,
    usuariasDetalhes: [],
    historicoSemanas: [],
  });

  const [loading, setLoading] = useState(true);

  // Auxiliares de formatação de data
  const formatarDataIso = (d: Date) => {
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const formatarDataPtBr = (strIso: string) => {
    if (!strIso) return "";
    const partes = strIso.split("T")[0].split("-");
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia}/${mes}/${ano}`;
    }
    return strIso;
  };

  const hojeIso = formatarDataIso(new Date());

  useEffect(() => {
    async function fetchMetricas() {
      try {
        const res = await fetch("/api/admin/metricas");
        const json = await res.json();
        if (res.ok && json) {
          setData(json);
        }
      } catch (err) {
        console.error("Erro na busca das métricas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetricas();
  }, []);

  const fezEstudoHoje = (strData: string | null) => {
    if (!strData) return false;
    const dataEstudoStr = strData.split("T")[0];
    return dataEstudoStr === hojeIso;
  };

  const ordenarUsuarias = (lista: UsuariaDetalhe[]) => {
    return [...lista].sort((a, b) => {
      const aHoje = fezEstudoHoje(a.ultimo_estudo) ? 1 : 0;
      const bHoje = fezEstudoHoje(b.ultimo_estudo) ? 1 : 0;

      if (aHoje !== bHoje) return bHoje - aHoje;

      const dataA = a.ultimo_estudo ? new Date(a.ultimo_estudo).getTime() : 0;
      const dataB = b.ultimo_estudo ? new Date(b.ultimo_estudo).getTime() : 0;

      if (dataA !== dataB) {
        return dataB - dataA;
      }

      return b.estudos_concluidos - a.estudos_concluidos;
    });
  };

  const mesAtualNome = new Date()
    .toLocaleDateString("pt-BR", { month: "long" })
    .toUpperCase();

  const todasUsuarias = data.usuariasDetalhes || [];
  
  const usuariasAtivas = todasUsuarias.filter(
    (u) => u.ativo === true && u.email !== "miisantos55@gmail.com"
  );

  const clientesTotal = usuariasAtivas.filter((u) => u.acesso === "PAGO");
  const creatorsTotal = usuariasAtivas.filter((u) => u.creator);

  const clientesComEstudos = ordenarUsuarias(clientesTotal.filter((u) => u.estudos_concluidos > 0));
  const creatorsComEstudos = ordenarUsuarias(creatorsTotal.filter((u) => u.creator && u.estudos_concluidos > 0));

  const clientesHojeCount = clientesComEstudos.filter((u) => fezEstudoHoje(u.ultimo_estudo)).length;
  const creatorsHojeCount = creatorsComEstudos.filter((u) => fezEstudoHoje(u.ultimo_estudo)).length;

  const totalUsuariasAtivasCount = usuariasAtivas.length;

  const historicoSemanas = data.historicoSemanas && data.historicoSemanas.length > 0 
    ? data.historicoSemanas.map(s => ({
        semana: s.semana,
        pct: s.engajamentoPct ?? 0,
        totalEstudos: s.totalEstudos,
        usuariasAtivasNaSemana: s.usuariasAtivasNaSemana
      }))
    : [
        { semana: "13/09 - 20/09", pct: 14, totalEstudos: 23, usuariasAtivasNaSemana: 23 },
        { semana: "20/09 - 27/09", pct: 14, totalEstudos: 23, usuariasAtivasNaSemana: 24 },
        { semana: "27/09 - 04/10", pct: 24, totalEstudos: 48, usuariasAtivasNaSemana: 29 },
        { semana: "04/10 - 11/10", pct: 16, totalEstudos: 40, usuariasAtivasNaSemana: 35 },
      ];

  const maxPctSemana = Math.max(...historicoSemanas.map((s) => s.pct), 1);

  const svgWidth = 400;
  const svgHeight = 120;
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const pontosLinha = historicoSemanas.map((item, idx) => {
    const x = paddingX + (idx / (historicoSemanas.length - 1 || 1)) * chartWidth;
    const y = svgHeight - paddingY - (item.pct / (maxPctSemana || 1)) * chartHeight;
    return { x, y, ...item };
  });

  const pathString = pontosLinha.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaString = `${pathString} L ${pontosLinha[pontosLinha.length - 1].x} ${svgHeight - paddingY} L ${pontosLinha[0].x} ${svgHeight - paddingY} Z`;

  const vAtivacaoUsuarias = usuariasAtivas.filter((u) => u.estudos_concluidos > 0).length;
  const vCreatorsAtivas = data.creatorsAtivasCount || 0;
  const vAtivacaoAfiliadas = data.ativacaoAfiliadasCount ?? (typeof data?.cakto?.vendasAfiliadas === "number" ? data.cakto.vendasAfiliadas : 0);
  const vMonetizacao = usuariasAtivas.filter((u) => u.acesso === "PAGO").length;

  const maxMetasVal = Math.max(vAtivacaoUsuarias, vCreatorsAtivas, vAtivacaoAfiliadas, vMonetizacao, 1);

  const hAtivacaoUsuarias = Math.round((vAtivacaoUsuarias / maxMetasVal) * 100);
  const hCreatorsAtivas = Math.round((vCreatorsAtivas / maxMetasVal) * 100);
  const hAtivacaoAfiliadas = Math.round((vAtivacaoAfiliadas / maxMetasVal) * 100);
  const hMonetizacao = Math.round((vMonetizacao / maxMetasVal) * 100);

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
              Métricas
            </h1>
            <div className="w-12 h-[2px] bg-[#e9d5bb] mt-2 mx-auto"></div>
          </div>

          {/* Seletor de Abas Navegáveis */}
          <div className="flex justify-center gap-2 pt-4">
            <Link
              href="/admin/metricas"
              className="px-6 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition bg-[#70412d] text-[#f9f5e9] shadow-sm"
            >
              📊 Métricas
            </Link>
            <Link
              href="/admin/relatorios"
              className="px-6 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition bg-[#efe2cc]/60 text-[#70412d]/70 hover:bg-[#efe2cc]"
            >
              📋 Relatório
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-center text-[#70412d]/60 italic font-serif py-12">
            Carregando dados...
          </p>
        ) : (
          <div className="space-y-6">
            
            {/* GRÁFICO DE METAS / ACOMPANHAMENTO DO MÊS */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                
                <div className="border-b border-[#e9d5bb] pb-2 text-center">
                  <span className="text-sm font-bold tracking-wider uppercase text-[#70412d]">
                    METAS {mesAtualNome}
                  </span>
                </div>

                <div className="pt-2 pb-1">
                  <div className="flex items-end justify-around h-32 border-b border-[#e9d5bb]/60 px-2 sm:px-4 gap-2 sm:gap-4">
                    
                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <span className="text-[11px] font-mono font-bold text-[#70412d] mb-1">
                        {vAtivacaoUsuarias}
                      </span>
                      <div 
                        style={{ height: `${Math.max(hAtivacaoUsuarias, 6)}%` }}
                        className="w-full max-w-[36px] bg-[#70412d] rounded-t-lg transition-all duration-500"
                      />
                    </div>

                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <span className="text-[11px] font-mono font-bold text-[#70412d] mb-1">
                        {vCreatorsAtivas}
                      </span>
                      <div 
                        style={{ height: `${Math.max(hCreatorsAtivas, 6)}%` }}
                        className="w-full max-w-[36px] bg-[#8c5237] rounded-t-lg transition-all duration-500"
                      />
                    </div>

                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <span className="text-[11px] font-mono font-bold text-[#70412d] mb-1">
                        {vAtivacaoAfiliadas}
                      </span>
                      <div 
                        style={{ height: `${Math.max(hAtivacaoAfiliadas, 6)}%` }}
                        className="w-full max-w-[36px] bg-[#b8805f] rounded-t-lg transition-all duration-500"
                      />
                    </div>

                    <div className="flex flex-col items-center flex-1 h-full justify-end">
                      <span className="text-[11px] font-mono font-bold text-[#70412d] mb-1">
                        {vMonetizacao}
                      </span>
                      <div 
                        style={{ height: `${Math.max(hMonetizacao, 6)}%` }}
                        className="w-full max-w-[36px] bg-[#5c3524] rounded-t-lg transition-all duration-500"
                      />
                    </div>

                  </div>

                  <div className="flex justify-around text-center text-[10px] sm:text-xs pt-2 gap-1">
                    <div className="flex-1 font-bold text-[#70412d]">
                      Usuárias com Estudos
                    </div>
                    <div className="flex-1 font-bold text-[#70412d]">
                      Creators com Posts
                    </div>
                    <div className="flex-1 font-bold text-[#70412d]">
                      Creators com Vendas
                    </div>
                    <div className="flex-1 font-bold text-[#70412d]">
                      Assinaturas
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* SEÇÃO ESPECÍFICA: CONSTÂNCIA SEMANAL */}
            <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              
              <div className="border-b border-[#e9d5bb] pb-2 text-center">
                <span className="text-sm font-bold tracking-wider uppercase text-[#70412d]">
                  CONSTÂNCIA SEMANAL
                </span>
              </div>

              <div className="pt-2">
                <div className="w-full max-w-lg mx-auto overflow-x-auto">
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
                    <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#e9d5bb" strokeDasharray="3 3" strokeWidth="1" opacity="0.6" />
                    <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="#e9d5bb" strokeDasharray="3 3" strokeWidth="1" opacity="0.6" />
                    <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e9d5bb" strokeWidth="1" opacity="0.8" />

                    <path d={areaString} fill="#70412d" opacity="0.08" />
                    <path d={pathString} fill="none" stroke="#70412d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {pontosLinha.map((p, idx) => (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="4.5" fill="#f9f5e9" stroke="#70412d" strokeWidth="2.5" />
                        <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-mono font-bold" fill="#70412d">
                          {p.pct}%
                        </text>
                        <text x={p.x} y={svgHeight - paddingY + 16} textAnchor="middle" className="text-[9px] font-bold uppercase" fill="#70412d" opacity="0.8">
                          {p.semana}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

            </div>

            {/* CARD ÚNICO UNIFICADO COM DESTAQUE DE ESTUDOS HOJE */}
            <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              
              <div className="border-b border-[#e9d5bb] pb-2 text-center">
                <span className="text-sm font-bold tracking-wider uppercase text-[#70412d]">
                  USUÁRIAS ({totalUsuariasAtivasCount})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-6 items-start divide-x divide-[#e9d5bb]">
                
                {/* Coluna 1: Creators */}
                <div className="space-y-3 pr-1 sm:pr-2">
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
                                  {formatarDataPtBr(u.ultimo_estudo || "")}
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

                {/* Coluna 2: Clientes */}
                <div className="space-y-3 pl-2 sm:pl-6">
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
                                  {formatarDataPtBr(u.ultimo_estudo || "")}
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

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}