"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {
  const [porcentagem, setPorcentagem] = useState(0);
  const [diasAtivos, setDiasAtivos] = useState<string[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

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
        .select("estudo_id, created_at")
        .eq("user_id", user.id)
        .eq("jornada", jornada);

      const feitos = progresso?.length || 0;

      setPorcentagem(total ? (feitos / total) * 100 : 0);

      const dias = progresso?.map((p) =>
        new Date(p.created_at).toLocaleDateString("sv-SE")
      ) || [];

      setDiasAtivos(dias);
      setHistorico(progresso || []);
    }

    carregar();
  }, []);

  function getDateKey(dia: number) {
    return new Date(ano, mes, dia).toLocaleDateString("sv-SE");
  }

  const historicoFiltrado = diaSelecionado
    ? historico.filter(
        (item) =>
          new Date(item.created_at).toLocaleDateString("sv-SE") === diaSelecionado
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-32 text-[#70412d]">

      {/* HEADER */}
      <div className="px-8 mb-10">
        <h1 className="text-xl font-serif tracking-wide">Perfil</h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-10">

        {/* PROGRESSO */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#70412d]/60">
              Seu progresso
            </p>

            <p className="text-sm font-semibold">
              {Math.round(porcentagem)}%
            </p>
          </div>

          <div className="relative w-full h-[18px] bg-[#e9d5bb]/40 rounded-full overflow-hidden">
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

              const key = getDateKey(dia);
              const ativo = diasAtivos.includes(key);
              const selecionado = diaSelecionado === key;

              return (
                <div
                  key={`${dia}-${i}`}
                  onClick={() => ativo && setDiaSelecionado(key)}
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full text-sm transition-all duration-200

                    ${ativo
                      ? "bg-[#C6A46A] text-white shadow-md scale-105 cursor-pointer"
                      : "text-[#70412d]/30"}

                    ${selecionado
                      ? "ring-2 ring-[#70412d]"
                      : ""}
                  `}
                >
                  {dia}
                </div>
              );
            })}

          </div>

        </div>

        {/* HISTÓRICO */}
        {historicoFiltrado.length > 0 && (
          <div className="space-y-4 mt-6">

            {historicoFiltrado.map((item, index) => (
              <div
                key={index}
                className="bg-[#e9d5bb]/40 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="text-sm">
                  Estudo concluído
                </div>

                <div className="w-2 h-2 bg-[#C6A46A] rounded-full" />
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}