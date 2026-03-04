"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

interface Props {
  estudoId: string;
  userId: string;
}

export default function ConcluirButton({ estudoId, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const [concluido, setConcluido] = useState(false);

  async function handleConcluir() {
    setLoading(true);

    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from("progresso_usuario")
      .upsert({
        user_id: userId,
        estudo_id: estudoId,
        concluido: true,
      });

    if (!error) {
      setConcluido(true);
    }

    setLoading(false);
  }

  if (concluido) {
    return (
      <p className="text-center mt-10 text-sm text-[#70412d]/70">
        estudo concluído 🤎
      </p>
    );
  }

  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={handleConcluir}
        disabled={loading}
        className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide transition hover:opacity-90"
      >
        {loading ? "Salvando..." : "Concluir estudo"}
      </button>
    </div>
  );
}