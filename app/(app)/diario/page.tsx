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
    <div className="min-h-screen bg-[#fdfaf6] px-10 py-16 relative">
      
      {/* DATA */}
      <div className="absolute top-10 right-10 text-sm text-[#7a5c45] opacity-70 font-serif">
        {dataHoje}
      </div>

      {/* PERGUNTA CENTRAL */}
      <div className="text-center mb-16 mt-10">
        <h1 className="text-2xl font-serif text-[#4a3a2f]">
          O que Deus falou com você hoje?
        </h1>
      </div>

      <div className="flex gap-12">

        {/* COLUNA PRINCIPAL */}
        <div className="w-[70%]">
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva aqui..."
            className="w-full h-[500px] bg-transparent border-none outline-none resize-none leading-8 text-lg text-[#3e2f25] font-[cursive]"
          />

          <button
            onClick={handleSalvar}
            className="mt-8 px-6 py-2 bg-[#7a5c45] text-white rounded-full text-sm hover:opacity-90"
          >
            Salvar
          </button>

          {mensagem && (
            <p className="mt-4 text-sm text-[#7a5c45]">{mensagem}</p>
          )}
        </div>

        {/* COLUNA LATERAL */}
        <div className="w-[30%] border-l border-[#e8ded5] pl-8">

          <div className="mb-10">
            <h2 className="text-sm font-serif text-[#7a5c45] mb-4">
              Versículo
            </h2>
            <textarea
              value={versiculo}
              onChange={(e) => setVersiculo(e.target.value)}
              className="w-full h-32 bg-transparent border-none outline-none resize-none text-[#4a3a2f] italic leading-6"
            />
          </div>

          <div>
            <h2 className="text-sm font-serif text-[#7a5c45] mb-4">
              Destaque
            </h2>
            <textarea
              value={destaque}
              onChange={(e) => setDestaque(e.target.value)}
              className="w-full h-24 bg-transparent border-none outline-none resize-none text-[#4a3a2f] leading-6"
            />
          </div>

        </div>
      </div>

    </div>
  );
}