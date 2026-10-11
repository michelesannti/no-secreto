import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    // 1. Busca usuárias do Supabase
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, nome, email, instagram, creator, ativo, acesso, creator_origem");

    if (profilesError) throw profilesError;

    // 2. Busca todo o progresso de estudos
    const { data: progresso, error: progressoError } = await supabase
      .from("progresso")
      .select("user_id, created_at, data_local");

    if (progressoError) throw progressoError;

    // 3. Busca publicações de conteúdos
    const { data: conteudos, error: conteudosError } = await supabase
      .from("conteudos")
      .select("creator_id");

    if (conteudosError) throw conteudosError;

    const creatorsAtivasIds = new Set((conteudos || []).map((c) => c.creator_id));

    // 4. Usuárias válidas (ativas e excluindo conta de teste)
    const usuariasValidas = (profiles || []).filter(
      (p) => p.ativo === true && p.email !== "miisantos55@gmail.com"
    );

    // Ativação Afiliadas: Total de UUIDs/Strings distintos de creators com vendas geradas
    const creatorsComVendasSet = new Set(
      usuariasValidas
        .map((p) => (p.creator_origem ? String(p.creator_origem).trim() : ""))
        .filter((origem) => origem !== "")
    );

    const ativacaoAfiliadasCount = creatorsComVendasSet.size;

    // 5. Mapeamento de usuárias com estudos e datas
    const usuariasDetalhes = usuariasValidas.map((p) => {
      const estudos = (progresso || []).filter((pr) => pr.user_id === p.id);

      const estudosOrdenados = [...estudos].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      const primeiroEstudoObj = estudosOrdenados.length > 0 ? estudosOrdenados[0] : null;
      const ultimoEstudoObj = estudosOrdenados.length > 0 ? estudosOrdenados[estudosOrdenados.length - 1] : null;

      const primeiroEstudo = primeiroEstudoObj ? (primeiroEstudoObj.data_local || primeiroEstudoObj.created_at) : null;
      const ultimoEstudo = ultimoEstudoObj ? (ultimoEstudoObj.data_local || ultimoEstudoObj.created_at) : null;

      return {
        ...p,
        estudos_concluidos: estudos.length,
        primeiro_estudo: primeiroEstudo,
        ultimo_estudo: ultimoEstudo,
      };
    });

    return NextResponse.json({
      creatorsAtivasCount: creatorsAtivasIds.size,
      ativacaoAfiliadasCount,
      usuariasDetalhes,
      supabase: {
        estudosConcluidos: progresso?.length || 0,
        conteudosPublicados: conteudos?.length || 0,
      },
      cakto: {
        vendas: 0,
        vendasAbandonadas: 0,
        vendasAfiliadas: ativacaoAfiliadasCount,
      },
    });
  } catch (error: any) {
    console.error("Erro na API de relatórios:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}