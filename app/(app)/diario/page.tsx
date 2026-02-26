"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-8 pt-12 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="flex justify-between items-start mb-10">

        {/* DIÁRIO - agora com identidade */}
        <div>
          <h1 className="text-3xl tracking-tight font-serif text-[#70412d]">
            Diário
          </h1>
          <div className="w-12 h-[2px] bg-[#e9d5bb] mt-2"></div>
        </div>

        {/* DATA refinada */}
        <span className="text-sm tracking-widest text-[#70412d]/40 mt-2">
          {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>

      {/* VERSÍCULO */}
      <textarea
        value={versiculo}
        onChange={(e) => setVersiculo(e.target.value)}
        placeholder="Versículo"
        className="w-full bg-transparent resize-none outline-none font-serif text-sm italic opacity-60 mb-10 placeholder:text-[#70412d]/30"
      />

      {/* DESTAQUE */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="w-8 h-px bg-[#e9d5bb]"></div>
          <div className="w-3 h-3 rounded-full bg-[#e9d5bb]"></div>
          <div className="w-8 h-px bg-[#e9d5bb]"></div>
        </div>

        <textarea
          value={destaque}
          onChange={(e) => setDestaque(e.target.value)}
          placeholder="Destaque"
          className="w-full bg-transparent resize-none outline-none font-serif text-2xl font-semibold text-center placeholder:text-[#70412d]/40"
        />

        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="w-8 h-px bg-[#e9d5bb]"></div>
          <div className="w-3 h-3 rounded-full bg-[#e9d5bb]"></div>
          <div className="w-8 h-px bg-[#e9d5bb]"></div>
        </div>
      </div>

      {/* TEXTO PRINCIPAL - subiu e aproximou */}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O que Deus falou com você?"
        className="w-full min-h-[480px] bg-transparent resize-none outline-none font-serif text-lg leading-9 placeholder:text-[#70412d]/35"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 36px, rgba(112,65,45,0.08) 37px)",
        }}
      />
    </div>
  );
}