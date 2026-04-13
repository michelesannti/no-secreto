"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {
  const [porcentagem, setPorcentagem] = useState(0);
  const [diasAtivos, setDiasAtivos] = useState<number[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

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
        .select("id");

      const total = estudos?.length || 0;

      const { data: progresso } = await supabase
        .from("progresso")
        .select("estudo_id, created_at")
        .eq("user_id", user.id)
        .eq("concluido", true);

      const feitos = progresso?.length || 0;

      setPorcentagem(total ? (feitos / total) * 100 : 0);

      const dias = progresso?.map((p) => {
        const date = new Date(p.created_at);
        return date.getDate();
      }) || [];

      setDiasAtivos(dias);
      setHistorico(progresso || []);
    }

    carregar();
  }, []);

  const historicoFiltrado = diaSelecionado
    ? historico.filter((item) => {
        const d = new Date(item.created_at).getDate();
        return d === diaSelecionado;
      })
    : [];

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-32 text-[#70412d]">

      {/* HEADER */}
      <div className="px-8 mb-10">
        <h1 className="text-xl font-serif tracking-wide">
          Perfil
        </h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-10">

        {/* PROGRESSO */}
        <div>
          <div className="relative w-full h-[10px] bg-[#e9d5bb]/50 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#C6A46A] rounded-full transition-all duration-700"
              style={{ width: `${porcentagem}%` }}
            />
          </div>
        </div>

        {/* CALENDÁRIO (BLOCO ÚNICO) */}
        <div className="space-y-2">

          {/* MÊS */}
          <p className="text-center text-sm font-semibold capitalize">
            {nomeMes}
          </p>

          {/* DIAS DA SEMANA */}
          <div className="grid grid-cols-7 text-xs font-semibold">
            {diasSemana.map((d, i) => (
              <div key={i} className="text-center">
                {d}
              </div>
            ))}
          </div>

          {/* DIAS */}
          <div className="grid grid-cols-7 gap-3">

            {diasMes.map((dia, i) => {
              if (!dia) return <div key={`empty-${i}`} />;

              const ativo = diasAtivos.includes(dia);
              const selecionado = diaSelecionado === dia;

              return (
                <div
                  key={`${dia}-${i}`}
                  onClick={() => ativo && setDiaSelecionado(dia)}
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full text-sm transition

                    ${ativo
                      ? "bg-[#C6A46A] text-[#f9f5e9] cursor-pointer"
                      : ""}

                    ${selecionado
                      ? "ring-2 ring-[#e9d5bb]"
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