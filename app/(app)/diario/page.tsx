"use client";

import { useState } from "react";

export default function DiarioPage() {

  const [texto, setTexto] = useState("");

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">

      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          Diário
        </h1>

        <div className="w-10 h-[2px] bg-[#C6A46A]/60 mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="O que Deus falou com você?"
          className="w-full min-h-[400px] bg-transparent outline-none resize-none text-lg"
        />

      </div>

    </div>
  );
}