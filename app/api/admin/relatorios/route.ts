import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    // 1. Busca usuárias do Supabase (buscando data_local)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, nome, email, instagram, creator, ativo, acesso, creator_origem, data_local");

    if (profilesError) throw profilesError;

    // 2. Busca todo o progresso de estudos (buscando data_local)
    const { data: progresso, error: progressoError } = await supabase
      .from("progresso")
      .select("user_id, data_local");

    if (progressoError) throw progressoError;

    // 3. Busca publicações de conteúdos
    const { data: conteudos, error: conteudosError } = await supabase
      .from("conteudos")
      .select("creator_id");

    if (conteudosError) throw conteudosError;

    // Mapa de perfis para validação rápida
    const profilesMap = new Map((profiles || []).map((p) => [p.id, p]));

    // Creators que publicaram posts E continuam com creator = true e ativo = true
    const creatorsAtivasIds = new Set(
      (conteudos || [])
        .map((c) => c.creator_id)
        .filter((id) => {
          const perfil = profilesMap.get(id);
          return perfil && perfil.creator === true && perfil.ativo === true;
        })
    );

    // 4. Usuárias válidas (ativas e excluindo conta de teste)
    const usuariasValidas = (profiles || []).filter(
      (p) => p.ativo === true && p.email !== "miisantos55@gmail.com"
    );

    // Ativação Afiliadas
    const creatorsComVendasSet = new Set(
      usuariasValidas
        .map((p) => (p.creator_origem ? String(p.creator_origem).trim() : ""))
        .filter((origem) => {
          if (!origem) return false;
          const perfilAfiliada = profilesMap.get(origem);
          return Boolean(perfilAfiliada && perfilAfiliada.creator === true && perfilAfiliada.ativo === true);
        })
    );

    const ativacaoAfiliadasCount = creatorsComVendasSet.size;

    // Helper para extrair data YYYY-MM-DD mantendo a string de data_local
    const extrairDataApenas = (valor: Date | string | null) => {
      if (!valor) return "";
      if (typeof valor === "string") {
        return valor.split("T")[0].split(" ")[0];
      }
      const ano = valor.getFullYear();
      const mes = String(valor.getMonth() + 1).padStart(2, "0");
      const dia = String(valor.getDate()).padStart(2, "0");
      return `${ano}-${mes}-${dia}`;
    };

    // 5. Mapeamento de usuárias com estudos e último estudo (estritamente data_local)
    const usuariasDetalhes = usuariasValidas.map((p) => {
      const estudos = (progresso || []).filter((pr) => pr.user_id === p.id);

      const estudosOrdenados = [...estudos].sort((a, b) => {
        const da = extrairDataApenas(a.data_local);
        const db = extrairDataApenas(b.data_local);
        return da.localeCompare(db);
      });

      const ultimoEstudoObj = estudosOrdenados.length > 0 ? estudosOrdenados[estudosOrdenados.length - 1] : null;

      return {
        ...p,
        estudos_concluidos: estudos.length,
        ultimo_estudo: ultimoEstudoObj ? ultimoEstudoObj.data_local : null,
      };
    });

    // 6. Cálculo histórico utilizando estritamente data_local
    const hoje = new Date();
    const historicoSemanas = [];

    for (let i = 3; i >= 0; i--) {
      const fimSemanaObj = new Date(hoje);
      fimSemanaObj.setDate(hoje.getDate() - i * 7);
      
      const inicioSemanaObj = new Date(fimSemanaObj);
      inicioSemanaObj.setDate(fimSemanaObj.getDate() - 7);

      const inicioIso = extrairDataApenas(inicioSemanaObj);
      const fimIso = extrairDataApenas(fimSemanaObj);

      const formatarDdMm = (d: Date) => {
        const dia = String(d.getDate()).padStart(2, "0");
        const mes = String(d.getMonth() + 1).padStart(2, "0");
        return `${dia}/${mes}`;
      };

      const textoSemana = `${formatarDdMm(inicioSemanaObj)} - ${formatarDdMm(fimSemanaObj)}`;

      // Filtra estudos na semana usando puramente a data_local
      const estudosNaSemana = (progresso || []).filter((pr) => {
        const userValida = usuariasValidas.some((u) => u.id === pr.user_id);
        if (!userValida) return false;

        const dataEstudoStr = extrairDataApenas(pr.data_local);
        return Boolean(dataEstudoStr) && dataEstudoStr >= inicioIso && dataEstudoStr < fimIso;
      });

      const totalEstudos = estudosNaSemana.length;
      const usuariasAtivasNaSemana = new Set(estudosNaSemana.map((pr) => pr.user_id)).size;

      // Usuárias ativas cadastradas ATÉ O FIM desta semana específica (usando data_local do perfil)
      const usuariasAtivasNoPeriodo = usuariasValidas.filter((p) => {
        const dataCadastroStr = extrairDataApenas(p.data_local);
        return Boolean(dataCadastroStr) && dataCadastroStr < fimIso;
      }).length || 1;

      const metaTotalSemanaComunidade = usuariasAtivasNoPeriodo * 7;
      const engajamentoPct = Math.round((totalEstudos / metaTotalSemanaComunidade) * 100);

      historicoSemanas.push({
        semana: textoSemana,
        totalEstudos,
        usuariasAtivasNaSemana,
        engajamentoPct,
      });
    }

    return NextResponse.json({
      creatorsAtivasCount: creatorsAtivasIds.size,
      ativacaoAfiliadasCount,
      usuariasDetalhes,
      historicoSemanas,
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
    console.error("Erro na API de relatorios:", error);
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