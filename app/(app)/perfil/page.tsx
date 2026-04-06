"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {

  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");

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

      <div className="max-w-xl mx-auto px-8 space-y-6">

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