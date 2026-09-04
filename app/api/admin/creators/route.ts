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

    // 1. Busca se E-MAIL, INSTAGRAM ou NOME já existem na tabela 'profiles'
    const { data: existingProfiles, error: searchError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, nome, instagram, creator")
      .or(`email.eq.${emailFormatted},instagram.eq.${instagramFormatted},nome.ilike.${nomeFormatted}`);

    if (searchError) {
      console.error("Erro ao buscar perfil existente:", searchError);
      return NextResponse.json(
        { error: `Erro na busca do banco: ${searchError.message}` },
        { status: 500 }
      );
    }

    // Se encontrou qualquer registro correspondente por e-mail, instagram ou nome
    if (existingProfiles && existingProfiles.length > 0) {
      const found = existingProfiles[0];

      if (found.email === emailFormatted) {
        if (found.creator) {
          return NextResponse.json(
            { error: "Este e-mail já está cadastrado como Creator 🤎" },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: "Este e-mail pertence a uma cliente. Altere a coluna 'creator' para TRUE diretamente no banco de dados." },
          { status: 400 }
        );
      }

      if (found.instagram === instagramFormatted) {
        return NextResponse.json(
          { error: `O Instagram @${instagramFormatted} já está cadastrado no sistema.` },
          { status: 400 }
        );
      }

      if (found.nome.toLowerCase() === nomeFormatted.toLowerCase()) {
        return NextResponse.json(
          { error: `Já existe uma conta com o nome '${nomeFormatted}'. Verifique no banco se é a mesma pessoa.` },
          { status: 400 }
        );
      }
    }

    // 2. Se NENHUM dos dados existe: cria no Supabase Auth (Creator Nova)
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

    // 3. Insere em 'profiles'
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