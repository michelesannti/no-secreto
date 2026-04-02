"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase";

interface Estudo {
  id: number;
  livro: string;
  capitulo: number;
  versiculo_inicio: number;
  versiculo_fim: number;
  frase: string;
  jornada: string;
  ordem: number;
}

interface DiarioSalvo {
  id: string;
  versiculo: string;
  destaque: string;
  texto: string;
}

export default function DiarioPage() {
  const [referencia, setReferencia] = useState("");
  const [destaque, setDestaque] = useState("");
  const [texto, setTexto] = useState("");
  const [editando, setEditando] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [estudoAtual, setEstudoAtual] = useState<Estudo | null>(null);
  const [diarioId, setDiarioId] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDiario() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const jornadaAtual = "genesis-1";

      // estudos da jornada atual
      const { data: estudos, error: estudosError } = await supabase
        .from("estudos")
        .select("*")
        .eq("jornada", jornadaAtual)
        .order("ordem", { ascending: true });

      if (estudosError || !estudos || estudos.length === 0) {
        setLoading(false);
        return;
      }

      // progresso real da usuária
      const { data: progresso, error: progressoError } = await supabase
        .from("progresso")
        .select("estudo_id")
        .eq("user_id", user.id)
        .eq("concluido", true);

      if (progressoError) {
        setLoading(false);
        return;
      }

      const concluidosIds = progresso?.map((item) => item.estudo_id) || [];

      // estudo atual = primeiro não concluído
      const estudoEmAndamento =
        estudos.find((estudo) => !concluidosIds.includes(estudo.id)) ||
        estudos[estudos.length - 1];

      if (!estudoEmAndamento) {
        setLoading(false);
        return;
      }

      setEstudoAtual(estudoEmAndamento);

      const inicio = estudoEmAndamento.versiculo_inicio;
      const fim = estudoEmAndamento.versiculo_fim;

      const referenciaMontada =
        inicio && fim && inicio !== fim
          ? `${estudoEmAndamento.livro} ${estudoEmAndamento.capitulo}:${inicio}-${fim}`
          : `${estudoEmAndamento.livro} ${estudoEmAndamento.capitulo}:${inicio ?? ""}`;

      setReferencia(referenciaMontada.trim());

      // 1. tenta carregar diário salvo no banco
      const { data: diarioSalvo, error: diarioError } = await supabase
        .from("diario")
        .select("id, versiculo, destaque, texto")
        .eq("user_id", user.id)
        .eq("estudo_id", estudoEmAndamento.id)
        .maybeSingle<DiarioSalvo>();

      if (!diarioError && diarioSalvo) {
        setDiarioId(diarioSalvo.id);
        setDestaque(diarioSalvo.destaque || estudoEmAndamento.frase || "");
        setTexto(diarioSalvo.texto || "");
        setLoading(false);
        return;
      }

      // 2. se não tem salvo, tenta carregar rascunho local
      const draftKey = `diario-draft-${user.id}-${estudoEmAndamento.id}`;
      const draft = localStorage.getItem(draftKey);

      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setDestaque(parsed.destaque || estudoEmAndamento.frase || "");
          setTexto(parsed.texto || "");
        } catch {
          setDestaque(estudoEmAndamento.frase || "");
          setTexto("");
        }
      } else {
        // 3. se não tem nada, usa o estudo atual como base
        setDestaque(estudoEmAndamento.frase || "");
        setTexto("");
      }

      setLoading(false);
    }

    carregarDiario();
  }, []);

  // salva rascunho automático local enquanto escreve
  useEffect(() => {
    if (!userId || !estudoAtual || loading) return;

    const draftKey = `diario-draft-${userId}-${estudoAtual.id}`;

    localStorage.setItem(
      draftKey,
      JSON.stringify({
        destaque,
        texto,
      })
    );
  }, [destaque, texto, userId, estudoAtual, loading]);

  async function handleSalvar() {
    if (!userId || !estudoAtual) return;

    setSaving(true);

    const supabase = getSupabaseClient();

    const payload = {
      user_id: userId,
      estudo_id: estudoAtual.id,
      versiculo: referencia, // aqui estamos usando a coluna versiculo como referência
      destaque,
      texto,
    };

    let error = null;
    let data = null;

    if (diarioId) {
      const response = await supabase
        .from("diario")
        .update(payload)
        .eq("id", diarioId)
        .select("id")
        .single();

      error = response.error;
      data = response.data;
    } else {
      const response = await supabase
        .from("diario")
        .insert(payload)
        .select("id")
        .single();

      error = response.error;
      data = response.data;
    }

    if (!error && data?.id) {
      setDiarioId(data.id);

      const draftKey = `diario-draft-${userId}-${estudoAtual.id}`;
      localStorage.removeItem(draftKey);

      setEditando(false);
    }

    setSaving(false);
  }

  function formatarTexto(texto: string) {
    let formatado = texto
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~(.*?)~/g, "<s>$1</s>");

    return formatado.replace(/\n/g, "<br/>");
  }

  if (loading) {
    return <div className="h-[100dvh] overflow-hidden bg-[#f9f5e9]" />;
  }

  return (
    <div className="h-[100dvh] overflow-y-auto bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          Diário
        </h1>

        <div className="w-10 h-[2px] bg-[#C6A46A]/60 mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">

        {referencia && (
          <p className="text-sm text-[#70412d]/55 tracking-wide mb-10 text-center">
            {referencia}
          </p>
        )}

        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4 max-w-full">
            <div className="w-[1.5px] h-8 bg-[#e9d5bb] shrink-0"></div>

            <p
              className="font-serif text-xl font-semibold text-center leading-tight"
              dangerouslySetInnerHTML={{
                __html: formatarTexto(destaque),
              }}
            />

            <div className="w-[1.5px] h-8 bg-[#e9d5bb] shrink-0"></div>
          </div>
        </div>

        <div className="relative min-h-[600px] mb-8">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 31px, #e9d5bb 31px, #e9d5bb 32px)",
            }}
          />

          {editando ? (
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="O que Deus falou com você?"
              className="relative w-full bg-transparent resize-none outline-none text-lg placeholder:text-[#70412d]/40"
              style={{
                lineHeight: "32px",
                minHeight: "600px",
              }}
            />
          ) : (
            <div
              className="relative text-lg"
              style={{
                lineHeight: "32px",
                minHeight: "600px",
              }}
              dangerouslySetInnerHTML={{
                __html: formatarTexto(texto),
              }}
            />
          )}
        </div>

        <div className="mt-12 flex justify-center">
          {editando ? (
            <button
              onClick={handleSalvar}
              disabled={saving}
              className="px-6 py-2 rounded-full bg-[#70412d] text-[#f9f5e9] text-sm tracking-wide disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="px-6 py-2 rounded-full border border-[#70412d] text-[#70412d] text-sm tracking-wide"
            >
              Editar
            </button>
          )}
        </div>

      </div>
    </div>
  );
}