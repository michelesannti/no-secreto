"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function DiarioPage() {
  const router = useRouter();

  const [texto, setTexto] = useState("");
  const [destaque, setDestaque] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [estudoId, setEstudoId] = useState<number | null>(null);

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [podeFinalizar, setPodeFinalizar] = useState(false);

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
        .select("estudo_id, concluido")
        .eq("user_id", user.id);

      const concluidosIds =
        progresso?.filter((p) => p.concluido).map((p) => p.estudo_id) || [];

      const estudoAtual =
        estudos?.find((e) => !concluidosIds.includes(e.id)) ||
        estudos?.[estudos.length - 1];

      if (!estudoAtual) return;

      setEstudoId(estudoAtual.id);
      setDestaque(estudoAtual.destaque);

      const concluido = progresso?.find(
        (p) => p.estudo_id === estudoAtual.id && p.concluido
      );

      setPodeFinalizar(!!concluido);

      const draftKey = `diario-${user.id}-${estudoAtual.id}`;
      const draft = localStorage.getItem(draftKey);

      if (draft) setTexto(draft);

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
    });

    localStorage.removeItem(`diario-${userId}-${estudoId}`);

    router.push("/conclusao");
  }

  if (!ready) return <div className="min-h-screen bg-[#f9f5e9]" />;

  const linhas = destaque.split("\n");

  return (
    <div className="min-h-screen bg-[#f9f5e9] text-[#70412d]">

      <div className="pt-6 pb-40">

        {/* TOPO */}
        <div className="px-8 mb-12">
          <h1 className="text-xl font-serif tracking-wide">
            Diário
          </h1>
          <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
        </div>

        <div className="max-w-2xl mx-auto px-8">

          {/* DESTAQUE FINAL CORRETO */}
          <div className="flex justify-center mt-16 mb-10">
            <div className="flex items-center gap-4">

              <div className="w-[2px] h-8 bg-[#e9d5bb]"></div>

              <div className="text-center font-serif text-lg font-semibold">
                {linhas.map((linha, i) => (
                  <div
                    key={i}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {linha}
                  </div>
                ))}
              </div>

              <div className="w-[2px] h-8 bg-[#e9d5bb]"></div>

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
              className="relative w-full bg-transparent resize-none outline-none text-base placeholder:text-[#70412d]/40"
              style={{
                lineHeight: "32px",
                minHeight: "600px"
              }}
            />

          </div>

          {/* BOTÃO */}
          {podeFinalizar && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleFinalizar}
                disabled={saving}
                className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9]"
              >
                {saving ? "Finalizando..." : "Finalizar"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}