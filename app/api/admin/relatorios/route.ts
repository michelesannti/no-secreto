import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    // 1. DADOS AUTOMÁTICOS DO SUPABASE (Conteúdos e Estudos)
    const { count: conteudosCount } = await supabase
      .from("conteudos")
      .select("*", { count: "exact", head: true });

    const { count: estudosCount } = await supabase
      .from("progresso")
      .select("*", { count: "exact", head: true });

    // 2. DADOS AUTOMÁTICOS DO INSTAGRAM (Via Business Discovery)
    let instagramData = {
      seguidores: 0,
      visitasPerfil: 0,
      cliquesBio: 0,
    };

    const actorId = process.env.INSTAGRAM_ACTOR_ID;
    const targetUsername = process.env.INSTAGRAM_TARGET_USERNAME;
    const igToken = process.env.FACEBOOK_USER_ACCESS_TOKEN;

    if (actorId && targetUsername && igToken) {
      try {
        const url = `https://graph.facebook.com/v26.0/${actorId}?fields=business_discovery.username(${targetUsername}){followers_count,media_count,username}&access_token=${igToken}`;
        const resIg = await fetch(url, { next: { revalidate: 3600 } });
        
        if (resIg.ok) {
          const json = await resIg.json();
          if (json.business_discovery) {
            instagramData.seguidores = json.business_discovery.followers_count || 0;
            // Opcional: se quiser guardar o media_count em algum lugar ou exibir
          }
        } else {
          const errorJson = await resIg.json();
          console.error("Erro na Graph API do Instagram:", errorJson);
        }
      } catch (errIg) {
        console.error("Erro ao buscar dados da Meta Graph API:", errIg);
      }
    }

    // 3. DADOS DO WHATSAPP (Via Evolution API caso esteja configurada)
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

    // 4. RETORNO DO RELATÓRIO PRONTO
    return NextResponse.json({
      tipoRelatorio: "semanal",
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