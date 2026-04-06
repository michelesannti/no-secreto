"use client";

import { useRouter } from "next/navigation";

interface Props {
  estudoId: number;
}

export default function ConcluirButton({ estudoId }: Props) {
  const router = useRouter();

  function handleConcluir() {
    // 👉 apenas leva pro diário
    router.push("/diario");
  }

  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={handleConcluir}
        className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide transition hover:opacity-90"
      >
        Concluir
      </button>
    </div>
  );
}