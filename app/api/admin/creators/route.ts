import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: Request) {
  try {
    const { nome, email, instagram } = await req.json();

    if (!email || !nome) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    const emailFormatted = email.trim().toLowerCase();
    const nomeFormatted = nome.trim();
    const instagramFormatted = instagram ? instagram.trim().replace("@", "") : null;

    // 1. Busca se a usuária já possui um perfil cadastrado na tabela 'profiles'
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, ativo, acesso, creator")
      .eq("email", emailFormatted)
      .maybeSingle();

    if (existingProfile) {
      // Se a usuária já existe: apenas ativa a flag de creator e atualiza nome e instagram.
      // Preserva intocadas as colunas 'ativo' e 'acesso' (vital para a gestão de assinaturas).
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          nome: nomeFormatted,
          instagram: instagramFormatted,
          creator: true,
        })
        .eq("id", existingProfile.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Erro ao atualizar o perfil existente para Creator." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Usuária existente identificada! Flag de Creator ativada mantendo o status de acesso original.",
      });
    }

    // 2. Se for um e-mail 100% novo: insere a nova Creator.
    // A coluna 'data_local' é preenchida automaticamente pela trigger 'trg_profiles_data_local' no Supabase.
    const { error: insertError } = await supabaseAdmin
      .from("profiles")
      .insert({
        email: emailFormatted,
        nome: nomeFormatted,
        instagram: instagramFormatted,
        acesso: "GRATUITO",
        ativo: true,
        creator: true,
      });

    if (insertError) {
      console.error("Erro ao criar perfil de creator:", insertError);
      return NextResponse.json(
        { error: "Erro ao cadastrar nova creator no banco de dados." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Nova Creator cadastrada com sucesso!",
    });
  } catch (error) {
    console.error("Erro no cadastro de creator:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}