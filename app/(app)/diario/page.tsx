"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f6f1e8] px-6 pt-10 pb-40 text-[#5c3b2e]">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-serif">Diário</h1>
        <span className="text-sm opacity-50">
          {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>

      {/* Versículo + Destaque assimétricos */}
      <div className="flex gap-4 mb-10">

        {/* Versículo horizontal (maior) */}
        <div className="flex-1 bg-[#e9dfcf] rounded-3xl p-6 min-h-[160px]">
          <textarea
            value={versiculo}
            onChange={(e) => setVersiculo(e.target.value)}
            placeholder="Escreva aqui o versículo do dia..."
            className="
              w-full
              h-full
              bg-transparent
              resize-none
              outline-none
              font-serif
              text-[15px]
              leading-7
              placeholder:text-[#5c3b2e]/40
            "
          />
        </div>

        {/* Destaque vertical (mais estreito) */}
        <div className="w-[38%] bg-[#e9dfcf] rounded-3xl p-6 min-h-[160px] flex items-start">
          <textarea
            value={destaque}
            onChange={(e) => setDestaque(e.target.value)}
            placeholder="Destaque..."
            className="
              w-full
              h-full
              bg-transparent
              resize-none
              outline-none
              font-serif
              font-semibold
              text-[17px]
              leading-snug
              placeholder:text-[#5c3b2e]/40
            "
          />
        </div>

      </div>

      {/* Campo principal com linhas fixas */}
      <div className="relative">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva aqui o que Deus falou com você hoje..."
          className="
            w-full
            min-h-[460px]
            bg-transparent
            resize-none
            outline-none
            font-serif
            text-[16px]
            leading-8
            tracking-wide
            placeholder:text-[#5c3b2e]/40
          "
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 30px, rgba(92,59,46,0.08) 31px)",
          }}
        />

        {/* Botão salvar discreto */}
        <button
          className="
            absolute
            bottom-4
            right-2
            text-xs
            opacity-50
            hover:opacity-80
            transition
          "
        >
          salvar
        </button>
      </div>

    </div>
  );
}