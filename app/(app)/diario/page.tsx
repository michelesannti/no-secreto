"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  const hoje = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-8 pt-14 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-2xl font-serif tracking-wide">
            Diário
          </h1>
          <div className="w-12 h-[2px] bg-[#e9d5bb] mt-2"></div>
        </div>

        <span className="text-sm tracking-wider text-[#70412d]/60">
          {hoje}
        </span>
      </div>

      {/* VERSÍCULO */}
      <textarea
        placeholder="Versículo"
        className="w-full bg-transparent resize-none outline-none italic text-[#70412d]/60 leading-relaxed mb-12 placeholder:text-[#70412d]/40"
      />

      {/* DESTAQUE COM LINHAS DOS LADOS */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="flex-1 h-px bg-[#e9d5bb]"></div>

        <textarea
          value={destaque}
          onChange={(e) => setDestaque(e.target.value)}
          placeholder="Destaque"
          className="bg-transparent resize-none outline-none font-serif text-2xl font-semibold text-center placeholder:text-[#70412d]/30"
        />

        <div className="flex-1 h-px bg-[#e9d5bb]"></div>
      </div>

      {/* TEXTO PRINCIPAL */}
      <div>
        <p className="mb-4 text-[#70412d]/70">
          O que Deus falou com você?
        </p>

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva aqui..."
          className="
            w-full
            bg-transparent
            resize-none
            outline-none
            leading-8
            text-lg
            placeholder:text-[#70412d]/30
            border-none
          "
          style={{
            backgroundImage: `linear-gradient(to bottom, #e9d5bb 1px, transparent 1px)`,
            backgroundSize: "100% 32px",
          }}
        />
      </div>
    </div>
  );
}