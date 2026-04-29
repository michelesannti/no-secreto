"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  jornada_ordem: number;
}

export default function EstudoPage() {
  const params = useParams();
  const router = useRouter();
  const estudoId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [estudo, setEstudo] = useState<Estudo | null>(null);

  function quebrarVersiculos(texto: string) {
    return texto.split("\n").map((linha) => {
      const match = linha.match(/^(\d+)(.*)/);
      if (!match) return { numero: null, texto: linha };

      return {
        numero: match[1],
        texto: match[2],
      };
    });
  }

  useEffect(() => {
    async function carregar() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: estudos } = await supabase
        .from("estudos")
        .select("*")
        .order("jornada_ordem", { ascending: true })
        .order("ordem", { ascending: true });

      if (!estudos || estudos.length === 0) {
        setLoading(false);
        return;
      }

      const { data: progresso } = await supabase
        .from("progresso")
        .select("estudo_id")
        .eq("user_id", user.id);

      const concluidosIds = progresso?.map((p) => p.estudo_id) || [];

      const proximo =
        estudos.find((e) => !concluidosIds.includes(e.id)) ||
        estudos[estudos.length - 1];

      if (proximo && estudoId !== proximo.id) {
        router.replace(`/secreto/${proximo.id}`);
        return;
      }

      setEstudo(proximo);
      setLoading(false);
    }

    carregar();
  }, [estudoId, router]);

  if (loading) return <div className="h-screen bg-[#f9f5e9]" />;

  if (!estudo) {
    return <div className="p-6 text-[#70412d]">estudo não encontrado</div>;
  }

  const referencia =
    estudo.versiculo_inicio !== estudo.versiculo_fim
      ? `${estudo.livro} ${estudo.capitulo}:${estudo.versiculo_inicio}-${estudo.versiculo_fim}`
      : `${estudo.livro} ${estudo.capitulo}:${estudo.versiculo_inicio}`;

  return (
    <div className="h-screen overflow-y-auto bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">Secreto</h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">
        <p className="text-sm tracking-widest text-[#70412d]/50 text-center mb-4">
          {referencia}
        </p>

        <div className="flex justify-center mb-12">
          <div className="space-y-2 text-left max-w-[48ch]">
            {quebrarVersiculos(estudo.texto).map((linha, i) => (
              <div key={i} className="flex items-start gap-2">
                {linha.numero && (
                  <span className="text-[10px] opacity-70 mt-[4px]">
                    {linha.numero}
                  </span>
                )}

                <span className="text-base leading-8 text-[#70412d]/85 italic tracking-[0.01em]">
                  {linha.texto}
                </span>
              </div>
            ))}
          </div>
        </div>

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