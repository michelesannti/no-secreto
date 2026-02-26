"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f6f1e8] px-8 pt-16 pb-40 text-[#5c3b2e]">

      {/* Data */}
      <div className="text-xs opacity-40 mb-10">
        {new Date().toLocaleDateString("pt-BR")}
      </div>

      {/* Versículo (semente) */}
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

      {/* Abertura relacional */}
      <div className="mb-6 font-serif text-[20px]">
        Hoje, Senhor...
      </div>

      {/* Campo principal contínuo */}
      <div className="relative">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
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
              "repeating-linear-gradient(to bottom, transparent, transparent 36px, rgba(92,59,46,0.06) 37px)",
          }}
        />

        <button
          className="
            absolute
            bottom-4
            right-0
            text-xs
            opacity-40
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