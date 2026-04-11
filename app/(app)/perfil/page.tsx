"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {
  const [porcentagem, setPorcentagem] = useState(0);
  const [diasAtivos, setDiasAtivos] = useState<number[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);

  useEffect(() => {
    async function carregar() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // PROGRESSO
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

      // CALENDÁRIO (dias ativos)
      const dias = progresso?.map((p) => {
        const date = new Date(p.created_at);
        return date.getDate();
      }) || [];

      setDiasAtivos(dias);

      // HISTÓRICO (últimos 4)
      setHistorico(progresso?.slice(0, 4) || []);
    }

    carregar();
  }, []);

  // CALENDÁRIO MOCK (30 dias)
  const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-32 text-[#70412d]">

      {/* HEADER */}
      <div className="px-8 mb-10">
        <h1 className="text-xl font-serif tracking-wide">
          Perfil
        </h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-md mx-auto px-6 space-y-12">

        {/* PROGRESSO */}
        <div>
          <div className="relative w-full h-[10px] bg-[#e9d5bb]/50 rounded-full overflow-hidden">

            <div
              className="absolute top-0 left-0 h-full bg-[#C6A46A] rounded-full transition-all duration-700"
              style={{ width: `${porcentagem}%` }}
            />

          </div>

          <p className="mt-3 text-sm text-[#70412d]/50">
            {Math.round(porcentagem)}% concluído
          </p>
        </div>

        {/* CALENDÁRIO */}
        <div>

          <p className="text-sm text-[#70412d]/50 mb-4">
            Sua constância
          </p>

          <div className="grid grid-cols-7 gap-3">

            {diasMes.map((dia) => {
              const ativo = diasAtivos.includes(dia);

              return (
                <div
                  key={dia}
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full text-sm
                    ${ativo
                      ? "bg-[#C6A46A] text-[#f9f5e9]"
                      : "bg-[#e9d5bb]/40"}
                  `}
                >
                  {dia}
                </div>
              );
            })}

          </div>

        </div>

        {/* HISTÓRICO */}
        <div>

          <p className="text-sm text-[#70412d]/50 mb-4">
            Seu caminho
          </p>

          <div className="space-y-4">

            {historico.length === 0 && (
              <div className="bg-[#e9d5bb]/30 rounded-xl p-5 text-sm text-[#70412d]/50">
                Seus estudos vão aparecer aqui 🤎
              </div>
            )}

            {historico.map((item, index) => (
              <div
                key={index}
                className="bg-[#e9d5bb]/40 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm">
                    Estudo concluído
                  </p>
                  <p className="text-xs text-[#70412d]/50">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="w-2 h-2 bg-[#C6A46A] rounded-full" />
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}