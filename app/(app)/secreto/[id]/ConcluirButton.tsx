"use client";

import { useRouter } from "next/navigation";

interface Props {
  estudoId: number;
}

export default function ConcluirButton({ estudoId }: Props) {
  const router = useRouter();

  function handleClick() {
    router.push("/diario?from=concluir");
  }

  return (
    <div className="mt-16 flex justify-center">
      <button
        onClick={handleClick}
        className="
          px-6
          py-2
          rounded-full
          bg-[#70412d]
          text-[#f9f5e9]
          text-sm
          tracking-wide
          transition
          hover:opacity-90
        "
      >
        Concluir
      </button>
    </div>
  );
}