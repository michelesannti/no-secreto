"use client";

import Link from "next/link";

export default function HojePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* LOGO / PORTAL EM TELA CHEIA */}

      <div className="fixed inset-0 -z-10">
        <img
          src="/logo.png"
          alt="Portal No Secreto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* CAMADA DE LUZ SUAVE PARA MELHORAR LEITURA */}

      <div className="fixed inset-0 bg-[#f9f5e9]/70 -z-10" />

      {/* CONTEÚDO DA HOME */}

      <div className="max-w-2xl mx-auto px-8 pt-40 text-center text-[#70412d]">

        {/* FRASE DO APP */}

        <p className="font-serif text-2xl leading-relaxed mb-20">

          “Não é sobre fazer perfeito.
          <br />
          É sobre não desistir.”

        </p>

        {/* BOTÃO */}

        <Link
          href="/secreto/1"
          className="block text-center py-4 rounded-full bg-[#70412d] text-[#f9f5e9] tracking-wide text-sm transition hover:opacity-90"
        >
          Iniciar meu tempo com Deus
        </Link>

      </div>

    </div>
  );
}