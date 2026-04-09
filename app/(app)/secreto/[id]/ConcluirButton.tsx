"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  estudoId: number;
}

export default function ConcluirButton({ estudoId }: Props) {
  const router = useRouter();
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const bloqueado = localStorage.getItem("liberado-finalizar") === "true";

    // 🔥 se já clicou em concluir, não mostra mais
    if (!bloqueado) {
      setMostrar(true);
    }
  }, []);

  function handleClick() {
    // 🔥 marca que iniciou fluxo
    localStorage.setItem("liberado-finalizar", "true");

    router.push("/diario?from=concluir");
  }

  if (!mostrar) return null;

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