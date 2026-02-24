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
    const formatada = hoje.toLocaleDateString("pt-BR");
    setDataHoje(formatada);
  }, []);

  async function handleSalvar() {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("diario_entries").insert([
      {
        conteudo,
        versiculo,
        destaque,
        data: new Date().toISOString(),
      },
    ]);

    if (error) {
      setMensagem("Erro ao salvar.");
    } else {
      setMensagem("Salvo 🤎");
    }
  }

  return (
    <div className="min-h-screen bg-[#efe7dc] px-4 py-10">

      {/* FOLHA CENTRAL */}
      <div className="max-w-5xl mx-auto bg-[#f6efe6] shadow-[0_10px_30px_rgba(0,0,0,0.04)] px-6 md:px-16 py-16 relative">

        {/* DATA */}
        <div className="absolute top-8 right-6 md:right-16 text-[11px] text-[#8a6f58] opacity-70 font-serif tracking-wide">
          {dataHoje}
        </div>

        {/* PERGUNTA */}
        <div className="text-center mt-6 mb-20">
          <h1 className="text-xl md:text-2xl font-serif text-[#4e3b2f] leading-relaxed">
            O que Deus falou com você hoje?
          </h1>
        </div>

        {/* ESTRUTURA 70 / 30 FIXA */}
        <div className="flex flex-row gap-6">

          {/* COLUNA PRINCIPAL */}
          <div className="w-[70%] pr-4">

            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Escreva aqui..."
              className="
                w-full 
                h-[520px]
                bg-transparent 
                border-none 
                outline-none 
                resize-none 
                text-[17px]
                text-[#3e2f25]
                leading-9
                font-light
              "
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 34px, #e3d7cb 35px)",
              }}
            />

            <button
              onClick={handleSalvar}
              className="mt-10 px-6 py-2 bg-[#7a5c45] text-white rounded-full text-xs tracking-wide hover:opacity-90 transition"
            >
              SALVAR
            </button>

            {mensagem && (
              <p className="mt-4 text-xs text-[#8a6f58]">
                {mensagem}
              </p>
            )}

          </div>

          {/* COLUNA LATERAL */}
          <div className="w-[30%] pl-6 border-l border-[#e3d7cb]/40">

            {/* VERSÍCULO */}
            <div className="mb-16">
              <h2 className="text-[10px] font-serif text-[#8a6f58] tracking-[2px] mb-6">
                VERSÍCULO
              </h2>

              <textarea
                value={versiculo}
                onChange={(e) => setVersiculo(e.target.value)}
                className="
                  w-full 
                  h-28 
                  bg-transparent 
                  border-none 
                  outline-none 
                  resize-none 
                  italic 
                  text-[#4e3b2f]
                  text-sm
                  leading-7
                "
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 26px, #e3d7cb 27px)",
                }}
              />
            </div>

            {/* DESTAQUE */}
            <div>
              <h2 className="text-[10px] font-serif text-[#8a6f58] tracking-[2px] mb-6">
                DESTAQUE
              </h2>

              <textarea
                value={destaque}
                onChange={(e) => setDestaque(e.target.value)}
                className="
                  w-full 
                  h-24 
                  bg-transparent 
                  border-none 
                  outline-none 
                  resize-none 
                  text-[#4e3b2f]
                  text-sm
                  leading-7
                "
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 26px, #e3d7cb 27px)",
                }}
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}