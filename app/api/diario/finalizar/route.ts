import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { userId, estudoId, destaque, texto, dataLocal } = await request.json();

    if (!userId || !estudoId || !dataLocal) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Cria o cliente do Supabase usando a chave de serviço (service_role) no servidor
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // 1. Salva o diário
    const { error: erroDiario } = await supabaseAdmin.from("diario").upsert({
      user_id: userId,
      estudo_id: estudoId,
      destaque,
      texto: texto || "",
      data_local: dataLocal,
    });

    if (erroDiario) {
      console.error("Erro ao salvar diário:", erroDiario);
      return NextResponse.json({ error: "Erro ao salvar diário" }, { status: 500 });
    }

    // 2. Salva o progresso logo em seguida
    const { error: erroProgresso } = await supabaseAdmin.from("progresso").upsert({
      user_id: userId,
      estudo_id: estudoId,
      data_local: dataLocal,
    });

    if (erroProgresso) {
      console.error("Erro ao salvar progresso:", erroProgresso);
      return NextResponse.json({ error: "Erro ao salvar progresso" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro interno na API de finalização:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}