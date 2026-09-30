import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

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

    // Se NÃO for STORY, o link do Instagram é obrigatório
    if (!isStory && (!link_instagram || !link_instagram.trim())) {
      return NextResponse.json(
        { error: "O link do Instagram é obrigatório para este formato." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("conteudos")
      .insert({
        creator_id,
        tipo_conteudo: tipo_conteudo || "RELATO",
        formato: formato || "REEL",
        link_instagram: isStory ? null : link_instagram.trim(),
        link_tiktok: isStory ? null : (link_tiktok?.trim() || null),
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
      message: "Conteúdo cadastrado🤎",
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