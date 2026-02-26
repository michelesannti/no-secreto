"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-8 pt-14 pb-40 text-[#70412d]">

      <div className="flex justify-between items-start mb-12">
        <h1 className="text-2xl font-serif">Diário</h1>
        <span className="text-xs opacity-40">
          {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>

      <textarea
        value={versiculo}
        onChange={(e) => setVersiculo(e.target.value)}
        placeholder="Versículo"
        className="w-full bg-transparent resize-none outline-none font-serif text-sm italic opacity-60 mb-14 placeholder:text-[#70412d]/30"
      />

      <div className="relative mb-16">
        <div className="absolute inset-0 bg-[#e9d5bb]/30 blur-2xl rounded-full"></div>

        <textarea
          value={destaque}
          onChange={(e) => setDestaque(e.target.value)}
          placeholder="Destaque"
          className="relative w-full bg-transparent resize-none outline-none font-serif text-2xl font-semibold text-center placeholder:text-[#70412d]/40"
        />
      </div>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O que Deus falou com você?"
        className="w-full min-h-[520px] bg-transparent resize-none outline-none font-serif text-lg leading-9 placeholder:text-[#70412d]/35"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 36px, rgba(112,65,45,0.08) 37px)",
        }}
      />
    </div>
  );
}