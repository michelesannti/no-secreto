"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div
      className="min-h-screen px-10 pt-16 pb-40 text-[#5c3b2e]"
      style={{
        background:
          "linear-gradient(to bottom, #f8f3ea 0%, #f6f1e8 40%, #f3ede3 100%)",
      }}
    >
      {/* Topo */}
      <div className="flex justify-between items-start mb-16">
        <h1 className="text-3xl font-serif tracking-tight">Diário</h1>
        <span className="text-xs opacity-40">
          {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>

      {/* Versículo (mais suave) */}
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
          text-[13px]
          leading-6
          italic
          opacity-50
          mb-20
          placeholder:text-[#5c3b2e]/25
        "
      />

      {/* Destaque forte e printável */}
      <div className="mb-24 flex flex-col items-center text-center">
        <div className="w-20 h-px bg-[#5c3b2e]/20 mb-6"></div>

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
            text-[26px]
            leading-tight
            tracking-wide
            font-semibold
            placeholder:text-[#5c3b2e]/30
          "
        />

        <div className="w-12 h-px bg-[#5c3b2e]/15 mt-6"></div>
      </div>

      {/* Campo principal */}
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
            text-[18px]
            leading-9
            placeholder:text-[#5c3b2e]/35
          "
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 36px, rgba(92,59,46,0.05) 37px)",
          }}
        />
      </div>
    </div>
  );
}