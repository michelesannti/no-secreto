"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {
  const [porcentagem, setPorcentagem] = useState(0);
  const [diasAtivos, setDiasAtivos] = useState<number[]>([]);
  const [diarios, setDiarios] = useState<any[]>([]);
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

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
        .eq("user_id", user.id);

      setDiarios(diario || []);
    }

    carregar();
  }, []);

  const registrosDoDia = diaSelecionado
    ? diarios.filter(
        (d) => new Date(d.created_at).getDate() === diaSelecionado
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-32 text-[#70412d]">

      {/* HEADER */}
      <div className="px-8 mb-10">
        <h1 className="text-xl font-serif tracking-wide">Perfil</h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-12">

        {/* 💣 PROGRESSO (VERSÃO ORIGINAL CORRETA) */}
        <div>
          <div className="flex items-center justify-between mb-2">

            <p className="text-sm text-[#70412d]/60">
              Seu progresso
            </p>

            <p className="text-sm font-semibold text-[#70412d]">
              {Math.round(porcentagem)}%
            </p>

          </div>

          <div className="relative w-full h-[10px] bg-[#e9d5bb]/50 rounded-full overflow-hidden">
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
              <div key={i} className="text-center">
                {d}
              </div>
            ))}
          </div>

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
                    w-10 h-10 flex items-center justify-center rounded-full text-sm
                    ${ativo
                      ? "bg-[#C6A46A] text-white cursor-pointer"
                      : "text-[#70412d]/30"}
                    ${selecionado ? "ring-2 ring-[#70412d]" : ""}
                  `}
                >
                  {dia}
                </div>
              );
            })}

          </div>

        </div>

        {/* HISTÓRICO */}
        {diaSelecionado && registrosDoDia.length > 0 && (
          <div className="space-y-4">

            {registrosDoDia.map((_, index) => (
              <div
                key={index}
                className="bg-[#e9d5bb]/50 rounded-2xl p-5 flex items-center justify-between"
              >
                <p className="text-sm">
                  Meu momento com Deus
                </p>

                <div className="w-2 h-2 bg-[#C6A46A] rounded-full" />
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}