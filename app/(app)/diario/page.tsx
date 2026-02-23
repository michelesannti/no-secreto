"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { Dancing_Script, Playfair_Display } from "next/font/google";

const cursive = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function Diario() {
  const supabase = getSupabaseClient();

  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const handleSave = async () => {
    if (!texto.trim()) return;

    setLoading(true);

    await supabase.from("diario_entries").insert({
      versiculo,
      destaque,
      conteudo_texto: texto,
    });

    setTexto("");
    setVersiculo("");
    setDestaque("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f2eee9] flex justify-center py-10 px-6">
      <div className="w-full max-w-5xl bg-[#f7f3ee] rounded-3xl p-12 relative">
        
        {/* Data */}
        <div className="absolute top-10 right-12 text-sm text-[#7a5c4b] opacity-70">
          {hoje}
        </div>

        {/* Pergunta */}
        <h1 className={`${serif.className} text-3xl text-[#4a3428] mb-12`}>
          O que Deus falou com você hoje?
        </h1>

        <div className="flex gap-10">
          
          {/* Escrita principal */}
          <div className="w-[70%]">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva aqui..."
              className={`${cursive.className} w-full bg-transparent resize-none focus:outline-none text-[#4a3428]`}
              style={{
                minHeight: "65vh",
                fontSize: "22px",
                lineHeight: "42px",
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 40px, #d8cfc6 41px)",
              }}
            />
          </div>

          {/* Coluna lateral */}
          <div className="w-[30%] space-y-10">

            <div>
              <p className="text-xs tracking-widest text-[#7a5c4b] mb-3">
                VERSÍCULO
              </p>
              <textarea
                value={versiculo}
                onChange={(e) => setVersiculo(e.target.value)}
                className={`${serif.className} w-full bg-transparent resize-none focus:outline-none text-[#4a3428]`}
                style={{
                  minHeight: "120px",
                  lineHeight: "32px",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 30px, #d8cfc6 31px)",
                }}
              />
            </div>

            <div>
              <p className="text-xs tracking-widest text-[#7a5c4b] mb-3">
                DESTAQUE
              </p>
              <textarea
                value={destaque}
                onChange={(e) => setDestaque(e.target.value)}
                className={`${serif.className} w-full bg-transparent resize-none focus:outline-none text-[#4a3428]`}
                style={{
                  minHeight: "120px",
                  lineHeight: "32px",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 30px, #d8cfc6 31px)",
                }}
              />
            </div>

          </div>
        </div>

        {/* Botão */}
        <div className="flex justify-center mt-16">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#cbb7a7] text-white px-10 py-4 rounded-full"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}