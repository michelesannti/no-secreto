"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f6f1e8] px-6 pt-10 pb-40 text-[#5c3b2e]">

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <h1 className="text-2xl font-serif">Diário</h1>
        <span className="text-sm opacity-50">
          {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>

      {/* Versículo — sutil */}
      <div className="mb-6">
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
            opacity-70
            placeholder:text-[#5c3b2e]/40
          "
        />
      </div>

      {/* Destaque — estilo post-it elegante */}
      <div className="mb-12 flex justify-start">
        <div className="bg-[#efe4d3] px-6 py-5 rounded-xl shadow-[0_8px_20px_rgba(112,65,45,0.08)] rotate-[-1deg] max-w-[75%]">
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
              font-semibold
              text-[16px]
              leading-snug
              placeholder:text-[#5c3b2e]/40
            "
          />
        </div>
      </div>

      {/* Texto principal — protagonista */}
      <div className="relative">
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
            tracking-wide
            placeholder:text-[#5c3b2e]/40
          "
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 34px, rgba(92,59,46,0.08) 35px)",
          }}
        />

        <button
          className="
            absolute
            bottom-4
            right-2
            text-xs
            opacity-50
            hover:opacity-80
            transition
          "
        >
          salvar
        </button>
      </div>

    </div>
  );
}