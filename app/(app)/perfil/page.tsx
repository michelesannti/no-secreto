"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {
  const [porcentagem, setPorcentagem] = useState(0);
  const [diasAtivos, setDiasAtivos] = useState<number[]>([]);
  const [diarios, setDiarios] = useState<any[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [registrosModal, setRegistrosModal] = useState<any[]>([]);
  const [nomeJornadaAtual, setNomeJornadaAtual] = useState("");

  const jornada = "genesis-1";

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  const diasMes = [
    ...Array(primeiroDia).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

  const nomeMes = hoje.toLocaleDateString("pt-BR", {
    month: "long",
  });

  function getDiaBrasil(dataString: string) {
    const data = new Date(dataString);

    const brasil = new Date(
      data.toLocaleString("en-US", {
        timeZone: "America/Sao_Paulo",
      })
    );

    return brasil.getDate();
  }

  useEffect(() => {
    async function carregar() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 🔥 pega estudos da jornada
      const { data: estudos } = await supabase
        .from("estudos")
        .select("id, jornada_exibicao")
        .eq("jornada", jornada);

      const total = estudos?.length || 0;

      if (estudos && estudos.length > 0) {
        setNomeJornadaAtual(estudos[0].jornada_exibicao);
      }

      const estudosIds = estudos?.map((e) => e.id) || [];

      // 🔥 pega progresso SEM jornada
      const { data: progresso } = await supabase
        .from("progresso")
        .select("estudo_id, created_at")
        .eq("user_id", user.id);

      // 🔥 filtra só os estudos da jornada
      const progressoFiltrado =
        progresso?.filter((p) =>
          estudosIds.includes(p.estudo_id)
        ) || [];

      const feitos = progressoFiltrado.length;

      setPorcentagem(total ? (feitos / total) * 100 : 0);

      const dias =
        progressoFiltrado.map((p) =>
          getDiaBrasil(p.created_at)
        ) || [];

      setDiasAtivos(dias);

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
    const registros = diarios.filter(
      (d) => getDiaBrasil(d.created_at) === dia
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

        {/* PROGRESSO */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#70412d]/60">
              Meu Progresso
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

          <p className="text-[12px] text-[#70412d]/40 mt-2 text-center">
            {nomeJornadaAtual}
          </p>
        </div>

        {/* CALENDÁRIO */}
        <div className="bg-[#e9d5bb]/40 rounded-2xl p-6 space-y-4">

          <p className="text-center text-sm font-semibold capitalize">
            {nomeMes}
          </p>

          <div className="grid grid-cols-7 text-xs font-semibold text-[#70412d]">
            {diasSemana.map((d, i) => (
              <div key={i} className="text-center">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">

            {diasMes.map((dia, i) => {
              if (!dia) return <div key={`empty-${i}`} />;

              const ativo = diasAtivos.includes(dia);

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

      </div>

      {/* MODAL */}
      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={fecharModal}
        >

          <div
            className="bg-[#f9f5e9] w-[90%] max-w-md rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="space-y-10 max-h-[60vh] overflow-y-auto">

              {registrosModal.map((item, index) => (
                <div key={index} className="space-y-6">

                  <div className="flex justify-center">
                    <div className="w-10 h-[2px] bg-[#C6A46A]/70 rounded-full" />
                  </div>

                  <div
                    className="text-[16px] leading-8 text-[#70412d]/85"
                    dangerouslySetInnerHTML={{
                      __html: formatarTexto(item.texto),
                    }}
                  />

                </div>
              ))}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}