"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {
  const [porcentagem, setPorcentagem] = useState(0);
  const [datasAtivas, setDatasAtivas] = useState<string[]>([]);
  const [diarios, setDiarios] = useState<any[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [registrosModal, setRegistrosModal] = useState<any[]>([]);
  const [nomeJornadaAtual, setNomeJornadaAtual] = useState("");
  const [concluidas, setConcluidas] = useState<string[]>([]);
  const [mesesComRegistro, setMesesComRegistro] = useState<string[]>([]);

  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const diasMes = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

  const nomeMes = new Date(anoAtual, mesAtual).toLocaleDateString("pt-BR", {
    month: "long",
  });

  const mesAtualKey = `${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}`;
  const mesAnteriorKey =
    mesAtual === 0
      ? `${anoAtual - 1}-12`
      : `${anoAtual}-${String(mesAtual).padStart(2, "0")}`;

  const hojeKey = `${hoje.getFullYear()}-${String(
    hoje.getMonth() + 1
  ).padStart(2, "0")}`;

  const podeVoltar = mesesComRegistro.includes(mesAnteriorKey);
  const podeAvancar = mesAtualKey !== hojeKey;

  function getDataAtualBrasil(dia: number) {
    return `${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  }

  function voltarMes() {
    if (!podeVoltar) return;

    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual((prev) => prev - 1);
    } else {
      setMesAtual((prev) => prev - 1);
    }
  }

  function avancarMes() {
    if (!podeAvancar) return;

    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual((prev) => prev + 1);
    } else {
      setMesAtual((prev) => prev + 1);
    }
  }

  useEffect(() => {
    async function carregar() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: estudos } = await supabase
        .from("estudos")
        .select("*")
        .order("jornada_ordem", { ascending: true })
        .order("ordem", { ascending: true });

      if (!estudos || estudos.length === 0) return;

      const { data: progresso } = await supabase
        .from("progresso")
        .select("estudo_id, data_local")
        .eq("user_id", user.id);

      const concluidosIds = progresso?.map((p) => p.estudo_id) || [];

      // meses com registro
      const meses = new Set<string>();
      progresso?.forEach((p) => {
        if (!p.data_local) return;
        const [ano, mes] = p.data_local.split("-");
        meses.add(`${ano}-${mes}`);
      });
      setMesesComRegistro(Array.from(meses));

      const jornadasMap = new Map();

      estudos.forEach((e) => {
        if (!jornadasMap.has(e.jornada)) {
          jornadasMap.set(e.jornada, {
            nome: e.jornada_exibicao,
            total: 0,
            ordem: e.jornada_ordem,
          });
        }

        jornadasMap.get(e.jornada).total++;
      });

      const jornadasOrdenadas = [...jornadasMap.entries()].sort(
        (a, b) => a[1].ordem - b[1].ordem
      );

      let jornadaAtual = null;
      const jornadasConcluidas: string[] = [];

      for (let [jornadaId, data] of jornadasOrdenadas) {
        const estudosDaJornada = estudos
          .filter((e) => e.jornada === jornadaId)
          .map((e) => e.id);

        const feitos = estudosDaJornada.filter((id) =>
          concluidosIds.includes(id)
        ).length;

        if (feitos === data.total) {
          jornadasConcluidas.push(data.nome);
        }

        if (!jornadaAtual && feitos < data.total) {
          jornadaAtual = {
            nome: data.nome,
            feitos,
            total: data.total,
          };
        }
      }

      setConcluidas(jornadasConcluidas);

      if (!jornadaAtual) return;

      setNomeJornadaAtual(jornadaAtual.nome);
      setPorcentagem(
        (jornadaAtual.feitos / jornadaAtual.total) * 100
      );

      const datas =
        progresso?.map((p) => p.data_local).filter(Boolean) || [];

      setDatasAtivas(datas);

      const { data: diario } = await supabase
        .from("diario")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      setDiarios(diario || []);
    }

    carregar();
  }, []);

  function abrirModal(dia: number) {
    const dataSelecionada = getDataAtualBrasil(dia);

    const registros = diarios.filter(
      (d) => d.data_local === dataSelecionada
    );

    if (registros.length === 0) return;

    setRegistrosModal(registros);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setRegistrosModal([]);
  }

  function formatarTexto(texto: string) {
    if (!texto) return "";

    return texto
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~(.*?)~/g, "<s>$1</s>")
      .replace(/\n/g, "<br/>");
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-32 text-[#70412d]">

      <div className="px-8 mb-10">
        <h1 className="text-xl font-serif tracking-wide">Perfil</h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-12">

        {/* JORNADA */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[#70412d]">
              {nomeJornadaAtual}
            </p>

            <p className="text-sm font-semibold text-[#70412d]">
              {Math.round(porcentagem)}%
            </p>
          </div>

          <div className="relative w-full h-[18px] bg-[#e9d5bb]/50 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#C6A46A] rounded-full transition-all duration-700"
              style={{ width: `${porcentagem}%` }}
            />
          </div>
        </div>

        {/* CALENDÁRIO */}
        <div className="bg-[#e9d5bb]/40 rounded-2xl p-6 space-y-4">

          <div className="flex items-center justify-between">

            {podeVoltar ? (
              <button onClick={voltarMes} className="text-sm opacity-60">
                ←
              </button>
            ) : (
              <div className="w-5" />
            )}

            <p className="text-center text-sm font-semibold capitalize flex-1">
              {nomeMes}
            </p>

            {podeAvancar ? (
              <button onClick={avancarMes} className="text-sm opacity-60">
                →
              </button>
            ) : (
              <div className="w-5" />
            )}

          </div>

          <div className="grid grid-cols-7 text-xs font-semibold text-[#70412d]">
            {diasSemana.map((d, i) => (
              <div key={i} className="text-center">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {diasMes.map((dia, i) => {
              if (!dia) return <div key={`empty-${i}`} />;

              const dataAtual = getDataAtualBrasil(dia);
              const ativo = datasAtivas.includes(dataAtual);

              return (
                <div
                  key={`${dia}-${i}`}
                  onClick={() => ativo && abrirModal(dia)}
                  className={`
                    w-9 h-9 flex items-center justify-center rounded-full text-sm transition
                    ${ativo
                      ? "bg-[#C6A46A] text-white scale-110 shadow-sm cursor-pointer"
                      : "text-[#70412d]/30"}
                  `}
                >
                  {dia}
                </div>
              );
            })}
          </div>

        </div>

        {/* CONCLUÍDAS */}
        {concluidas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {concluidas.map((nome, i) => (
              <div
                key={i}
                className="flex items-center rounded-full bg-[#e9d5bb]/30 text-[12px] text-[#70412d]/60 p-[2px]"
              >
                <div className="px-3 py-1">{nome}</div>

                <div className="flex items-center justify-center bg-[#C6A46A] rounded-full w-6 h-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}