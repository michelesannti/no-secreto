"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function DiarioPage() {
  const [referencia, setReferencia] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");
  const [editando, setEditando] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarEstudoAtualNoDiario() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const jornadaAtual = "genesis-1";

      // busca estudos da jornada atual
      const { data: estudos, error: estudosError } = await supabase
        .from("estudos")
        .select("*")
        .eq("jornada", jornadaAtual)
        .order("ordem", { ascending: true });

      if (estudosError || !estudos || estudos.length === 0) {
        setLoading(false);
        return;
      }

      // busca progresso real da usuária
      const { data: progresso, error: progressoError } = await supabase
        .from("progresso")
        .select("estudo_id")
        .eq("user_id", user.id)
        .eq("concluido", true);

      if (progressoError) {
        setLoading(false);
        return;
      }

      const concluidosIds = progresso?.map((item) => item.estudo_id) || [];

      // pega o estudo atual em andamento = primeiro não concluído
      const estudoAtual = estudos.find(
        (estudo) => !concluidosIds.includes(estudo.id)
      );

      // se concluiu tudo da jornada, pega o último estudo só como referência
      const estudoBase = estudoAtual || estudos[estudos.length - 1];

      if (estudoBase) {
        setReferencia(`${estudoBase.livro} ${estudoBase.capitulo}:${estudoBase.versiculo}`);
        setDestaque(estudoBase.frase || "");
      }

      setLoading(false);
    }

    carregarEstudoAtualNoDiario();
  }, []);

  function formatarTexto(texto: string) {
    let formatado = texto
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~(.*?)~/g, "<s>$1</s>");

    return formatado.replace(/\n/g, "<br/>");
  }

  if (loading) {
    return <div className="h-[100dvh] overflow-hidden bg-[#f9f5e9]" />;
  }

  return (
    <div className="h-[100dvh] overflow-y-auto bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">
      {/* TOPO */}
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          Diário
        </h1>

        <div className="w-10 h-[2px] bg-[#C6A46A]/60 mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">

        {/* REFERÊNCIA */}
        {referencia && (
          <p className="text-sm text-[#70412d]/55 tracking-wide mb-10 text-center">
            {referencia}
          </p>
        )}

        {/* DESTAQUE */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4 max-w-full">
            <div className="w-[1.5px] h-8 bg-[#e9d5bb] shrink-0"></div>

            {editando ? (
              <textarea
                value={destaque}
                onChange={(e) => setDestaque(e.target.value)}
                placeholder="Destaque"
                className="bg-transparent resize-none outline-none font-serif text-xl font-semibold text-center placeholder:text-[#70412d]/30 leading-tight w-full"
              />
            ) : (
              <p
                className="font-serif text-xl font-semibold text-center leading-tight"
                dangerouslySetInnerHTML={{
                  __html: formatarTexto(destaque),
                }}
              />
            )}

            <div className="w-[1.5px] h-8 bg-[#e9d5bb] shrink-0"></div>
          </div>
        </div>

        {/* TEXTO */}
        <div className="relative min-h-[600px] mb-8">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 31px, #e9d5bb 31px, #e9d5bb 32px)",
            }}
          />

          {editando ? (
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="O que Deus falou com você?"
              className="relative w-full bg-transparent resize-none outline-none text-lg placeholder:text-[#70412d]/40"
              style={{
                lineHeight: "32px",
                minHeight: "600px",
              }}
            />
          ) : (
            <div
              className="relative text-lg"
              style={{
                lineHeight: "32px",
                minHeight: "600px",
              }}
              dangerouslySetInnerHTML={{
                __html: formatarTexto(texto),
              }}
            />
          )}
        </div>

        <div className="mt-12 flex justify-center">
          {editando ? (
            <button
              onClick={() => setEditando(false)}
              className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide"
            >
              Salvar
            </button>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="px-6 py-2 rounded-full border border-[#70412d] text-[#70412d] text-sm tracking-wide"
            >
              Editar
            </button>
          )}
        </div>

      </div>
    </div>
  );
}