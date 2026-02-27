"use client";

import { useState, useRef, useEffect } from "react";

export default function DiarioPage() {
  const [versiculo, setVersiculo] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");
  const [editando, setEditando] = useState(true);

  const versiculoRef = useRef<HTMLTextAreaElement>(null);

  const hoje = new Date().toLocaleDateString("pt-BR");

  useEffect(() => {
    if (versiculoRef.current) {
      versiculoRef.current.style.height = "auto";
      versiculoRef.current.style.height =
        versiculoRef.current.scrollHeight + "px";
    }
  }, [versiculo]);

  function formatarTexto(texto: string) {
    let formatado = texto
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~(.*?)~/g, "<s>$1</s>");

    return formatado.replace(/\n/g, "<br/>");
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] px-8 pt-6 pb-40 text-[#70412d]">

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
      {editando ? (
        <textarea
          ref={versiculoRef}
          value={versiculo}
          onChange={(e) => setVersiculo(e.target.value)}
          placeholder="Versículo"
          className="w-full bg-transparent resize-none outline-none italic text-[#70412d]/60 leading-relaxed mb-14 placeholder:text-[#70412d]/40 overflow-hidden"
        />
      ) : (
        <p className="italic text-[#70412d]/60 leading-relaxed mb-14">
          {versiculo}
        </p>
      )}

      {/* DESTAQUE */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-[1.5px] h-8 bg-[#e9d5bb]"></div>

          {editando ? (
            <textarea
              value={destaque}
              onChange={(e) => setDestaque(e.target.value)}
              placeholder="Destaque"
              className="bg-transparent resize-none outline-none font-serif text-xl font-semibold text-center placeholder:text-[#70412d]/30 leading-tight"
            />
          ) : (
            <p
              className="font-serif text-xl font-semibold text-center leading-tight"
              dangerouslySetInnerHTML={{
                __html: formatarTexto(destaque),
              }}
            />
          )}

          <div className="w-[1.5px] h-8 bg-[#e9d5bb]"></div>
        </div>
      </div>

      {/* TEXTO PRINCIPAL */}
      <div className="relative min-h-[600px] mb-8">

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 31px, #e9d5bb 31px, #e9d5bb 32px)",
          }}
        />

        {editando ? (
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="O que Deus falou com você?"
            className="relative w-full h-full bg-transparent resize-none outline-none text-lg placeholder:text-[#70412d]/40"
            style={{
              lineHeight: "32px",
              minHeight: "600px"
            }}
          />
        ) : (
          <div
            className="relative text-lg"
            style={{
              lineHeight: "32px",
              minHeight: "600px"
            }}
            dangerouslySetInnerHTML={{
              __html: formatarTexto(texto),
            }}
          />
        )}

      </div>

      {/* BOTÃO */}
      <div className="mt-12 flex justify-center">
        {editando ? (
          <button
            onClick={() => setEditando(false)}
            className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide"
          >
            Salvar
          </button>
        ) : (
          <button
            onClick={() => setEditando(true)}
            className="px-6 py-2 rounded-full border border-[#70412d] text-[#70412d] text-sm tracking-wide"
          >
            Editar
          </button>
        )}
      </div>

    </div>
  );
}