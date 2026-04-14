"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import ConcluirButton from "./ConcluirButton";

interface Estudo {
  id: number;
  texto: string;
  livro: string;
  capitulo: number;
  versiculo_inicio: number;
  versiculo_fim: number;
  contexto: string;
  aplicacao: string;
  destaque: string;
  jornada: string;
  ordem: number;
}

export default function EstudoPage() {
  const params = useParams();
  const estudoId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [estudo, setEstudo] = useState<Estudo | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 🔥 CARREGAR ESTUDO
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

  // 🔥 SALVAR SCROLL DO CONTAINER
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function salvar() {
      sessionStorage.setItem(
        `scroll-${estudoId}`,
        String(el.scrollTop)
      );
    }

    el.addEventListener("scroll", salvar);

    return () => {
      salvar();
      el.removeEventListener("scroll", salvar);
    };
  }, [estudoId]);

  // 🔥 RESTAURAR SCROLL DO CONTAINER
  useEffect(() => {
    const el = containerRef.current;
    const saved = sessionStorage.getItem(`scroll-${estudoId}`);

    if (el && saved) {
      setTimeout(() => {
        el.scrollTo({
          top: Number(saved),
          behavior: "instant",
        });
      }, 100);
    }
  }, [estudo]);

  if (loading) return <div className="h-screen bg-[#f9f5e9]" />;
  if (!estudo)
    return (
      <div className="p-6 text-[#70412d]">
        estudo não encontrado
      </div>
    );

  const referencia =
    estudo.versiculo_inicio !== estudo.versiculo_fim
      ? `${estudo.livro} ${estudo.capitulo}:${estudo.versiculo_inicio}-${estudo.versiculo_fim}`
      : `${estudo.livro} ${estudo.capitulo}:${estudo.versiculo_inicio}`;

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]"
    >

      {/* TOPO */}
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          Secreto
        </h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">

        {/* REFERÊNCIA */}
        <p className="text-sm tracking-widest text-[#70412d]/50 text-center mb-4">
          {referencia}
        </p>

        {/* VERSÍCULO */}
        <div className="flex justify-center mb-12">
          <p className="italic text-base leading-8 text-[#70412d]/85 text-center max-w-[48ch] whitespace-pre-line">
            {estudo.texto}
          </p>
        </div>

        {/* CONTEXTO */}
        <div className="mb-14">
          <div className="inline-block mb-4">
            <p className="text-sm tracking-widest text-[#70412d]/50">
              CONTEXTO
            </p>
            <div className="h-[2px] bg-[#e9d5bb] w-full mt-1"></div>
          </div>

          <p className="text-base leading-8 text-[#70412d]/85 whitespace-pre-line">
            {estudo.contexto}
          </p>
        </div>

        {/* APLICAÇÃO */}
        <div className="mb-10">
          <div className="inline-block mb-4">
            <p className="text-sm tracking-widest text-[#70412d]/50">
              APLICAÇÃO
            </p>
            <div className="h-[2px] bg-[#e9d5bb] w-full mt-1"></div>
          </div>

          <p className="text-base leading-8 text-[#70412d]/85 whitespace-pre-line">
            {estudo.aplicacao}
          </p>
        </div>

        <ConcluirButton estudoId={estudo.id} />

      </div>

    </div>
  );
}