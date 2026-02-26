"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-8 pt-10 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="flex justify-between items-start mb-8">

        {/* DIÁRIO - mais discreto */}
        <div>
          <h1 className="text-xl font-serif tracking-wide text-[#70412d]">
            Diário
          </h1>
          <div className="w-8 h-px bg-[#e9d5bb] mt-2"></div>
        </div>

        {/* DATA mais refinada */}
        <span className="text-xs tracking-[0.2em] text-[#70412d]/40 mt-1">
          {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>

      {/* VERSÍCULO */}
      <textarea
        value={versiculo}
        onChange={(e) => setVersiculo(e.target.value)}
        placeholder="Versículo"
        className="w-full bg-transparent resize-none outline-none font-serif text-sm italic opacity-60 mb-8 placeholder:text-[#70412d]/30"
      />

      {/* DESTAQUE - linhas laterais elegantes */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-[#e9d5bb]"></div>

        <textarea
          value={destaque}
          onChange={(e) => setDestaque(e.target.value)}
          placeholder="Destaque"
          className="w-auto min-w-[120px] max-w-[60%] bg-transparent resize-none outline-none font-serif text-2xl font-semibold text-center placeholder:text-[#70412d]/40"
        />

        <div className="flex-1 h-px bg-[#e9d5bb]"></div>
      </div>

      {/* TEXTO PRINCIPAL - mais próximo */}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O que Deus falou com você?"
        className="w-full min-h-[460px] bg-transparent resize-none outline-none font-serif text-lg leading-9 placeholder:text-[#70412d]/35"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 36px, rgba(112,65,45,0.08) 37px)",
        }}
      />
    </div>
  );
}