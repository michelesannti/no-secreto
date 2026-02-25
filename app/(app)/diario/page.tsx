"use client";

import { useEffect, useState } from "react";

export default function DiarioPage() {
  const [texto, setTexto] = useState("");
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");

  const data = new Date().toLocaleDateString("pt-BR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-6 pt-14 pb-40">
      
      {/* TOPO */}
      <div className="flex justify-between items-start mb-14">
        <h1 className="text-[18px] tracking-wide text-[#70412d] font-medium">
          Diário
        </h1>

        <span className="text-[13px] text-[#70412d]/60 font-serif">
          {data}
        </span>
      </div>

      {/* VERSÍCULO + DESTAQUE */}
      <div className="flex gap-5 mb-12">
        
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-widest text-[#70412d]/50 mb-3">
            Versículo
          </p>

          <textarea
            value={versiculo}
            onChange={(e) => setVersiculo(e.target.value)}
            placeholder="Escreva aqui a frase que tocou você..."
            className="
              w-full
              bg-[#efe4d2]/60
              rounded-2xl
              px-4
              py-4
              text-[14px]
              leading-relaxed
              text-[#5a3424]
              placeholder:text-[#70412d]/30
              resize-none
              focus:outline-none
              focus:bg-[#efe4d2]/80
              transition-all
            "
            rows={3}
          />
        </div>

        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-widest text-[#70412d]/50 mb-3">
            Destaque
          </p>

          <textarea
            value={destaque}
            onChange={(e) => setDestaque(e.target.value)}
            placeholder="Uma frase para guardar..."
            className="
              w-full
              bg-[#efe4d2]/60
              rounded-2xl
              px-4
              py-4
              text-[14px]
              leading-relaxed
              text-[#5a3424]
              placeholder:text-[#70412d]/30
              resize-none
              focus:outline-none
              focus:bg-[#efe4d2]/80
              transition-all
            "
            rows={3}
          />
        </div>
      </div>

      {/* PERGUNTA DIRECIONAMENTO */}
      <p className="text-[15px] italic text-[#70412d]/50 font-serif mb-8">
        O que Deus falou com você hoje?
      </p>

      {/* TEXTO PRINCIPAL */}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Comece a escrever..."
        className="
          w-full
          bg-[#f3e8d6]
          rounded-[28px]
          px-6
          py-8
          text-[16px]
          leading-loose
          text-[#4a2b1d]
          placeholder:text-[#70412d]/30
          resize-none
          focus:outline-none
          focus:bg-[#efe4d2]
          transition-all
          min-h-[320px]
          shadow-[inset_0_1px_3px_rgba(112,65,45,0.06)]
        "
      />

      {/* BOTÃO SALVAR */}
      <div className="mt-12 flex justify-center">
        <button
          className="
            bg-[#70412d]
            text-[#f9f5e9]
            px-8
            py-3
            rounded-full
            text-[14px]
            tracking-wide
            shadow-[0_8px_20px_rgba(112,65,45,0.20)]
            active:scale-95
            transition-all
          "
        >
          Salvar
        </button>
      </div>
    </div>
  );
}