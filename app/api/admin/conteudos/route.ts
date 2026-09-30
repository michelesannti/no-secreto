import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Função auxiliar para validar e sanitizar URLs
function isValidUrl(urlString: string, domain: string): boolean {
  try {
    const url = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
    return url.hostname.includes(domain);
  } catch {
    return false;
  }
}

function sanitizeUrl(urlString: string): string {
  const trimmed = urlString.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export async function POST(req: Request) {
  try {
    const { creator_id, link_instagram, tipo_conteudo, formato, link_tiktok } = await req.json();

    if (!creator_id) {
      return NextResponse.json(
        { error: "Selecione uma Creator." },
        { status: 400 }
      );
    }

    const isStory = formato === "STORY";
    let formattedInsta = link_instagram ? sanitizeUrl(link_instagram) : "";
    let formattedTiktok = link_tiktok ? sanitizeUrl(link_tiktok) : "";

    // Validação para formatos que NÃO são STORY
    if (!isStory) {
      if (!formattedInsta) {
        return NextResponse.json(
          { error: "O link do Instagram é obrigatório para este formato." },
          { status: 400 }
        );
      }

      if (!isValidUrl(formattedInsta, "instagram.com")) {
        return NextResponse.json(
          { error: "Insira um link válido do Instagram" },
          { status: 400 }
        );
      }

      if (formattedTiktok && !isValidUrl(formattedTiktok, "tiktok.com")) {
        return NextResponse.json(
          { error: "Insira um link válido do TikTok" },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("conteudos")
      .insert({
        creator_id,
        tipo_conteudo: tipo_conteudo || "RELATO",
        formato: formato || "REEL",
        link_instagram: isStory ? null : formattedInsta,
        link_tiktok: isStory ? null : (formattedTiktok || null),
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar conteúdo:", error);
      return NextResponse.json(
        { error: `Erro no banco de dados: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Conteúdo registrado 🤎",
      data,
    });
  } catch (error: any) {
    console.error("Erro interno no servidor:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}