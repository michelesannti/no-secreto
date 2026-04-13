"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function SecretoPage() {
  const router = useRouter();

  useEffect(() => {
    async function carregar() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // 🔥 ESTUDOS DA JORNADA
      const { data: estudos } = await supabase
        .from("estudos")
        .select("id, ordem")
        .eq("jornada", "genesis-1")
        .order("ordem", { ascending: true });

      if (!estudos || estudos.length === 0) {
        router.replace("/hoje");
        return;
      }

      // 🔥 PROGRESSO DO USUÁRIO (SEM CONCLUIDO)
      const { data: progresso } = await supabase
        .from("progresso")
        .select("estudo_id")
        .eq("user_id", user.id);

      const concluidosIds = progresso?.map((p) => p.estudo_id) || [];

      // 🔥 PRÓXIMO ESTUDO
      const proximo =
        estudos.find((e) => !concluidosIds.includes(e.id)) ||
        estudos[estudos.length - 1];

      if (proximo?.id) {
        router.replace(`/secreto/${proximo.id}`);
      }
    }

    carregar();
  }, [router]);

  return <div className="min-h-screen bg-[#f9f5e9]" />;
}