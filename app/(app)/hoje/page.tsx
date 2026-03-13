"use client";

import Link from "next/link";
import Image from "next/image";

export default function HojePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f9f5e9]">

      {/* PORTAL / LOGO FULLSCREEN */}

      <div className="fixed inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/logo.png"
            alt="Portal No Secreto"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* CAMADA PARA DAR LEITURA NO TEXTO */}

      <div className="fixed inset-0 bg-[#f9f5e9]/65 z-10"></div>

      {/* CONTEÚDO */}

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-8 text-center text-[#70412d]">

        <p className="font-serif text-2xl leading-relaxed mb-20">

          “Não é sobre fazer perfeito.
          <br />
          É sobre não desistir.”

        </p>

        <Link
          href="/secreto/1"
          className="px-8 py-4 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide transition hover:opacity-90"
        >
          Iniciar meu tempo com Deus
        </Link>

      </div>

    </div>
  );
}