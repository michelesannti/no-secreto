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

    let ultimoEstudoData: string | null = null;
    if (userProgressosPeriodo.length > 0) {
      const datasOrdenadas = userProgressosPeriodo
        .map((p: any) => p.data_local)
        .filter(Boolean)
        .sort((a: string, b: string) => b.localeCompare(a));

      if (datasOrdenadas.length > 0) {
        ultimoEstudoData = datasOrdenadas[0];
      }
    }

    return {
      nome: perfil.nome || "Sem Nome",
      instagram: perfil.instagram || "",
      email: perfil.email || "",
      dataCadastro: perfil.data_local || "",
      estudosConcluidos: estudosUnicosPeriodo,
      diariosRegistrados: userDiariosPeriodo.length,
      ultimoEstudo: ultimoEstudoData,
    };
  });

  lista.sort((a, b) => {
    const dataA = a.ultimoEstudo || "";
    const dataB = b.ultimoEstudo || "";

    // 1º critério: Data do último estudo mais recente primeiro (quem não tem data vai para o final)
    if (dataB !== dataA) {
      return dataB.localeCompare(dataA);
    }

    // 2º critério (desempate): Maior quantidade de estudos concluídos
    if (b.estudosConcluidos !== a.estudosConcluidos) {
      return b.estudosConcluidos - a.estudosConcluidos;
    }

    // 3º critério (desempate): Maior quantidade de diários registrados
    if (b.diariosRegistrados !== a.diariosRegistrados) {
      return b.diariosRegistrados - a.diariosRegistrados;
    }

    // 4º critério (desempate final): Data de cadastro mais recente primeiro
    return b.dataCadastro.localeCompare(a.dataCadastro);
  });

  return { lista, totalEstudos: totalEstudosPeriodo };
}

function mapearEOrdenarConteudosNoPeriodo(
  creators: any[],
  todosConteudos: any[],
  dataInicioIso: string,
  dataFimIso: string
) {
  const lista = creators.map((creator: any) => {
    const conteudosPeriodo = todosConteudos.filter(
      (c: any) =>
        c.creator_id === creator.id &&
        c.data_local &&
        c.data_local >= dataInicioIso &&
        c.data_local <= dataFimIso
    );

    const conteudosTotal = conteudosPeriodo.length;

    const conteudosInstagram = conteudosPeriodo.filter(
      (c: any) => typeof c.link_instagram === "string" && c.link_instagram.trim() !== ""
    ).length;

    let ultimoConteudoData: string | null = null;
    if (conteudosPeriodo.length > 0) {
      const datasOrdenadas = conteudosPeriodo
        .map((c: any) => c.data_local)
        .filter(Boolean)
        .sort((a: string, b: string) => b.localeCompare(a));

      if (datasOrdenadas.length > 0) {
        ultimoConteudoData = datasOrdenadas[0];
      }
    }

    const tiposUnicos = Array.from(
      new Set(
        conteudosPeriodo
          .map((c: any) => (c.tipo_conteudo ? String(c.tipo_conteudo).trim() : ""))
          .filter(Boolean)
      )
    );

    const formatosUnicos = Array.from(
      new Set(
        conteudosPeriodo
          .map((c: any) => (c.formato ? String(c.formato).trim() : ""))
          .filter(Boolean)
      )
    );

    const resumoTiposFormatos = [
      tiposUnicos.length > 0 ? tiposUnicos.join(", ") : "",
      formatosUnicos.length > 0 ? formatosUnicos.join(", ") : "",
    ]
      .filter(Boolean)
      .join(" • ");

    return {
      nome: creator.nome || "Sem Nome",
      instagram: creator.instagram || "",
      email: creator.email || "",
      dataCadastro: creator.data_local || "",
      conteudosTotal,
      conteudosInstagram,
      ultimoConteudo: ultimoConteudoData,
      tiposFormatos: resumoTiposFormatos || "-",
    };
  });

  lista.sort((a, b) => {
    const dataA = a.ultimoConteudo || "";
    const dataB = b.ultimoConteudo || "";

    // 1º critério: Data do último conteúdo publicado mais recente primeiro
    if (dataB !== dataA) {
      return dataB.localeCompare(dataA);
    }

    // 2º critério (desempate): Maior quantidade de conteúdos publicados no período
    if (b.conteudosTotal !== a.conteudosTotal) {
      return b.conteudosTotal - a.conteudosTotal;
    }

    // 3º critério (desempate): Maior quantidade de conteúdos com link do Instagram
    if (b.conteudosInstagram !== a.conteudosInstagram) {
      return b.conteudosInstagram - a.conteudosInstagram;
    }

    // 4º critério (desempate final): Data de cadastro mais recente primeiro
    return b.dataCadastro.localeCompare(a.dataCadastro);
  });

  return lista;
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

    const [resCreators, resClientes, resProgresso, resDiarios, resConteudos] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, nome, instagram, email, data_local")
        .eq("creator", true)
        .lte("data_local", dataFimIso),
      supabase
        .from("profiles")
        .select("id, nome, instagram, email, data_local")
        .eq("acesso", "PAGO")
        .lte("data_local", dataFimIso),
      supabase.from("progresso").select("user_id, estudo_id, data_local"),
      supabase.from("diario").select("user_id, id, texto, data_local"),
      supabase
        .from("conteudos")
        .select("id, creator_id, link_instagram, tipo_conteudo, formato, data_local"),
    ]);

    const creators = resCreators.data || [];
    const clientes = resClientes.data || [];
    const todosProgressos = resProgresso.data || [];
    const todosDiarios = resDiarios.data || [];
    const todosConteudos = resConteudos.data || [];

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

    const detalheConteudosCreators = mapearEOrdenarConteudosNoPeriodo(
      creators,
      todosConteudos,
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
        detalheCreators: relatorioCreators,
        detalheClientes: relatorioClientes,
        detalheConteudosCreators,
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