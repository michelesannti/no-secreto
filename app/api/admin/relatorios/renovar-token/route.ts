import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

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

    // 1. Busca tokens e configs ativos na tabela system_config (com fallback para .env)
    let igToken = process.env.FACEBOOK_USER_ACCESS_TOKEN;
    let tikTokToken = process.env.TIKTOK_ACCESS_TOKEN;

    try {
      const { data: configData } = await supabase
        .from("system_config")
        .select("key, value")
        .in("key", ["FACEBOOK_USER_ACCESS_TOKEN", "TIKTOK_ACCESS_TOKEN"]);

      if (configData) {
        configData.forEach((item: any) => {
          if (item.key === "FACEBOOK_USER_ACCESS_TOKEN" && item.value) igToken = item.value;
          if (item.key === "TIKTOK_ACCESS_TOKEN" && item.value) tikTokToken = item.value;
        });
      }
    } catch (errConfig) {
      console.warn("Aviso: Não foi possível ler tokens do Supabase:", errConfig);
    }

    // 2. Contagem de conteúdos publicados no período
    const { count: conteudosCount } = await supabase
      .from("conteudos")
      .select("*", { count: "exact", head: true })
      .gte("data_local", dataInicioIso)
      .lte("data_local", dataFimIso);

    // 3. Busca paralela segura: perfis de criadoras, todo o progresso e todos os diários
    const [resCreators, resProgresso, resDiarios] = await Promise.all([
      supabase.from("profiles").select("id, nome, instagram, email, data_local").eq("creator", true),
      supabase.from("progresso").select("user_id, estudo_id, data_local"),
      supabase.from("diario").select("user_id, id, texto, data_local"),
    ]);

    const creators = resCreators.data || [];
    const todosProgressos = resProgresso.data || [];
    const todosDiarios = resDiarios.data || [];

    let totalEstudosPeriodo = 0;
    const relatorioCreators = creators.map((creator: any) => {
      const userProgressos = todosProgressos.filter((p: any) => p.user_id === creator.id);
      const userDiarios = todosDiarios.filter((d: any) => d.user_id === creator.id && d.texto && d.texto.trim() !== "");

      const estudosUnicos = new Set(userProgressos.map((p: any) => p.estudo_id)).size;
      totalEstudosPeriodo += estudosUnicos;

      const datasEstudo = userProgressos.map((p: any) => p.data_local).filter(Boolean).sort();

      return {
        nome: creator.nome || "Sem Nome",
        instagram: creator.instagram || "",
        email: creator.email || "",
        dataEntrada: creator.data_local || "",
        estudosConcluidos: estudosUnicos,
        diariosRegistrados: userDiarios.length,
        primeiroEstudo: datasEstudo[0] || null,
        ultimoEstudo: datasEstudo[datasEstudo.length - 1] || null,
      };
    });

    relatorioCreators.sort((a, b) => {
      if (a.ultimoEstudo && b.ultimoEstudo) {
        if (b.ultimoEstudo !== a.ultimoEstudo) return b.ultimoEstudo.localeCompare(a.ultimoEstudo);
      } else if (a.ultimoEstudo) return -1;
      else if (b.ultimoEstudo) return 1;
      return b.estudosConcluidos - a.estudosConcluidos;
    });

    let instagramData = { seguidores: 0, visitasPerfil: 0, cliquesBio: 0 };
    let tiktokData = { seguidores: 0, visitasPerfil: 0 };

    const actorId = process.env.INSTAGRAM_ACTOR_ID;
    const targetUsername = process.env.INSTAGRAM_TARGET_USERNAME;

    const promisesFetch: Promise<any>[] = [];

    // Chamadas Instagram Graph API
    if (actorId && targetUsername && igToken) {
      const urlDiscovery = `https://graph.facebook.com/v26.0/${actorId}?fields=business_discovery.username(${targetUsername}){followers_count,media_count,username}&access_token=${igToken}`;
      const urlInsights = `https://graph.facebook.com/v26.0/${actorId}/insights?metric=profile_views,website_clicks&period=day&metric_type=total_value&since=${since}&until=${until}&access_token=${igToken}`;

      promisesFetch.push(
        fetch(urlDiscovery, { cache: "no-store" }).then(res => res.json()).catch(() => null),
        fetch(urlInsights, { cache: "no-store" }).then(res => res.json()).catch(() => null)
      );
    } else {
      promisesFetch.push(Promise.resolve(null), Promise.resolve(null));
    }

    // Chamada TikTok Open API (Conta Corporativa)
    if (tikTokToken) {
      const urlTikTok = `https://open.tiktokapis.com/v2/user/info/?fields=follower_count,profile_view_count`;
      promisesFetch.push(
        fetch(urlTikTok, {
          headers: { Authorization: `Bearer ${tikTokToken}` },
          cache: "no-store",
        }).then(res => res.json()).catch(() => null)
      );
    } else {
      promisesFetch.push(Promise.resolve(null));
    }

    const [jsonDiscovery, jsonInsights, jsonTikTok] = await Promise.all(promisesFetch);

    // Processa Instagram
    if (jsonDiscovery?.business_discovery) {
      instagramData.seguidores = jsonDiscovery.business_discovery.followers_count || 0;
    }
    if (Array.isArray(jsonInsights?.data)) {
      jsonInsights.data.forEach((metric: any) => {
        let totalPeriodo = 0;
        if (Array.isArray(metric.values)) {
          totalPeriodo = metric.values.reduce((acc: number, item: any) => acc + (item.value || 0), 0);
        } else if (metric.total_value?.value) {
          totalPeriodo = metric.total_value.value;
        }
        if (metric.name === "profile_views") instagramData.visitasPerfil = totalPeriodo;
        if (metric.name === "website_clicks") instagramData.cliquesBio = totalPeriodo;
      });
    }

    // Processa TikTok
    if (jsonTikTok?.data?.user) {
      tiktokData.seguidores = jsonTikTok.data.user.follower_count || 0;
      tiktokData.visitasPerfil = jsonTikTok.data.user.profile_view_count || 0;
    }

    return NextResponse.json({
      tipoRelatorio: tipo,
      intervaloExato: { inicio: dataInicioIso, fim: dataFimIso },
      instagram: instagramData,
      tiktok: tiktokData,
      supabase: {
        estudosConcluidos: totalEstudosPeriodo,
        conteudosPublicados: conteudosCount || 0,
        detalheCreators: relatorioCreators,
      },
      cakto: { vendas: "", vendasAbandonadas: "", vendasAfiliadas: "" },
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