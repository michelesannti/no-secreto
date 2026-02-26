"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div
      className="min-h-screen px-8 pt-16 pb-40 text-[#5c3b2e]"
      style={{
        background: `
          radial-gradient(circle at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.04) 100%),
          repeating-linear-gradient(
            0deg,
            #f6f1e8,
            #f6f1e8 2px,
            #f5efe6 2px,
            #f5efe6 4px
          )
        `,
      }}
    >
      {/* Topo */}
      <div className="flex justify-between items-start mb-14">
        <h1 className="text-3xl font-serif">Diário</h1>
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
          opacity-55
          mb-20
          placeholder:text-[#5c3b2e]/30
        "
      />

      {/* Destaque com linha longa elegante */}
      <div className="mb-24 text-center">
        <div className="w-24 h-px bg-[#5c3b2e]/20 mx-auto mb-6"></div>

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
            text-[24px]
            leading-tight
            tracking-wide
            font-semibold
            text-center
            placeholder:text-[#5c3b2e]/35
          "
        />
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