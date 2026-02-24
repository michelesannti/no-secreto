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
    <div className="min-h-screen bg-[#fdfaf6] px-4 md:px-20 py-16 relative">

      {/* DATA */}
      <div className="absolute top-10 right-4 md:right-20 text-xs text-[#7a5c45] opacity-70 font-serif">
        {dataHoje}
      </div>

      {/* PERGUNTA CENTRAL */}
      <div className="text-center mb-16 mt-10">
        <h1 className="text-lg md:text-2xl font-serif text-[#4a3a2f]">
          O que Deus falou com você hoje?
        </h1>
      </div>

      {/* ESTRUTURA 70 / 30 FIXA ATÉ NO MOBILE */}
      <div className="flex flex-row gap-4">

        {/* COLUNA PRINCIPAL 70% */}
        <div className="w-[70%]">

          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva aqui..."
            className="
              w-full 
              h-[500px]
              bg-transparent 
              border-none 
              outline-none 
              resize-none 
              text-base md:text-lg
              text-[#3e2f25]
              leading-8
            "
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 31px, #e8ded5 32px)",
            }}
          />

          <button
            onClick={handleSalvar}
            className="mt-8 px-5 py-2 bg-[#7a5c45] text-white rounded-full text-sm hover:opacity-90 transition"
          >
            Salvar
          </button>

          {mensagem && (
            <p className="mt-4 text-sm text-[#7a5c45]">
              {mensagem}
            </p>
          )}

        </div>

        {/* COLUNA LATERAL 30% */}
        <div className="w-[30%] border-l border-[#e8ded5] pl-4">

          <div className="mb-12">
            <h2 className="text-[10px] md:text-xs font-serif text-[#7a5c45] mb-4 tracking-wide">
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
                text-[#4a3a2f]
                text-sm
                leading-6
              "
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 23px, #e8ded5 24px)",
                backgroundSize: "100% 24px",
              }}
            />
          </div>

          <div>
            <h2 className="text-[10px] md:text-xs font-serif text-[#7a5c45] mb-4 tracking-wide">
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
                text-[#4a3a2f]
                text-sm
                leading-6
              "
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 23px, #e8ded5 24px)",
                backgroundSize: "100% 24px",
              }}
            />
          </div>

        </div>

      </div>

    </div>
  );
}