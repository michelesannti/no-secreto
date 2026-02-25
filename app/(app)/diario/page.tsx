"use client";

import { useState } from "react";

export default function DiarioPage() {
  const [texto, setTexto] = useState("");
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");

  const hoje = new Date().toLocaleDateString("pt-BR");

  function handleSalvar() {
    console.log({
      texto,
      versiculo,
      destaque,
    });
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-6 pt-10 pb-40">
      {/* TOPO */}
      <div className="flex justify-between items-start mb-10">
        <h1 className="text-[#70412d] text-xl tracking-wide">
          Diário
        </h1>

        <span className="text-[#70412d]/60 text-sm">
          {hoje}
        </span>
      </div>

      {/* VERSÍCULO + DESTAQUE */}
      <div className="flex gap-4 mb-10">
        <textarea
          value={versiculo}
          onChange={(e) => setVersiculo(e.target.value)}
          placeholder="Versículo"
          className="
            w-1/2
            bg-[#e9d5bb]/35
            rounded-2xl
            p-4
            text-sm
            text-[#70412d]
            placeholder:text-[#70412d]/40
            resize-none
            outline-none
            leading-relaxed
          "
          rows={3}
        />

        <textarea
          value={destaque}
          onChange={(e) => setDestaque(e.target.value)}
          placeholder="Destaque"
          className="
            w-1/2
            bg-[#e9d5bb]/35
            rounded-2xl
            p-4
            text-sm
            text-[#70412d]
            placeholder:text-[#70412d]/40
            resize-none
            outline-none
            leading-relaxed
          "
          rows={3}
        />
      </div>

      {/* TEXTO PRINCIPAL COM LINHAS */}
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O que Deus falou com você hoje?"
        className="
          w-full
          min-h-[420px]
          bg-transparent
          text-[#70412d]
          placeholder:text-[#70412d]/30
          text-base
          leading-8
          outline-none
          resize-none
        "
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(112,65,45,0.08) 32px)",
        }}
      />

      {/* BOTÃO DISCRETO */}
      {texto.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSalvar}
            className="
              text-sm
              px-5
              py-2
              rounded-full
              bg-[#70412d]
              text-white
              shadow-md
              hover:opacity-90
              transition
            "
          >
            Salvar
          </button>
        </div>
      )}
    </div>
  );
}