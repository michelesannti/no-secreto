"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#efe9df] flex justify-center py-10 px-4">

      {/* Página */}
      <div className="
        w-full 
        max-w-md 
        bg-[#f6f1e8] 
        rounded-3xl 
        shadow-[0_10px_40px_rgba(0,0,0,0.06)] 
        px-8 
        pt-14 
        pb-36 
        text-[#5c3b2e]
      ">

        {/* Topo */}
        <div className="flex justify-between items-start mb-12">
          <h1 className="text-2xl font-serif">Diário</h1>
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
            mb-16
            placeholder:text-[#5c3b2e]/30
          "
        />

        {/* Símbolo sutil */}
        <div className="flex justify-center mb-6 opacity-30 text-sm">
          ✝︎
        </div>

        {/* Destaque */}
        <div className="mb-16 text-center">
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
              placeholder:text-[#5c3b2e]/35
            "
          />
        </div>

        {/* Campo principal */}
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="O que Deus falou com você?"
          className="
            w-full
            min-h-[500px]
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