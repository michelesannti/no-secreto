"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PerfilPage() {
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("nome, apelido")
        .eq("id", user.id)
        .single();

      if (profile) {
        setNome(profile.nome || "");
        setApelido(profile.apelido || "");
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        nome,
        apelido,
      })
      .eq("id", user.id);

    if (error) {
      setMessage("Erro ao salvar.");
    } else {
      setMessage("Perfil atualizado com sucesso 🤎");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Meu Perfil</h1>

      <label className="block mb-2 text-sm">Seu nome</label>
      <input
        className="w-full border p-2 mb-4"
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <label className="block mb-2 text-sm">
        Como você gosta de ser chamada? (opcional)
      </label>
      <input
        className="w-full border p-2 mb-4"
        type="text"
        value={apelido}
        onChange={(e) => setApelido(e.target.value)}
      />

      <button
        className="w-full bg-[#3e3a36] text-white p-2"
        onClick={handleSave}
      >
        Salvar
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}