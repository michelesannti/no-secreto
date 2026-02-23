"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function DiarioPage() {
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMensagens() {
      const supabase = getSupabaseClient(); // 🔥 AGORA AQUI DENTRO

      const { data, error } = await supabase
        .from("diario_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMensagens(data);
      }

      setLoading(false);
    }

    carregarMensagens();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Diário</h1>

      {mensagens.length === 0 && <p>Nenhuma mensagem ainda.</p>}

      {mensagens.map((msg) => (
        <div key={msg.id}>
          <p>{msg.conteudo}</p>
        </div>
      ))}
    </div>
  );
}