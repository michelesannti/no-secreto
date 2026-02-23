"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export default function PerfilPage() {
  const supabase = getSupabaseClient();

  const [nome, setNome] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setNome(user.email ?? "");
      }
    }

    carregarPerfil();
  }, [supabase]);

  return (
    <div>
      <h1>Perfil</h1>
      <p>Email: {nome}</p>
    </div>
  );
}