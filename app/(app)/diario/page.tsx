"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");
  const [versiculo, setVersiculo] = useState("");

  const hoje = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-8 pt-14 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-xl font-serif tracking-wide">
            Diário
          </h1>
          <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
        </div>

        <span className="text-sm tracking-widest text-[#70412d]/60">
          {hoje}
        </span>
      </div>

      {/* VERSÍCULO */}
      <textarea
        value={versiculo}
        onChange={(e) => setVersiculo(e.target.value)}
        placeholder="Versículo"
        className="w-full bg-transparent resize-none outline-none italic text-[#70412d]/60 leading-relaxed mb-14 placeholder:text-[#70412d]/40"
      />

      {/* DESTAQUE COM LINHAS VERTICAIS */}
      <div className="flex items-center justify-center mb-14">
        <div className="flex items-center gap-6 w-full justify-center">

          <div className="w-[2px] h-12 bg-[#e9d5bb]"></div>

          <textarea
            value={destaque}
            onChange={(e) => setDestaque(e.target.value)}
            placeholder="Destaque"
            className="bg-transparent resize-none outline-none font-serif text-3xl font-semibold text-center placeholder:text-[#70412d]/30 leading-tight"
          />

          <div className="w-[2px] h-12 bg-[#e9d5bb]"></div>

        </div>
      </div>

      {/* TEXTO PRINCIPAL */}
      <div>
        <p className="mb-4 text-[#70412d]/70">
          O que Deus falou com você?
        </p>

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder=""
          className="
            w-full
            bg-transparent
            resize-none
            outline-none
            leading-8
            text-lg
            placeholder:text-[#70412d]/40
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