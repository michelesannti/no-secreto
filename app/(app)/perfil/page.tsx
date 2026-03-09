"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function PerfilPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function carregarPerfil() {
      const supabase = getSupabaseClient(); // 🔥 só cria aqui dentro

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
    <div>
      <h1>Perfil</h1>
      <p>Email: {email ?? "Carregando..."}</p>
    </div>
  );
}