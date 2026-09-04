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
    // Remove espaços, @ e barras caso venha um link
    const instagramFormatted = instagram
      .trim()
      .replace(/@/g, "")
      .replace(/https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/\//g, "")
      .toLowerCase();

    // 1. Busca se a usuária já possui um perfil cadastrado
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
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          nome: nomeFormatted,
          instagram: instagramFormatted,
          creator: true,
        })
        .eq("id", existingProfile.id);

      if (updateError) {
        console.error("Erro no update da creator:", updateError);
        return NextResponse.json(
          { error: `Erro ao atualizar perfil: ${updateError.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Usuária existente identificada! Flag de Creator ativada.",
      });
    }

    // 2. Se for e-mail novo: insere
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
      console.error("Erro no insert da creator:", insertError);
      return NextResponse.json(
        { error: `Erro ao cadastrar no banco: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Nova Creator cadastrada com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro interno no servidor:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}