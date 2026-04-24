"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

function DiarioContent() {
  const router = useRouter();

  const [texto, setTexto] = useState("");
  const [destaque, setDestaque] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [estudoId, setEstudoId] = useState<number | null>(null);
  const [jornada, setJornada] = useState("");
  const [jornadaNome, setJornadaNome] = useState("");

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [podeFinalizar, setPodeFinalizar] = useState(false);

  const [finalizou, setFinalizou] = useState(false);

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
        .order("jornada_ordem", { ascending: true })
        .order("ordem", { ascending: true });

      const { data: progresso } = await supabase
        .from("progresso")
        .select("estudo_id")
        .eq("user_id", user.id);

      const concluidosIds =
        progresso?.map((p) => p.estudo_id) || [];

      const estudoAtual =
        estudos?.find((e) => !concluidosIds.includes(e.id)) ||
        estudos?.[estudos.length - 1];

      if (!estudoAtual) return;

      setEstudoId(estudoAtual.id);
      setDestaque(estudoAtual.destaque);
      setJornada(estudoAtual.jornada);
      setJornadaNome(estudoAtual.jornada_exibicao);

      const liberado =
        localStorage.getItem(
          `liberado-finalizar-${estudoAtual.id}`
        ) === "true";

      setPodeFinalizar(liberado);

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

    // salva diário
    await supabase.from("diario").upsert({
      user_id: userId,
      estudo_id: estudoId,
      destaque,
      texto,
    });

    // salva progresso (conclusão real)
    await supabase.from("progresso").upsert({
      user_id: userId,
      estudo_id: estudoId,
    });

    // limpa estado local
    localStorage.removeItem(
      `liberado-finalizar-${estudoId}`
    );
    localStorage.removeItem(
      `diario-${userId}-${estudoId}`
    );

    // verifica se finalizou jornada
    const { data: estudosJornada } = await supabase
      .from("estudos")
      .select("id")
      .eq("jornada", jornada);

    const { data: progresso } = await supabase
      .from("progresso")
      .select("estudo_id")
      .eq("user_id", userId);

    const concluidosIds =
      progresso?.map((p) => p.estudo_id) || [];

    const todosIds =
      estudosJornada?.map((e) => e.id) || [];

    const finalizouJornada =
      todosIds.every((id) =>
        concluidosIds.includes(id)
      );

    if (finalizouJornada) {

      // 💣 VIBRAÇÃO SUTIL (PREMIUM)
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(10);
      }

      setFinalizou(true);

      setTimeout(() => {
        router.push("/perfil");
      }, 2000);

      return;
    }

    router.push("/perfil");
  }

  if (!ready)
    return <div className="min-h-screen bg-[#f9f5e9]" />;

  return (
    <>
      <div className="min-h-screen bg-[#f9f5e9] text-[#70412d]">
        <div className="pt-6 pb-40">

          <div className="px-8 mb-12">
            <h1 className="text-xl font-serif tracking-wide">Diário</h1>
            <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
          </div>

          <div className="max-w-2xl mx-auto px-8">

            {/* destaque */}
            <div className="flex justify-center mt-16 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-[2px] h-8 bg-[#e9d5bb]" />

                <div className="text-center font-serif text-lg font-semibold">
                  {destaque.split("\n").map((linha, i) => (
                    <div key={i} style={{ whiteSpace: "nowrap" }}>
                      {linha}
                    </div>
                  ))}
                </div>

                <div className="w-[2px] h-8 bg-[#e9d5bb]" />
              </div>
            </div>

            {/* textarea */}
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
                style={{ lineHeight: "32px", minHeight: "600px" }}
              />
            </div>

            {/* botão finalizar */}
            {podeFinalizar && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={handleFinalizar}
                  disabled={saving}
                  className="
                    px-6 py-2 rounded-full
                    bg-[#70412d] text-[#f9f5e9]
                    text-sm tracking-wide
                    transition hover:opacity-90
                  "
                >
                  {saving ? "Finalizando..." : "Finalizar"}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 💣 MOMENTO PREMIUM */}
      {finalizou && (
        <div className="fixed inset-0 bg-[#f9f5e9] flex items-center justify-center z-50">
          <div className="text-center space-y-4 animate-fadeUp">
            <p className="text-2xl font-serif text-[#70412d]">
              {jornadaNome} concluído
            </p>
            <div className="w-16 h-[2px] bg-[#C6A46A] mx-auto opacity-70"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default function DiarioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f9f5e9]" />}>
      <DiarioContent />
    </Suspense>
  );
}