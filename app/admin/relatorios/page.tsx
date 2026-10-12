"use client";

import { useState, useEffect, useRef } from "react";

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

interface RelatoriosData {
  tipoRelatorio?: "semanal" | "quinzenal" | "mensal";
  periodo?: string;
  dataInicio?: string;
  dataFim?: string;
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
  creatorsAtivasCount?: number;
  ativacaoAfiliadasCount?: number;
  usuariasDetalhes?: UsuariaDetalhe[];
  historicoSemanas?: { semana: string; totalEstudos: number; usuariasAtivasNaSemana?: number; engajamentoPct?: number }[];
}

// SVG do chevron em creme (#f9f5e9) para destacar no fundo marrom
const CHEVRON_CREME_SVG = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23f9f5e9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`;

// SVG do chevron em marrom (#70412d)
const CHEVRON_MARROM_SVG = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2370412d' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`;

// Dropdown Customizado do Tipo com Fundo Marrom e Letra Creme quando Selecionado
function SeletorTipoCustomizado({
  valor,
  onChange,
}: {
  valor: "semanal" | "quinzenal" | "mensal";
  onChange: (novoTipo: "semanal" | "quinzenal" | "mensal") => void;
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

  const opcoes: { id: "semanal" | "quinzenal" | "mensal"; label: string }[] = [
    { id: "semanal", label: "Semanal" },
    { id: "quinzenal", label: "Quinzenal" },
    { id: "mensal", label: "Mensal" },
  ];

  const labelAtual = opcoes.find((o) => o.id === valor)?.label || "Semanal";

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        style={{
          backgroundImage: CHEVRON_CREME_SVG,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.25em 1.25em",
        }}
        className="w-full bg-[#70412d] border border-[#70412d] rounded-xl pl-3 pr-8 py-2 text-sm font-medium text-[#f9f5e9] text-center focus:outline-none shadow-sm active:scale-95 transition"
      >
        <span className="block text-center">{labelAtual}</span>
      </button>

      {aberto && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#f9f5e9] border border-[#e9d5bb] rounded-2xl p-1.5 shadow-xl space-y-1">
          {opcoes.map((item) => {
            const ehSelecionado = item.id === valor;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChange(item.id);
                  setAberto(false);
                }}
                className={`w-full text-center py-2 px-3 rounded-xl text-sm transition ${
                  ehSelecionado
                    ? "bg-[#70412d] text-[#f9f5e9] font-medium shadow-sm"
                    : "text-[#70412d] hover:bg-[#efe2cc]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Componente do Calendário Customizado
function SeletorCalendarioVisual({
  valorIso,
  hojeIso,
  onSelecionarData,
}: {
  valorIso: string;
  hojeIso: string;
  onSelecionarData: (dataIso: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const partesValor = (valorIso || hojeIso).split("-");
  const [anoVisual, setAnoVisual] = useState(parseInt(partesValor[0]));
  const [mesVisual, setMesVisual] = useState(parseInt(partesValor[1]) - 1);

  const partesHoje = hojeIso.split("-");
  const anoAtual = parseInt(partesHoje[0]);
  const mesAtual = parseInt(partesHoje[1]) - 1;

  useEffect(() => {
    const p = (valorIso || hojeIso).split("-");
    setAnoVisual(parseInt(p[0]));
    setMesVisual(parseInt(p[1]) - 1);
  }, [valorIso, hojeIso]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatarPtBr = (iso: string) => {
    if (!iso) return "";
    const [a, m, d] = iso.split("-");
    return `${d}/${m}/${a}`;
  };

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Cálculos do calendário
  const primeiroDiaSemana = new Date(anoVisual, mesVisual, 1).getDay();
  const totalDiasMes = new Date(anoVisual, mesVisual + 1, 0).getDate();

  const naoPodeAvisar =
    anoVisual > anoAtual || (anoVisual === anoAtual && mesVisual >= mesAtual);

  const mudarMes = (delta: number) => {
    if (delta > 0 && naoPodeAvisar) return;

    let novoMes = mesVisual + delta;
    let novoAno = anoVisual;
    if (novoMes < 0) {
      novoMes = 11;
      novoAno--;
    } else if (novoMes > 11) {
      novoMes = 0;
      novoAno++;
    }

    if (novoAno > anoAtual || (novoAno === anoAtual && novoMes > mesAtual)) {
      return;
    }

    setMesVisual(novoMes);
    setAnoVisual(novoAno);
  };

  const diasGrade = [];
  for (let i = 0; i < primeiroDiaSemana; i++) {
    diasGrade.push(null);
  }
  for (let d = 1; d <= totalDiasMes; d++) {
    diasGrade.push(d);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        style={{
          backgroundImage: CHEVRON_MARROM_SVG,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.25em 1.25em",
        }}
        className="w-full bg-white border border-[#E9D5BB] rounded-xl pl-3 pr-8 py-2 text-xs text-[#70412d] font-bold text-center font-mono focus:outline-none shadow-sm active:scale-95 transition"
      >
        <span className="block text-center">{formatarPtBr(valorIso || hojeIso)}</span>
      </button>

      {aberto && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-[#f9f5e9] border border-[#e9d5bb] rounded-2xl p-3 shadow-xl space-y-3">
          {/* Cabeçalho do Mês com SVG vetorial para evitar emoji no iOS */}
          <div className="flex items-center justify-between border-b border-[#e9d5bb] pb-2 text-xs font-bold text-[#70412d]">
            <button
              type="button"
              onClick={() => mudarMes(-1)}
              className="p-1 hover:bg-[#efe2cc] rounded-lg transition"
            >
              <svg className="w-3.5 h-3.5 fill-[#70412d]" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <span className="capitalize">
              {nomesMeses[mesVisual]} {anoVisual}
            </span>
            <button
              type="button"
              disabled={naoPodeAvisar}
              onClick={() => mudarMes(1)}
              className={`p-1 rounded-lg transition ${
                naoPodeAvisar
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-[#efe2cc]"
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-[#70412d]" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>

          {/* Dias da Semana */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#70412d]/60">
            <span>DOM</span>
            <span>SEG</span>
            <span>TER</span>
            <span>QUA</span>
            <span>QUI</span>
            <span>SEX</span>
            <span>SÁB</span>
          </div>

          {/* Grade de Dias */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
            {diasGrade.map((dia, idx) => {
              if (dia === null) {
                return <div key={`empty-${idx}`} />;
              }

              const mesStr = String(mesVisual + 1).padStart(2, "0");
              const diaStr = String(dia).padStart(2, "0");
              const dataLoopIso = `${anoVisual}-${mesStr}-${diaStr}`;

              const ehFuturo = dataLoopIso > hojeIso;
              const ehSelecionado = dataLoopIso === valorIso;

              return (
                <button
                  key={dataLoopIso}
                  type="button"
                  disabled={ehFuturo}
                  onClick={() => {
                    onSelecionarData(dataLoopIso);
                    setAberto(false);
                  }}
                  className={`py-1.5 rounded-lg text-[11px] transition font-mono ${
                    ehSelecionado
                      ? "bg-[#70412d] text-[#f9f5e9] shadow-sm"
                      : ehFuturo
                      ? "text-gray-300 cursor-not-allowed opacity-40"
                      : "text-[#70412d] hover:bg-[#efe2cc]"
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminRelatoriosPage() {
  const [abaAtiva, setAbaAtiva] = useState<"metricas" | "relatorio">("metricas");

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

  const calcularIntervaloPorTipo = (strFimIso: string, tipo: "semanal" | "quinzenal") => {
    const partes = strFimIso.split("-");
    const dataFimObj = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    
    const diasSubtrair = tipo === "semanal" ? 7 : 14;
    const dataInicioObj = new Date(dataFimObj);
    dataInicioObj.setDate(dataFimObj.getDate() - diasSubtrair);

    const strInicioIso = formatarDataIso(dataInicioObj);
    const periodoTexto = `${formatarDataPtBr(strInicioIso)} a ${formatarDataPtBr(strFimIso)}`;

    return { strInicioIso, periodoTexto };
  };

  const hoje = new Date();
  const hojeIso = formatarDataIso(hoje);
  const initialFim = hojeIso;
  const { strInicioIso: initialInicio, periodoTexto: initialPeriodoSemanal } = calcularIntervaloPorTipo(initialFim, "semanal");

  // Mês anterior travado para o relatório mensal
  const dataMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
  const mesAnteriorNome = dataMesAnterior.toLocaleDateString("pt-BR", { month: "long" });
  const mesAnteriorFormatado = `${mesAnteriorNome.charAt(0).toUpperCase() + mesAnteriorNome.slice(1)} / ${dataMesAnterior.getFullYear()}`;

  const [data, setData] = useState<RelatoriosData>({
    tipoRelatorio: "semanal",
    periodo: initialPeriodoSemanal,
    dataInicio: initialInicio,
    dataFim: initialFim,
    instagram: { seguidores: "", visitasPerfil: "", cliquesBio: "" },
    tiktok: { seguidores: "", visitasPerfil: "" },
    whatsapp: {},
    supabase: { estudosConcluidos: 0, conteudosPublicados: "" },
    cakto: { vendas: "", vendasAbandonadas: "", vendasAfiliadas: "" },
    creatorsAtivasCount: 0,
    ativacaoAfiliadasCount: 0,
    usuariasDetalhes: [],
    historicoSemanas: [],
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
          setData((prev) => {
            const dataFimValida = json.dataFim && json.dataFim <= hojeIso ? json.dataFim : hojeIso;
            return {
              ...prev,
              ...json,
              dataFim: dataFimValida,
              periodo: json.periodo || prev.periodo,
              tipoRelatorio: json.tipoRelatorio || prev.tipoRelatorio,
              dataInicio: json.dataInicio || prev.dataInicio,
              cakto: json.cakto || prev.cakto,
              instagram: json.instagram || prev.instagram,
              tiktok: json.tiktok || prev.tiktok,
              supabase: json.supabase || prev.supabase,
              historicoSemanas: json.historicoSemanas || prev.historicoSemanas,
            };
          });
        }
      } catch (err) {
        console.error("Erro na busca dos relatórios:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRelatorios();
  }, [hojeIso]);

  const handleChange = (
    secao: keyof RelatoriosData,
    campo: string,
    valor: any
  ) => {
    if (secao === "tipoRelatorio") {
      const novoTipo = valor as "semanal" | "quinzenal" | "mensal";
      if (novoTipo === "semanal" || novoTipo === "quinzenal") {
        const { strInicioIso, periodoTexto } = calcularIntervaloPorTipo(data.dataFim || initialFim, novoTipo);
        setData((prev) => ({
          ...prev,
          tipoRelatorio: novoTipo,
          dataInicio: strInicioIso,
          periodo: periodoTexto,
        }));
      } else {
        setData((prev) => ({
          ...prev,
          tipoRelatorio: "mensal",
          periodo: mesAnteriorFormatado,
        }));
      }
      return;
    }

    if (secao === "dataFim") {
      let novoFimIso = valor;
      if (!novoFimIso || novoFimIso > hojeIso) {
        novoFimIso = hojeIso;
      }

      const tipoAtual = data.tipoRelatorio === "quinzenal" ? "quinzenal" : "semanal";
      const { strInicioIso, periodoTexto } = calcularIntervaloPorTipo(novoFimIso, tipoAtual);
      
      setData((prev) => ({
        ...prev,
        dataFim: novoFimIso,
        dataInicio: strInicioIso,
        periodo: periodoTexto,
      }));
      return;
    }

    if (secao === "periodo") {
      setData((prev) => ({
        ...prev,
        periodo: valor,
      }));
      return;
    }

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

  const inputSemSetinhasClass = "w-full bg-white border border-[#E9D5BB] rounded-xl px-3 py-2 text-sm text-[#70412d] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center";

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
              📋 Relatório
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
        ) : (
          /* ABA 2: PREENCHIMENTO DO RELATÓRIO OPERACIONAL */
          <form onSubmit={handleSalvar} className="space-y-8">
            
            {/* SELETOR DE TIPO E DATAS */}
            <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  {/* Dropdown Customizado com Fundo Marrom e Texto Creme */}
                  <SeletorTipoCustomizado
                    valor={data.tipoRelatorio || "semanal"}
                    onChange={(novoTipo) => handleChange("tipoRelatorio", "", novoTipo)}
                  />
                </div>

                {data.tipoRelatorio === "semanal" || data.tipoRelatorio === "quinzenal" ? (
                  <div className="flex items-center gap-2">
                    {/* Data Início (Travada e formatada DD/MM/YYYY) */}
                    <div className="w-full bg-[#E9D5BB]/30 border border-[#E9D5BB] rounded-xl px-2 py-2 text-xs text-[#70412d]/70 text-center font-mono">
                      {formatarDataPtBr(data.dataInicio || initialInicio)}
                    </div>

                    <span className="text-xs font-bold text-[#70412d]/80 uppercase shrink-0">
                      até
                    </span>

                    {/* Data Fim (Calendário visual customizado) */}
                    <SeletorCalendarioVisual
                      valorIso={data.dataFim || initialFim}
                      hojeIso={hojeIso}
                      onSelecionarData={(novaIso) => handleChange("dataFim", "", novaIso)}
                    />
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={mesAnteriorFormatado}
                      disabled
                      className="w-full bg-[#E9D5BB]/40 border border-[#E9D5BB] rounded-xl px-3 py-2 text-xs text-[#70412d] font-bold text-center uppercase tracking-wider cursor-not-allowed focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SEÇÃO UNIFICADA 1: REDES SOCIAIS */}
            <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="border-b border-[#e9d5bb] pb-2 text-center">
                <span className="text-sm font-bold tracking-wider uppercase text-[#70412d]">
                  REDES SOCIAIS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-6 items-start divide-x divide-[#e9d5bb]">
                {/* Coluna 1: Instagram */}
                <div className="space-y-3 pr-1 sm:pr-2">
                  <span className="text-xs font-bold text-[#70412d]/90 uppercase block text-center border-b border-[#E9D5BB]/60 pb-1.5 min-h-[48px] flex items-center justify-center">
                    INSTAGRAM
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1 text-center">Seguidores</label>
                      <input
                        type="number"
                        value={data.instagram.seguidores}
                        onChange={(e) => handleChange("instagram", "seguidores", e.target.value)}
                        className={inputSemSetinhasClass}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1 text-center">Visitas ao Perfil</label>
                      <input
                        type="number"
                        value={data.instagram.visitasPerfil}
                        onChange={(e) => handleChange("instagram", "visitasPerfil", e.target.value)}
                        className={inputSemSetinhasClass}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1 text-center">Cliques na Bio</label>
                      <input
                        type="number"
                        value={data.instagram.cliquesBio}
                        onChange={(e) => handleChange("instagram", "cliquesBio", e.target.value)}
                        className={inputSemSetinhasClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Coluna 2: TikTok */}
                <div className="space-y-3 pl-2 sm:pl-6">
                  <span className="text-xs font-bold text-[#70412d]/90 uppercase block text-center border-b border-[#E9D5BB]/60 pb-1.5 min-h-[48px] flex items-center justify-center">
                    TIKTOK
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1 text-center">Seguidores</label>
                      <input
                        type="number"
                        value={data.tiktok.seguidores}
                        onChange={(e) => handleChange("tiktok", "seguidores", e.target.value)}
                        className={inputSemSetinhasClass}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1 text-center">Visitas ao Perfil</label>
                      <input
                        type="number"
                        value={data.tiktok.visitasPerfil}
                        onChange={(e) => handleChange("tiktok", "visitasPerfil", e.target.value)}
                        className={inputSemSetinhasClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: SUPABASE */}
            <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="border-b border-[#e9d5bb] pb-2 text-center">
                <span className="text-sm font-bold tracking-wider uppercase text-[#70412d]">
                  SUPABASE (CONTEÚDOS)
                </span>
              </div>
              <div className="max-w-xs mx-auto">
                <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1 text-center">Conteúdos Publicados</label>
                <input
                  type="number"
                  value={data.supabase.conteudosPublicados}
                  onChange={(e) => handleChange("supabase", "conteudosPublicados", e.target.value)}
                  className={inputSemSetinhasClass}
                />
              </div>
            </div>

            {/* SEÇÃO 3: VENDAS */}
            <div className="bg-[#efe2cc]/60 border border-[#e9d5bb] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="border-b border-[#e9d5bb] pb-2 text-center">
                <span className="text-sm font-bold tracking-wider uppercase text-[#70412d]">
                  VENDAS ({data.tipoRelatorio === "mensal" ? mesAnteriorFormatado : mesAtualNome})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1 text-center">Vendas</label>
                  <input
                    type="number"
                    value={data?.cakto?.vendas ?? ""}
                    onChange={(e) => handleChange("cakto", "vendas", e.target.value)}
                    className={inputSemSetinhasClass}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1 text-center">Vendas Abandonadas</label>
                  <input
                    type="number"
                    value={data?.cakto?.vendasAbandonadas ?? ""}
                    onChange={(e) => handleChange("cakto", "vendasAbandonadas", e.target.value)}
                    className={inputSemSetinhasClass}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#70412d]/80 uppercase block mb-1 text-center">Vendas Afiliadas</label>
                  <input
                    type="number"
                    value={data?.cakto?.vendasAfiliadas ?? ""}
                    onChange={(e) => handleChange("cakto", "vendasAfiliadas", e.target.value)}
                    className={inputSemSetinhasClass}
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