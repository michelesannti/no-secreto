"use client";

import Link from "next/link";

export default function HojePage() {
  return (
    <div className="min-h-screen bg-[#f9f5e9] flex flex-col items-center justify-center px-8 text-center">

      {/* LOGO PORTAL */}

      <img
        src="/logo.png"
        alt="No Secreto"
        className="w-[260px] mb-12 animate-[pulse_6s_ease-in-out_infinite]"
      />

      {/* FRASE */}

      <p className="font-serif text-lg text-[#70412d]/80 leading-relaxed mb-16 max-w-md">

        “Não é sobre fazer perfeito.
        <br />
        É sobre não desistir.”

      </p>

      {/* BOTÃO */}

      <Link
        href="/secreto/1"
        className="px-8 py-4 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide shadow-md transition hover:scale-[1.02]"
      >
        Iniciar meu tempo com Deus
      </Link>

    </div>
  );
}