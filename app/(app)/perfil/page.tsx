"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function PerfilPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function carregarPerfil() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email ?? null);
      }
    }

    carregarPerfil();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-10 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="px-8 mb-12">
        <h1 className="text-2xl font-[var(--font-title)] tracking-wide">
          Perfil
        </h1>

        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-3"></div>
      </div>

      <div className="max-w-xl mx-auto px-8">

        {/* CARD PERFIL */}
        <div className="
          bg-white/40
          backdrop-blur
          border border-[#e9d5bb]
          rounded-2xl
          p-8
          shadow-sm
        ">

          {/* EMAIL */}
          <div className="mb-6">
            <p className="text-sm text-[#70412d]/60 mb-1">
              Email
            </p>

            <p className="font-medium">
              {email ?? "Carregando..."}
            </p>
          </div>

          {/* FRASE */}
          <div className="mt-10 text-center">
            <p className="italic text-[#70412d]/70 text-sm">
              O secreto constrói a mulher
              que Deus te chamou para ser.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}