"use client";

import { useRouter } from "next/navigation";

export default function ConclusaoPage() {
  const router = useRouter();

  function handleContinuar() {
    router.push("/secreto");
  }

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#f9f5e9] text-[#70412d] px-8 text-center">

      <div className="mb-10">
        <p className="text-lg font-serif mb-4">
          você finalizou seu tempo 🤎
        </p>

        <p className="text-sm text-[#70412d]/70">
          um passo mais perto de viver o que Deus preparou pra você
        </p>
      </div>

      <button
        onClick={handleContinuar}
        className="px-8 py-3 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide"
      >
        continuar
      </button>

    </div>
  );
}