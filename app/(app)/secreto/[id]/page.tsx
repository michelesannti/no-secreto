"use client";

import { use, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import ConcluirButton from "./ConcluirButton";

interface Estudo {
  id: number;
  titulo?: string;
  texto: string;
  livro: string;
  capitulo: number;
  versiculo: string;
  contexto: string;
  aplicacao: string;
  frase: string;
  jornada: string;
  ordem: number;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EstudoPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const estudoId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [estudo, setEstudo] = useState<Estudo | null>(null);
  const [porcentagem, setPorcentagem] = useState(0);

  useEffect(() => {
    async function carregarEstudo() {
      const supabase = getSupabaseClient();

      if (Number.isNaN(estudoId)) {
        setLoading(false);
        return;
      }

      const { data: estudoAtual, error: estudoError } = await supabase
        .from("estudos")
        .select("*")
        .eq("id", estudoId)
        .single();

      if (estudoError || !estudoAtual) {
        setLoading(false);
        return;
      }

      setEstudo(estudoAtual);

      const { data: estudosDaJornada } = await supabase
        .from("estudos")
        .select("id")
        .eq("jornada", estudoAtual.jornada);

      const total = estudosDaJornada?.length || 0;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const idsDaJornada = estudosDaJornada?.map((item) => item.id) || [];

        const { data: progresso } = await supabase
          .from("progresso")
          .select("estudo_id")
          .eq("user_id", user.id)
          .eq("concluido", true);

        const concluidosIds = progresso?.map((item) => item.estudo_id) || [];

        const concluidos = concluidosIds.filter((id) =>
          idsDaJornada.includes(id)
        ).length;

        setPorcentagem(total ? (concluidos / total) * 100 : 0);
      }

      setLoading(false);
    }

    carregarEstudo();
  }, [estudoId]);

  if (loading) {
    return <div className="h-[100dvh] overflow-hidden bg-[#f9f5e9]" />;
  }

  if (!estudo) {
    return <div className="p-6 text-[#70412d]">estudo não encontrado</div>;
  }

  return (
    <div className="h-[100dvh] overflow-y-auto bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          No Secreto
        </h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">

        {/* PROGRESSO */}
        <div className="mb-16">
          <p className="text-sm text-[#70412d]/70 mb-4">
            Sua jornada
          </p>

          <div className="relative w-full h-[4px] bg-[#e9d5bb] rounded-full">
            <div
              className="absolute top-0 left-0 h-[4px] bg-[#C6A46A] rounded-full transition-all duration-700"
              style={{ width: `${porcentagem}%` }}
            />

            <div
              className="absolute -top-[6px] w-4 h-4 rounded-full bg-[#C6A46A]"
              style={{ left: `calc(${porcentagem}% - 8px)` }}
            />
          </div>

          <p className="mt-4 text-sm text-[#70412d]/70">
            {Math.round(porcentagem)}%
          </p>
        </div>

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
        <div className="mb-10">
          <p className="text-sm tracking-widest text-[#70412d]/50 mb-8">
            CONTEXTO
          </p>

          <div className="space-y-16">

            <div>
              <h2 className="font-semibold text-[17px] text-[#70412d] mb-4">
                O que estava acontecendo
              </h2>

              <p className="leading-8 text-[#70412d]/85">
                {estudo.contexto}
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[17px] text-[#70412d] mb-4">
                Trazendo pra vida
              </h2>

              <p className="leading-8 text-[#70412d]/85">
                {estudo.aplicacao}
              </p>
            </div>

          </div>
        </div>

        {/* FRASE DESTACADA */}
        <div className="flex items-center justify-center mt-16 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-[1.5px] h-8 bg-[#e9d5bb] shrink-0"></div>

            <p
              className="font-serif text-xl font-semibold text-center leading-snug max-w-[34ch] sm:max-w-[42ch] [text-wrap:balance]"
            >
              {estudo.frase}
            </p>

            <div className="w-[1.5px] h-8 bg-[#e9d5bb] shrink-0"></div>
          </div>
        </div>

        <ConcluirButton
          estudoId={estudo.id}
          jornada={estudo.jornada}
          ordemAtual={estudo.ordem}
        />

      </div>
    </div>
  );
}