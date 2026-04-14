"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {
  const [porcentagem, setPorcentagem] = useState(0);
  const [diasAtivos, setDiasAtivos] = useState<number[]>([]);
  const [diarios, setDiarios] = useState<any[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [registrosModal, setRegistrosModal] = useState<any[]>([]);

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

  useEffect(() => {
    async function carregar() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: estudos } = await supabase
        .from("estudos")
        .select("id")
        .eq("jornada", jornada);

      const total = estudos?.length || 0;

      const { data: progresso } = await supabase
        .from("progresso")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("jornada", jornada);

      const feitos = progresso?.length || 0;

      setPorcentagem(total ? (feitos / total) * 100 : 0);

      const dias =
        progresso?.map((p) => new Date(p.created_at).getDate()) || [];

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
      (d) => new Date(d.created_at).getDate() === dia
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
                    w-10 h-10 flex items-center justify-center rounded-full text-sm transition
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
            className="bg-[#f9f5e9] w-[90%] max-w-md rounded-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >

            {/* X MAIS SUAVE */}
            <button
              onClick={fecharModal}
              className="absolute top-4 right-4 text-[#70412d]/40"
            >
              ✕
            </button>

            <div className="space-y-10 max-h-[60vh] overflow-y-auto">

              {registrosModal.map((item, index) => (
                <div key={index} className="space-y-6">

                  {/* LINHA DOURADA */}
                  <div className="flex justify-center">
                    <div className="w-10 h-[2px] bg-[#C6A46A]/70 rounded-full" />
                  </div>

                  {/* TEXTO */}
                  <div
                    className="text-[16px] leading-8 text-[#70412d]/85"
                    dangerouslySetInnerHTML={{
                      __html: formatarTexto(item.texto),
                    }}
                  />

                  {index !== registrosModal.length - 1 && (
                    <div className="h-[1px] bg-[#e9d5bb]" />
                  )}

                </div>
              ))}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}