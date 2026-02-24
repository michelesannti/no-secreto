"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function DiarioPage() {
  const [conteudo, setConteudo] = useState("");
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [dataHoje, setDataHoje] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const hoje = new Date();
    setDataHoje(hoje.toLocaleDateString("pt-BR"));
  }, []);

  async function handleSalvar() {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("diario_entries").insert([
      {
        conteudo_texto: conteudo,
        versiculo_texto: versiculo,
        conteudo_desenho: destaque,
      },
    ]);

    if (error) {
      setMensagem("Erro ao salvar.");
    } else {
      setMensagem("Salvo ✨");
      setConteudo("");
      setVersiculo("");
      setDestaque("");
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9]">

      {/* TOPO */}
      <div className="flex justify-between items-center px-8 pt-10">
        <h1 className="font-serif text-lg text-[#70412d]">
          Diário
        </h1>

        <span className="text-sm text-[#70412d]/60 font-serif">
          {dataHoje}
        </span>
      </div>

      {/* PERGUNTA */}
      <div className="text-center mt-20 mb-24 px-6">
        <h2 className="text-3xl font-serif text-[#70412d] leading-relaxed max-w-3xl mx-auto">
          O que Deus falou com você hoje?
        </h2>
      </div>

      {/* CONTEÚDO */}
      <div className="flex gap-16 px-10 pb-32">

        {/* TEXTO PRINCIPAL */}
        <div className="w-[75%]">
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva aqui..."
            className="
              w-full
              h-[650px]
              bg-transparent
              border-none
              outline-none
              resize-none
              text-[18px]
              text-[#70412d]
              leading-10
            "
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 38px, #e9d5bb 39px)",
            }}
          />

          <button
            onClick={handleSalvar}
            className="mt-12 px-8 py-2 bg-[#70412d] text-[#f9f5e9] rounded-full text-xs tracking-widest hover:opacity-90 transition"
          >
            SALVAR
          </button>

          {mensagem && (
            <p className="mt-4 text-xs text-[#70412d]/70">
              {mensagem}
            </p>
          )}
        </div>

        {/* LATERAL */}
        <div className="w-[25%] space-y-20">

          <div className="bg-[#e9d5bb] p-8 rounded-xl">
            <h3 className="text-[11px] font-serif tracking-[4px] text-[#70412d]/70 mb-6">
              VERSÍCULO
            </h3>

            <textarea
              value={versiculo}
              onChange={(e) => setVersiculo(e.target.value)}
              className="
                w-full
                bg-transparent
                border-none
                outline-none
                resize-none
                italic
                text-[#70412d]
                text-sm
                leading-7
              "
            />
          </div>

          <div className="bg-[#e9d5bb]/70 p-8 rounded-xl">
            <h3 className="text-[11px] font-serif tracking-[4px] text-[#70412d]/70 mb-6">
              DESTAQUE
            </h3>

            <textarea
              value={destaque}
              onChange={(e) => setDestaque(e.target.value)}
              className="
                w-full
                bg-transparent
                border-none
                outline-none
                resize-none
                text-[#70412d]
                text-sm
                leading-7
              "
            />
          </div>

        </div>
      </div>
    </div>
  );
}