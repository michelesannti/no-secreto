"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-8 pt-14 pb-40 text-[#70412d]">

      {/* Topo */}
      <div className="flex justify-between items-start mb-12">
        <h1 className="text-2xl font-serif tracking-tight">Diário</h1>
        <span className="text-xs opacity-40">
          {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>

      {/* Versículo */}
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
          mb-14
          placeholder:text-[#70412d]/30
        "
      />

      {/* Destaque com profundidade usando a paleta */}
      <div className="mb-16 text-center">
        <div className="w-16 h-px bg-[#e9d5bb] mx-auto mb-6"></div>

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
            font-semibold
            text-center
            text-[#70412d]
            placeholder:text-[#70412d]/40
          "
        />

        <div className="w-10 h-px bg-[#e9d5bb] mx-auto mt-6"></div>
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
            placeholder:text-[#70412d]/35
          "
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 36px, rgba(112,65,45,0.08) 37px)",
          }}
        />
      </div>

    </div>
  );
}