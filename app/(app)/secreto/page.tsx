"use client";

import Link from "next/link";

const estudos = [
  {
    id: "intimidade-com-deus",
    titulo: "Intimidade com Deus",
    descricao: "Aprenda a desenvolver uma vida profunda no secreto.",
  },
  {
    id: "identidade-em-cristo",
    titulo: "Identidade em Cristo",
    descricao: "Descubra quem você é em Deus.",
  },
  {
    id: "proposito",
    titulo: "Propósito",
    descricao: "Entenda o chamado que Deus tem para sua vida.",
  },
];

export default function SecretoPage() {
  return (
    <div className="min-h-screen px-6 py-10 bg-[#F9F5E9] text-[#70412D]">
      <h1
        className="text-4xl mb-8"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        No Secreto
      </h1>

      <div className="grid gap-6">
        {estudos.map((estudo) => (
          <Link
            key={estudo.id}
            href={`/secreto/${estudo.id}`}
            className="block group"
          >
            <div className="p-6 rounded-2xl bg-[#E9D5BB] hover:scale-[1.02] transition">
              <h2
                className="text-2xl mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {estudo.titulo}
              </h2>

              <p className="opacity-80">{estudo.descricao}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}