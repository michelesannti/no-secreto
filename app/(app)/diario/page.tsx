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
        conteudo_texto: conteudo,
        versiculo_texto: versiculo,
        conteudo_desenho: destaque,
      },
    ]);

    if (error) {
      setMensagem("Erro ao salvar.");
    } else {
      setMensagem("Salvo com carinho ✨");
      setConteudo("");
      setVersiculo("");
      setDestaque("");
    }
  }

  return (
    <div className="min-h-screen bg-[#f4ede4] px-6 py-10">

      {/* TOPO */}
      <div className="flex justify-between items-center mb-16">
        <h1 className="font-serif text-lg text-[#5a4636] tracking-wide">
          Diário
        </h1>

        <span className="text-sm text-[#8c7563] opacity-70 font-serif">
          {dataHoje}
        </span>
      </div>

      {/* PERGUNTA CENTRAL */}
      <div className="text-center mb-20">
        <h2 className="text-2xl md:text-3xl font-serif text-[#4e3b2f] leading-relaxed max-w-2xl mx-auto">
          O que Deus falou com você hoje?
        </h2>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex flex-row gap-12">

        {/* COLUNA ESQUERDA 75% */}
        <div className="w-[75%]">

          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva aqui..."
            className="
              w-full
              h-[600px]
              bg-transparent
              border-none
              outline-none
              resize-none
              text-[18px]
              text-[#3e2f25]
              leading-10
            "
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 38px, #e5d8cc 39px)",
            }}
          />

          <button
            onClick={handleSalvar}
            className="mt-12 px-8 py-2 bg-[#7a5c45] text-white rounded-full text-xs tracking-widest hover:opacity-90 transition"
          >
            SALVAR
          </button>

          {mensagem && (
            <p className="mt-4 text-xs text-[#8a6f58]">
              {mensagem}
            </p>
          )}
        </div>

        {/* COLUNA DIREITA 25% */}
        <div className="w-[25%] space-y-16">

          {/* VERSÍCULO - estilo post-it */}
          <div className="bg-[#efe3d6] p-6 rounded-md">
            <h3 className="text-[11px] font-serif tracking-[3px] text-[#8a6f58] mb-4">
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
                text-[#4e3b2f]
                text-sm
                leading-7
              "
            />
          </div>

          {/* DESTAQUE - estilo anotação */}
          <div className="bg-[#e9dbcc] p-6 rounded-md">
            <h3 className="text-[11px] font-serif tracking-[3px] text-[#8a6f58] mb-4">
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
                text-[#4e3b2f]
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