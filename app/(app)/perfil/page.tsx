"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {

  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [porcentagem, setPorcentagem] = useState(0);

  useEffect(() => {
    async function carregar() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("nome, apelido")
        .eq("id", user.id)
        .single();

      if (data) {
        setNome(data.nome || "");
        setApelido(data.apelido || "");
      }

      // 🔥 PROGRESSO
      const { data: estudos } = await supabase
        .from("estudos")
        .select("id")
        .eq("jornada", "genesis-1");

      const total = estudos?.length || 0;

      const { data: progresso } = await supabase
        .from("progresso")
        .select("estudo_id")
        .eq("user_id", user.id)
        .eq("concluido", true);

      const concluidos = progresso?.length || 0;

      setPorcentagem(total ? (concluidos / total) * 100 : 0);
    }

    carregar();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          Perfil
        </h1>

        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-xl mx-auto px-8 space-y-10">

        {/* PROGRESSO */}
        <div>
          <p className="text-sm text-[#70412d]/60 mb-4">
            Sua jornada
          </p>

          <div className="relative w-full h-[4px] bg-[#e9d5bb] rounded-full">

            <div
              className="absolute top-0 left-0 h-[4px] bg-[#C6A46A] rounded-full"
              style={{ width: `${porcentagem}%` }}
            />

          </div>

          <p className="mt-4 text-sm text-[#70412d]/60">
            {Math.round(porcentagem)}% concluído
          </p>
        </div>

        {/* DADOS */}
        <div>
          <p className="text-sm text-[#70412d]/60 mb-1">
            Nome
          </p>

          <p className="text-lg">
            {nome}
          </p>
        </div>

        <div>
          <p className="text-sm text-[#70412d]/60 mb-1">
            Apelido
          </p>

          <p className="text-lg">
            {apelido || "Nenhum apelido definido"}
          </p>
        </div>

      </div>
    </div>
  );
}