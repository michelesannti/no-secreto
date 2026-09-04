import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: Request) {
  try {
    const { nome, email, instagram } = await req.json();

    if (!email || !nome || !instagram) {
      return NextResponse.json(
        { error: "Nome, e-mail e Instagram são obrigatórios." },
        { status: 400 }
      );
    }

    const emailFormatted = email.trim().toLowerCase();
    const nomeFormatted = nome.trim();
    const instagramFormatted = instagram
      .trim()
      .replace(/@/g, "")
      .replace(/https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/\//g, "")
      .toLowerCase();

    // 1. Busca se a usuária já possui um perfil cadastrado na tabela 'profiles'
    const { data: existingProfile, error: searchError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, ativo, acesso, creator")
      .eq("email", emailFormatted)
      .maybeSingle();

    if (searchError) {
      console.error("Erro ao buscar perfil existente:", searchError);
      return NextResponse.json(
        { error: `Erro na busca do banco: ${searchError.message}` },
        { status: 500 }
      );
    }

    if (existingProfile) {
      // Se a usuária já existe em profiles: apenas atualiza as informações e ativa a flag creator.
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          nome: nomeFormatted,
          instagram: instagramFormatted,
          creator: true,
        })
        .eq("id", existingProfile.id);

      if (updateError) {
        console.error("Erro no update da creator existente:", updateError);
        return NextResponse.json(
          { error: `Erro ao atualizar perfil existente: ${updateError.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Creator cadastrada 🤎",
      });
    }

    // 2. Se não existe em profiles: cria no Supabase Auth primeiro
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: emailFormatted,
      email_confirm: true,
      user_metadata: { nome: nomeFormatted },
    });

    if (authError || !authData.user) {
      console.error("Erro ao criar usuário no Supabase Auth:", authError);
      return NextResponse.json(
        { error: `Erro ao criar autenticação da creator: ${authError?.message || "Erro desconhecido"}` },
        { status: 500 }
      );
    }

    const newUserId = authData.user.id;

    // 3. Atualiza ou insere (upsert) na tabela 'profiles' para evitar conflito com a Trigger automática do Supabase
    const { error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: newUserId,
          email: emailFormatted,
          nome: nomeFormatted,
          instagram: instagramFormatted,
          acesso: "GRATUITO",
          ativo: true,
          creator: true,
        },
        { onConflict: "id" }
      );

    if (upsertError) {
      console.error("Erro no upsert da creator em profiles:", upsertError);
      return NextResponse.json(
        { error: `Erro ao salvar dados do perfil: ${upsertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Creator cadastrada 🤎",
    });
  } catch (error: any) {
    console.error("Erro interno no servidor:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}