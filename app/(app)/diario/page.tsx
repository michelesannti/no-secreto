"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function DiarioPage() {
  const router = useRouter();

  const [texto, setTexto] = useState("");
  const [destaque, setDestaque] = useState("");
  const [referencia, setReferencia] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [estudoId, setEstudoId] = useState<number | null>(null);

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function carregar() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { data: estudos } = await supabase
        .from("estudos")
        .select("*")
        .eq("jornada", "genesis-1")
        .order("ordem", { ascending: true });

      const { data: progresso } = await supabase
        .from("progresso")
        .select("estudo_id")
        .eq("user_id", user.id)
        .eq("concluido", true);

      const concluidosIds = progresso?.map((p) => p.estudo_id) || [];

      const estudoAtual =
        estudos?.find((e) => !concluidosIds.includes(e.id)) ||
        estudos?.[estudos.length - 1];

      if (!estudoAtual) return;

      setEstudoId(estudoAtual.id);
      setDestaque(estudoAtual.frase);

      const ref =
        estudoAtual.versiculo_inicio !== estudoAtual.versiculo_fim
          ? `${estudoAtual.livro} ${estudoAtual.capitulo}:${estudoAtual.versiculo_inicio}-${estudoAtual.versiculo_fim}`
          : `${estudoAtual.livro} ${estudoAtual.capitulo}:${estudoAtual.versiculo_inicio}`;

      setReferencia(ref);

      const draftKey = `diario-${user.id}-${estudoAtual.id}`;
      const draft = localStorage.getItem(draftKey);

      if (draft) setTexto(draft);

      // 👉 só libera render quando tudo estiver pronto
      setReady(true);
    }

    carregar();
  }, []);

  useEffect(() => {
    if (!userId || !estudoId) return;
    localStorage.setItem(`diario-${userId}-${estudoId}`, texto);
  }, [texto, userId, estudoId]);

  async function handleFinalizar() {
    if (!userId || !estudoId) return;

    setSaving(true);

    const supabase = getSupabaseClient();

    await supabase.from("diario").upsert({
      user_id: userId,
      estudo_id: estudoId,
      destaque,
      texto,
      versiculo: referencia,
    });

    await supabase.from("progresso").upsert({
      user_id: userId,
      estudo_id: estudoId,
      concluido: true,
    });

    localStorage.removeItem(`diario-${userId}-${estudoId}`);

    router.push("/conclusao");
  }

  // 🔥 evita render quebrado
  if (!ready) {
    return <div className="min-h-screen bg-[#f9f5e9]" />;
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] text-[#70412d] overflow-y-auto">

      <div className="pt-6 pb-40">

        {/* TOPO */}
        <div className="px-8 mb-12">
          <h1 className="text-xl font-serif tracking-wide">
            Diário
          </h1>

          <div className="w-10 h-[2px] bg-[#C6A46A]/60 mt-2"></div>
        </div>

        <div className="max-w-2xl mx-auto px-8">

          {/* REFERÊNCIA */}
          <p className="text-sm text-[#70412d]/60 text-center mb-10">
            {referencia}
          </p>

          {/* DESTAQUE */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">

              <div className="w-[2px] h-8 bg-[#C6A46A]/60"></div>

              <p
                className="font-serif text-xl font-semibold text-center leading-snug max-w-[32ch]"
                style={{ textWrap: "balance" }}
              >
                {destaque}
              </p>

              <div className="w-[2px] h-8 bg-[#C6A46A]/60"></div>

            </div>
          </div>

          {/* TEXTO */}
          <div className="relative min-h-[600px] mb-8">

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 31px, #e9d5bb 31px, #e9d5bb 32px)",
              }}
            />

            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="O que Deus falou com você?"
              className="relative w-full bg-transparent resize-none outline-none text-lg placeholder:text-[#70412d]/40"
              style={{
                lineHeight: "32px",
                minHeight: "600px"
              }}
            />

          </div>

          {/* BOTÃO */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleFinalizar}
              disabled={saving}
              className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]"
            >
              {saving ? "Finalizando..." : "Finalizar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}