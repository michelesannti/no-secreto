import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

function mapearEOrdenarPerfisNoPeriodo(
  perfis: any[],
  todosProgressos: any[],
  todosDiarios: any[],
  dataInicioIso: string,
  dataFimIso: string
) {
  let totalEstudosPeriodo = 0;

  const lista = perfis.map((perfil: any) => {
    const userProgressosPeriodo = todosProgressos.filter(
      (p: any) =>
        p.user_id === perfil.id &&
        p.data_local &&
        p.data_local >= dataInicioIso &&
        p.data_local <= dataFimIso
    );

    const userDiariosPeriodo = todosDiarios.filter(
      (d: any) =>
        d.user_id === perfil.id &&
        d.data_local &&
        d.data_local >= dataInicioIso &&
        d.data_local <= dataFimIso &&
        d.texto &&
        d.texto.trim() !== ""
    );

    const estudosUnicosPeriodo = new Set(userProgressosPeriodo.map((p: any) => p.estudo_id)).size;
    totalEstudosPeriodo += estudosUnicosPeriodo;

    // Descobrir a data do último estudo concluído no período
    let ultimoEstudoData: string | null = null;
    if (userProgressosPeriodo.length > 0) {
      const datasOrdenadas = userProgressosPeriodo
        .map((p: any) => p.data_local)
        .filter(Boolean)
        .sort((a: string, b: string) => b.localeCompare(a)); // Mais recente primeiro
      
      if (datasOrdenadas.length > 0) {
        ultimoEstudoData = datasOrdenadas[0]; // Formato YYYY-MM-DD
      }
    }

    return {
      nome: perfil.nome || "Sem Nome",
      instagram: perfil.instagram || "",
      email: perfil.email || "",
      estudosConcluidos: estudosUnicosPeriodo,
      diariosRegistrados: userDiariosPeriodo.length,
      ultimoEstudo: ultimoEstudoData,
    };
  });

  lista.sort((a, b) => {
    if (b.estudosConcluidos !== a.estudosConcluidos) {
      return b.estudosConcluidos - a.estudosConcluidos;
    }
    return b.diariosRegistrados - a.diariosRegistrados;
  });

  return { lista, totalEstudos: totalEstudosPeriodo };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tipo = searchParams.get("tipo") || "semanal";
    const inicioParam = searchParams.get("inicio");
    const fimParam = searchParams.get("fim");

    const agora = new Date();
    let dataInicio: Date;
    let dataFim: Date = new Date();

    if (inicioParam && fimParam) {
      dataInicio = new Date(`${inicioParam}T00:00:00Z`);
      const dataFimSolicitada = new Date(`${fimParam}T23:59:59Z`);
      dataFim = dataFimSolicitada > agora ? agora : dataFimSolicitada;
    } else {
      let diasAtras = 7;
      if (tipo === "quinzenal") diasAtras = 14;
      if (tipo === "mensal") diasAtras = 30;

      dataInicio = new Date();
      dataInicio.setDate(agora.getDate() - diasAtras);
      dataFim = agora;
    }

    const dataInicioIso = dataInicio.toISOString().split("T")[0];
    const dataFimIso = dataFim.toISOString().split("T")[0];

    const since = Math.floor(dataInicio.getTime() / 1000);
    const until = Math.floor(dataFim.getTime() / 1000);

    const supabase = getSupabaseAdminClient();

    let igToken = process.env.FACEBOOK_USER_ACCESS_TOKEN;
    try {
      const { data: configData } = await supabase
        .from("system_config")
        .select("value")
        .eq("key", "FACEBOOK_USER_ACCESS_TOKEN")
        .maybeSingle();

      if (configData?.value) {
        igToken = configData.value;
      }
    } catch (errConfig) {
      console.warn("Aviso: Não foi possível ler token do Supabase, utilizando fallback de env:", errConfig);
    }

    const { count: conteudosCount } = await supabase
      .from("conteudos")
      .select("*", { count: "exact", head: true })
      .gte("data_local", dataInicioIso)
      .lte("data_local", dataFimIso);

    const [resCreators, resClientes, resProgresso, resDiarios] = await Promise.all([
      supabase.from("profiles").select("id, nome, instagram, email").eq("creator", true),
      supabase.from("profiles").select("id, nome, instagram, email").eq("acesso", "PAGO"),
      supabase.from("progresso").select("user_id, estudo_id, data_local"),
      supabase.from("diario").select("user_id, id, texto, data_local"),
    ]);

    const creators = resCreators.data || [];
    const clientes = resClientes.data || [];
    const todosProgressos = resProgresso.data || [];
    const todosDiarios = resDiarios.data || [];

    const { lista: relatorioCreators, totalEstudos: totalEstudosCreators } = mapearEOrdenarPerfisNoPeriodo(
      creators,
      todosProgressos,
      todosDiarios,
      dataInicioIso,
      dataFimIso
    );

    const { lista: relatorioClientes, totalEstudos: totalEstudosClientes } = mapearEOrdenarPerfisNoPeriodo(
      clientes,
      todosProgressos,
      todosDiarios,
      dataInicioIso,
      dataFimIso
    );

    let instagramData = {
      seguidores: 0,
      visitasPerfil: 0,
      cliquesBio: 0,
    };

    const actorId = process.env.INSTAGRAM_ACTOR_ID;
    const targetUsername = process.env.INSTAGRAM_TARGET_USERNAME;

    if (actorId && targetUsername && igToken) {
      try {
        const urlDiscovery = `https://graph.facebook.com/v26.0/${actorId}?fields=business_discovery.username(${targetUsername}){followers_count,media_count,username}&access_token=${igToken}`;
        const urlInsights = `https://graph.facebook.com/v26.0/${actorId}/insights?metric=profile_views,website_clicks&period=day&metric_type=total_value&since=${since}&until=${until}&access_token=${igToken}`;

        const [resDiscovery, resInsights] = await Promise.all([
          fetch(urlDiscovery, { cache: "no-store" }),
          fetch(urlInsights, { cache: "no-store" }),
        ]);

        if (resDiscovery.ok) {
          const jsonDiscovery = await resDiscovery.json();
          if (jsonDiscovery.business_discovery) {
            instagramData.seguidores = jsonDiscovery.business_discovery.followers_count || 0;
          }
        }

        if (resInsights.ok) {
          const jsonInsights = await resInsights.json();
          if (Array.isArray(jsonInsights.data)) {
            jsonInsights.data.forEach((metric: any) => {
              let totalPeriodo = 0;
              if (Array.isArray(metric.values)) {
                totalPeriodo = metric.values.reduce((acc: number, item: any) => acc + (item.value || 0), 0);
              } else if (metric.total_value?.value) {
                totalPeriodo = metric.total_value.value;
              }

              if (metric.name === "profile_views") {
                instagramData.visitasPerfil = totalPeriodo;
              }
              if (metric.name === "website_clicks") {
                instagramData.cliquesBio = totalPeriodo;
              }
            });
          }
        }
      } catch (errIg) {
        console.error("Erro na consulta da Meta Graph API:", errIg);
      }
    }

    return NextResponse.json({
      tipoRelatorio: tipo,
      intervaloExato: {
        inicio: dataInicioIso,
        fim: dataFimIso,
      },
      instagram: instagramData,
      tiktok: { seguidores: "", visitasPerfil: "" },
      supabase: {
        estudosConcluidos: totalEstudosCreators + totalEstudosClientes,
        conteudosPublicados: conteudosCount || 0,
        detalheCreators: relatorioCreators,
        detalheClientes: relatorioClientes,
      },
      cakto: {
        vendas: 0,
        vendasAbandonadas: 0,
        vendasAfiliadas: 0,
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