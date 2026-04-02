"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

interface Props {
  estudoId: number;
  jornada: string;
  ordemAtual: number;
}

export default function ConcluirButton({
  estudoId,
  jornada,
  ordemAtual,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleConcluir() {
    setLoading(true);

    const supabase = getSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: progressoError } = await supabase
      .from("progresso")
      .upsert({
        user_id: user.id,
        estudo_id: estudoId,
        concluido: true,
      });

    if (progressoError) {
      setLoading(false);
      return;
    }

    const { data: next } = await supabase
      .from("estudos")
      .select("id, ordem")
      .eq("jornada", jornada)
      .gt("ordem", ordemAtual)
      .order("ordem", { ascending: true })
      .limit(1)
      .single();

    if (next?.id) {
      router.push(`/secreto/${next.id}`);
    } else {
      router.push("/hoje");
    }

    setLoading(false);
  }

  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={handleConcluir}
        disabled={loading}
        className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Concluir"}
      </button>
    </div>
  );
}