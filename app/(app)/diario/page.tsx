"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f6f1e8] px-7 pt-12 pb-40 text-[#5c3b2e]">

      {/* Header */}
      <div className="flex justify-between items-start mb-14">
        <h1 className="text-3xl font-serif">Diário</h1>
        <span className="text-sm opacity-40">
          {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>

      {/* Versículo — pequeno e sutil */}
      <div className="mb-8">
        <textarea
          value={versiculo}
          onChange={(e) => setVersiculo(e.target.value)}
          placeholder="Versículo"
          className="
            w-full
            bg-transparent
            resize-none
            outline-none
            font-serif
            text-[14px]
            leading-6
            italic
            opacity-60
            placeholder:text-[#5c3b2e]/30
          "
        />
      </div>

      {/* Linha delicada de separação */}
      <div className="h-px bg-[#5c3b2e]/10 mb-12" />

      {/* Destaque — frase contemplativa */}
      <div className="mb-20">
        <textarea
          value={destaque}
          onChange={(e) => setDestaque(e.target.value)}
          placeholder="Destaque"
          className="
            w-full
            bg-transparent
            resize-none
            outline-none
            font-serif
            text-[22px]
            leading-snug
            tracking-wide
            placeholder:text-[#5c3b2e]/40
          "
        />
      </div>

      {/* Texto principal */}
      <div className="relative">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="O que Deus falou com você?"
          className="
            w-full
            min-h-[520px]
            bg-transparent
            resize-none
            outline-none
            font-serif
            text-[19px]
            leading-9
            tracking-wide
            placeholder:text-[#5c3b2e]/40
          "
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 36px, rgba(92,59,46,0.07) 37px)",
          }}
        />

        <button
          className="
            absolute
            bottom-4
            right-2
            text-xs
            opacity-40
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