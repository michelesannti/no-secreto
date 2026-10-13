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

    // 2. DADOS AUTOMÁTICOS DO INSTAGRAM (Leitura pública direta do perfil)
    let instagramData = {
      seguidores: 0,
      visitasPerfil: 0,
      cliquesBio: 0,
    };

    try {
      // Consulta os dados públicos do perfil do Instagram sem precisar de token do Facebook
      const resIg = await fetch(
        "https://www.instagram.com/nosecretoapp/?__a=1&__d=dis",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          next: { revalidate: 3600 }, // Cache de 1 hora
        }
      );

      if (resIg.ok) {
        const text = await resIg.text();
        try {
          const json = JSON.parse(text);
          const userData = json?.graphql?.user || json?.data?.user;
          if (userData) {
            instagramData.seguidores = userData.edge_followed_by?.count || 0;
          }
        } catch {
          // Fallback caso o Instagram retorne HTML de segurança
        }
      }
    } catch (errIg) {
      console.error("Erro ao buscar dados do Instagram:", errIg);
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
      tipoRelatorio: "mensal",
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