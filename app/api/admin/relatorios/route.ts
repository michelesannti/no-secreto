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
      // Trava de segurança: Nunca permite data de fim no futuro
      dataFim = dataFimSolicitada > agora ? agora : dataFimSolicitada;
    } else {
      let diasAtras = 7;
      if (tipo === "quinzenal") diasAtras = 14;
      if (tipo === "mensal") diasAtras = 30;

      dataInicio = new Date();
      dataInicio.setDate(agora.getDate() - diasAtras);
      dataFim = agora;
    }

    // Converte para Timestamps Unix em segundos para a Graph API da Meta
    const since = Math.floor(dataInicio.getTime() / 1000);
    const until = Math.floor(dataFim.getTime() / 1000);

    const supabase = getSupabaseAdminClient();

    // 1. Busca prioritária do token ativo na tabela system_config
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
      .select("*", { count: "exact", head: true });

    const { count: estudosCount } = await supabase
      .from("progresso")
      .select("*", { count: "exact", head: true });

    let instagramData = {
      seguidores: 0,
      visitasPerfil: 0,
      cliquesBio: 0,
    };

    const actorId = process.env.INSTAGRAM_ACTOR_ID;
    const targetUsername = process.env.INSTAGRAM_TARGET_USERNAME;

    if (actorId && targetUsername && igToken) {
      try {
        // A) Seguidores Atuais
        const urlDiscovery = `https://graph.facebook.com/v26.0/${actorId}?fields=business_discovery.username(${targetUsername}){followers_count,media_count,username}&access_token=${igToken}`;
        
        // B) Insights Filtrados (profile_views e website_clicks)
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
        } else {
          const errDisc = await resDiscovery.json();
          console.error("Erro no Business Discovery do Instagram:", errDisc);
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
        } else {
          const errIns = await resInsights.json();
          console.error("Erro nos Insights do Instagram:", errIns);
        }
      } catch (errIg) {
        console.error("Erro na consulta da Meta Graph API:", errIg);
      }
    }

    // WhatsApp
    let whatsappData = {
      acesso: 0,
      briefing: 0,
      afiliacao: 0,
      integrada: 0,
      story: 0,
      conteudo: 0,
      lead: 0,
      cliente: 0,
      clienteCreator: 0,
      followUp: 0,
      semRetorno: 0,
      pausa: 0,
      inativa: 0,
      desistencia: 0,
    };

    const evoUrl = process.env.EVOLUTION_API_URL;
    const evoKey = process.env.EVOLUTION_API_KEY;
    const evoInstance = process.env.EVOLUTION_INSTANCE_NAME;

    if (evoUrl && evoKey && evoInstance) {
      try {
        const resEvo = await fetch(`${evoUrl}/label/findLabels/${evoInstance}`, {
          headers: { apikey: evoKey },
        });

        if (resEvo.ok) {
          const labels = await resEvo.json();
          if (Array.isArray(labels)) {
            labels.forEach((label: any) => {
              const nome = (label.name || "").toLowerCase().trim();
              const count = label.count || label.contactsCount || 0;

              if (nome.includes("acesso")) whatsappData.acesso = count;
              if (nome.includes("briefing")) whatsappData.briefing = count;
              if (nome.includes("afiliação") || nome.includes("afiliacao")) whatsappData.afiliacao = count;
              if (nome.includes("integrada")) whatsappData.integrada = count;
              if (nome.includes("story")) whatsappData.story = count;
              if (nome.includes("conteúdo") || nome.includes("conteudo")) whatsappData.conteudo = count;
              if (nome.includes("lead")) whatsappData.lead = count;
              if (nome.includes("cliente creator")) whatsappData.clienteCreator = count;
              else if (nome.includes("cliente")) whatsappData.cliente = count;
              if (nome.includes("follow")) whatsappData.followUp = count;
              if (nome.includes("sem retorno")) whatsappData.semRetorno = count;
              if (nome.includes("pausa")) whatsappData.pausa = count;
              if (nome.includes("inativa")) whatsappData.inativa = count;
              if (nome.includes("desistência") || nome.includes("desistencia")) whatsappData.desistencia = count;
            });
          }
        }
      } catch (errWpp) {
        console.error("Erro ao carregar dados do WhatsApp:", errWpp);
      }
    }

    return NextResponse.json({
      tipoRelatorio: tipo,
      intervaloExato: {
        inicio: dataInicio.toISOString().split("T")[0],
        fim: dataFim.toISOString().split("T")[0],
      },
      instagram: instagramData,
      tiktok: { seguidores: 0, visitasPerfil: 0 },
      whatsapp: whatsappData,
      supabase: {
        estudosConcluidos: estudosCount || 0,
        conteudosPublicados: conteudosCount || 0,
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