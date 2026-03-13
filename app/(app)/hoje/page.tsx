"use client";

import Link from "next/link";
import Image from "next/image";

export default function HojePage() {
  return (
    <div className="min-h-screen bg-[#f9f5e9] flex flex-col items-center justify-center px-8 text-center">

      {/* LOGO PORTAL */}

      <div className="mb-16">
        <Image
          src="/logo.png"
          alt="No Secreto"
          width={220}
          height={220}
          priority
        />
      </div>

      {/* FRASE */}

      <p className="font-serif text-2xl text-[#70412d] leading-relaxed mb-20">

        “Não é sobre fazer perfeito.
        <br />
        É sobre não desistir.”

      </p>

      {/* BOTÃO */}

      <Link
        href="/secreto/1"
        className="px-8 py-4 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide transition hover:opacity-90"
      >
        Iniciar meu tempo com Deus
      </Link>

    </div>
  );
}