import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1. Total geral de estudos concluídos na tabela progresso
    const [{ count: estudosConcluidosTotal }] = await Promise.all([
      supabaseAdmin.from("progresso").select("*", { count: "exact", head: true }),
    ]);

    // 2. Perfis ativos que sejam clientes pagantes (acesso = PAGO) ou creators (creator = TRUE)
    const { data: profiles, error: errProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id, nome, instagram, email, creator, acesso, created_at")
      .eq("ativo", true)
      .or("acesso.eq.PAGO,creator.eq.true");

    if (errProfiles) {
      throw new Error("Erro ao buscar perfis ativos no banco.");
    }

    const validUserIds = (profiles || []).map((p) => p.id);

    // 3. Busca o progresso de todas as usuárias válidas, ordenado do mais recente para o mais antigo
    const { data: progressoList } = await supabaseAdmin
      .from("progresso")
      .select("user_id, estudo_id, data_local")
      .in("user_id", validUserIds.length > 0 ? validUserIds : ["00000000-0000-0000-0000-000000000000"])
      .order("data_local", { ascending: false });

    // 4. Mapeia e filtra apenas quem tem estudos concluídos (> 0)
    const usuariasDetalhes = (profiles || [])
      .map((p) => {
        const userProgresso = (progressoList || []).filter((pr) => pr.user_id === p.id);
        const estudosUnicos = Array.from(new Set(userProgresso.map((pr) => pr.estudo_id)));

        const primeiroEstudoReg = userProgresso[userProgresso.length - 1];
        const ultimoEstudoReg = userProgresso[0];

        return {
          id: p.id,
          nome: p.nome || "Usuária",
          instagram: p.instagram || "",
          email: p.email || "",
          creator: p.creator || false,
          acesso: p.acesso,
          data_entrada: p.created_at,
          estudos_concluidos: estudosUnicos.length,
          primeiro_estudo: primeiroEstudoReg ? primeiroEstudoReg.data_local : null,
          ultimo_estudo: ultimoEstudoReg ? ultimoEstudoReg.data_local : null,
        };
      })
      .filter((u) => u.estudos_concluidos > 0);

    // 5. Ordenação ESTRATÉGICA com Foco Comercial:
    // 1º Clientes Pagantes (acesso === 'PAGO') vêm ANTES das Creators (creator === true)
    // 2º Dentro do mesmo grupo, quem estudou mais recentemente (data_local desc)
    // 3º Desempate por quantidade de estudos
    usuariasDetalhes.sort((a, b) => {
      const isPaganteA = a.acesso === "PAGO";
      const isPaganteB = b.acesso === "PAGO";

      if (isPaganteA && !isPaganteB) return -1;
      if (!isPaganteA && isPaganteB) return 1;

      const dataA = a.ultimo_estudo || "";
      const dataB = b.ultimo_estudo || "";
      if (dataA !== dataB) {
        return dataB.localeCompare(dataA);
      }

      return b.estudos_concluidos - a.estudos_concluidos;
    });

    return NextResponse.json({
      supabase: {
        estudosConcluidos: estudosConcluidosTotal || 0,
        conteudosPublicados: 0,
      },
      cakto: { vendas: "", vendasAbandonadas: "", vendasAfiliadas: "" },
      instagram: { seguidores: "", visitasPerfil: "", cliquesBio: "" },
      tiktok: { seguidores: "", visitasPerfil: "" },
      whatsapp: {},
      usuariasDetalhes,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    return NextResponse.json({ message: "Relatório salvo com sucesso!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}