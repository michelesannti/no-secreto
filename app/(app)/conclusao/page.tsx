"use client";

import { useRouter } from "next/navigation";

export default function ConclusaoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f9f5e9] flex flex-col items-center justify-center text-center text-[#70412d] px-8">

      <div className="flex flex-col items-center gap-8">

        {/* FRASE PRINCIPAL */}
        <p className="text-xl font-serif leading-relaxed max-w-[28ch]">
          Você separou um momento com Deus 🤎
        </p>

        {/* LINHA */}
        <div className="w-10 h-[2px] bg-[#e9d5bb]"></div>

        {/* FRASE SUAVE */}
        <p className="text-sm text-[#70412d]/60">
          continue no seu tempo
        </p>

      </div>

      {/* AÇÃO DISCRETA */}
      <button
        onClick={() => router.push("/secreto")}
        className="
          absolute bottom-10
          text-xs
          text-[#70412d]/40
          tracking-wide
        "
      >
        tocar para continuar
      </button>

    </div>
  );
}