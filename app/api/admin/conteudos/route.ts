import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: Request) {
  try {
    const { creator_id, link_instagram, tipo_conteudo, formato, link_tiktok } = await req.json();

    // 1. Validação da Creator
    if (!creator_id) {
      return NextResponse.json(
        { error: "Selecione uma Creator." },
        { status: 400 }
      );
    }

    // 2. Se não for Stories, o link do Instagram é obrigatório
    if (formato !== "Stories" && (!link_instagram || !link_instagram.trim())) {
      return NextResponse.json(
        { error: "O link do Instagram é obrigatório para este formato." },
        { status: 400 }
      );
    }

    const instagramUrl = link_instagram?.trim() || null;

    // 3. Inserção no Supabase (data_local é preenchido pela trigger automática)
    const { data, error } = await supabaseAdmin
      .from("conteudos")
      .insert({
        creator_id: creator_id,
        link_instagram: instagramUrl,
        tipo_conteudo: tipo_conteudo || "Organico",
        formato: formato || "Reels",
        link_tiktok: link_tiktok?.trim() || null,
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