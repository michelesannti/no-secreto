"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function SecretoPage() {
  const router = useRouter();

  useEffect(() => {
    async function carregarProximoEstudo() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const jornadaAtual = "genesis-1";

      // estudos da jornada atual
      const { data: estudos, error: estudosError } = await supabase
        .from("estudos")
        .select("id, ordem, jornada")
        .eq("jornada", jornadaAtual)
        .order("ordem", { ascending: true });

      if (estudosError || !estudos || estudos.length === 0) {
        router.replace("/hoje");
        return;
      }

      // progresso real da usuária
      const { data: progresso, error: progressoError } = await supabase
        .from("progresso")
        .select("estudo_id")
        .eq("user_id", user.id)
        .eq("concluido", true);

      if (progressoError) {
        router.replace("/hoje");
        return;
      }

      const concluidosIds = progresso?.map((item) => item.estudo_id) || [];

      const proximoEstudo = estudos.find(
        (estudo) => !concluidosIds.includes(estudo.id)
      );

      if (proximoEstudo) {
        router.replace(`/secreto/${proximoEstudo.id}`);
        return;
      }

      // terminou todos da jornada atual
      router.replace("/hoje");
    }

    carregarProximoEstudo();
  }, [router]);

  return <div className="h-[100dvh] overflow-hidden bg-[#f9f5e9]" />;
}