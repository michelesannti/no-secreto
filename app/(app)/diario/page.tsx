"use client";

import { useState, useRef, useEffect } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  const versiculoRef = useRef<HTMLTextAreaElement>(null);

  const hoje = new Date().toLocaleDateString("pt-BR");

  useEffect(() => {
    if (versiculoRef.current) {
      versiculoRef.current.style.height = "auto";
      versiculoRef.current.style.height =
        versiculoRef.current.scrollHeight + "px";
    }
  }, [versiculo]);

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-8 pt-14 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-lg font-serif tracking-wide">
            Diário
          </h1>
          <div className="w-8 h-[2px] bg-[#e9d5bb] mt-2"></div>
        </div>

        <span className="text-sm tracking-widest text-[#70412d]/60">
          {hoje}
        </span>
      </div>

      {/* VERSÍCULO */}
      <textarea
        ref={versiculoRef}
        value={versiculo}
        onChange={(e) => setVersiculo(e.target.value)}
        placeholder="Versículo"
        className="w-full bg-transparent resize-none outline-none italic text-[#70412d]/60 leading-relaxed mb-14 placeholder:text-[#70412d]/40 overflow-hidden"
      />

      {/* DESTAQUE */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-[1.5px] h-6 bg-[#e9d5bb]"></div>

          <textarea
            value={destaque}
            onChange={(e) => setDestaque(e.target.value)}
            placeholder="Destaque"
            className="bg-transparent resize-none outline-none font-serif text-xl font-semibold text-center placeholder:text-[#70412d]/30 leading-tight"
          />

          <div className="w-[1.5px] h-6 bg-[#e9d5bb]"></div>
        </div>
      </div>

      {/* TEXTO PRINCIPAL */}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O que Deus falou com você?"
        className="
          w-full
          bg-transparent
          resize-none
          outline-none
          text-lg
          placeholder:text-[#70412d]/40
        "
        style={{
          lineHeight: "32px",
          paddingTop: "0px",
          paddingBottom: "0px",
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 31px, #e9d5bb 31px, #e9d5bb 32px)",
          minHeight: "420px"
        }}
      />
    </div>
  );
}