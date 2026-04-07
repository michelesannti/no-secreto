"use client";

import { use, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import ConcluirButton from "./ConcluirButton";

interface Estudo {
  id: number;
  texto: string;
  livro: string;
  capitulo: number;
  versiculo: string;
  contexto: string;
  aplicacao: string;
  destaque: string;
  jornada: string;
  ordem: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EstudoPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const estudoId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [estudo, setEstudo] = useState<Estudo | null>(null);

  useEffect(() => {
    async function carregar() {
      const supabase = getSupabaseClient();

      const { data: estudoAtual } = await supabase
        .from("estudos")
        .select("*")
        .eq("id", estudoId)
        .single();

      if (!estudoAtual) {
        setLoading(false);
        return;
      }

      setEstudo(estudoAtual);
      setLoading(false);
    }

    carregar();
  }, [estudoId]);

  if (loading) {
    return <div className="min-h-screen bg-[#f9f5e9]" />;
  }

  if (!estudo) {
    return <div className="p-6 text-[#70412d]">estudo não encontrado</div>;
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          No Secreto
        </h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">

        {/* PALAVRA */}
        <div className="mb-16">
          <p className="text-sm tracking-widest text-[#70412d]/50 mb-4">
            PALAVRA
          </p>

          <p className="italic text-lg leading-relaxed text-[#70412d]/85">
            {estudo.texto}
          </p>

          <p className="mt-3 text-sm text-[#70412d]/60">
            {estudo.livro} {estudo.capitulo}:{estudo.versiculo}
          </p>
        </div>

        {/* CONTEXTO */}
        <div className="mb-10 space-y-16">

          <div>
            <h2 className="font-semibold text-[17px] mb-4">
              O que estava acontecendo
            </h2>

            <p className="leading-8 text-[#70412d]/85">
              {estudo.contexto}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[17px] mb-4">
              Trazendo pra vida
            </h2>

            <p className="leading-8 text-[#70412d]/85">
              {estudo.aplicacao}
            </p>
          </div>

        </div>

        {/* DESTAQUE */}
        <div className="flex items-center justify-center mt-16 mb-10">
          <div className="flex items-center gap-4">

            <div className="w-[2px] h-8 bg-[#e9d5bb]"></div>

            <p
              className="font-serif text-xl font-semibold text-center text-[#70412d] leading-snug max-w-[36ch] sm:max-w-[42ch] mx-auto"
              style={{ textWrap: "balance", wordBreak: "keep-all" }}
            >
              {estudo.destaque}
            </p>

            <div className="w-[2px] h-8 bg-[#e9d5bb]"></div>

          </div>
        </div>

        <ConcluirButton estudoId={estudo.id} />

      </div>
    </div>
  );
}