"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

interface Props {
  estudoId: number;
  userId: string;
}

export default function ConcluirButton({ estudoId, userId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleConcluir() {
    setLoading(true);

    const supabase = getSupabaseClient();

    // salva progresso
    await supabase.from("progresso_usuario").upsert({
      user_id: userId,
      estudo_id: estudoId,
      concluido: true,
    });

    // pega próximo estudo
    const { data: next } = await supabase
      .from("estudos")
      .select("id")
      .gt("id", estudoId)
      .order("id", { ascending: true })
      .limit(1)
      .single();

    if (next?.id) {
      router.push(`/secreto/${next.id}`);
    } else {
      router.push("/hoje"); // acabou tudo
    }

    setLoading(false);
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