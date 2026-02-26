"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f6f1e8] px-6 pt-10 pb-40 text-[#5c3b2e]">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <h1 className="text-3xl font-serif">Diário</h1>
        <span className="text-sm opacity-60">26/02/2026</span>
      </div>

      {/* Versículo + Destaque */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {/* Versículo */}
        <div className="bg-[#e9dfcf] rounded-3xl p-6 min-h-[160px] flex flex-col justify-between">
          <span className="text-xs opacity-50 mb-2">
            Ester 4:14
          </span>
          <p className="font-serif text-base leading-relaxed">
            “Quem sabe se não foi para um momento como este que você chegou à posição de rainha?”
          </p>
        </div>

        {/* Destaque */}
        <div className="bg-[#e9dfcf] rounded-3xl p-6 min-h-[120px] flex items-start">
          <p className="font-serif font-semibold text-lg leading-snug">
            Chegou a sua vez
          </p>
        </div>
      </div>

      {/* Campo principal */}
      <div className="relative">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="- ser anônima na terra, não me faz anônima no céu"
          className="
            w-full
            min-h-[420px]
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