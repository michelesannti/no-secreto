import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appId || !appSecret) {
      return NextResponse.json(
        { error: "FACEBOOK_APP_ID ou FACEBOOK_APP_SECRET não configurados" },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdminClient();

    let currentToken = process.env.FACEBOOK_USER_ACCESS_TOKEN;
    const { data: configData } = await supabase
      .from("system_config")
      .select("value")
      .eq("key", "FACEBOOK_USER_ACCESS_TOKEN")
      .maybeSingle();

    if (configData?.value) {
      currentToken = configData.value;
    }

    if (!currentToken) {
      return NextResponse.json(
        { error: "Nenhum token encontrado para renovar" },
        { status: 400 }
      );
    }

    const urlMeta = `https://graph.facebook.com/v26.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`;

    const resMeta = await fetch(urlMeta, { cache: "no-store" });
    const jsonMeta = await resMeta.json();

    if (!resMeta.ok || !jsonMeta.access_token) {
      console.error("Erro ao renovar token na Meta:", jsonMeta);
      return NextResponse.json(
        { error: "Falha na renovação com a Meta", details: jsonMeta },
        { status: 400 }
      );
    }

    const newToken = jsonMeta.access_token;

    const { error: updateError } = await supabase
      .from("system_config")
      .upsert(
        {
          key: "FACEBOOK_USER_ACCESS_TOKEN",
          value: newToken,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (updateError) {
      console.error("Erro ao salvar o novo token no Supabase:", updateError);
      return NextResponse.json(
        { error: "Token renovado na Meta, mas falhou ao salvar no Supabase" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token do Instagram renovado e atualizado no Supabase com sucesso!",
      expires_in: jsonMeta.expires_in,
    });
  } catch (error: any) {
    console.error("Erro no cron de renovação do token:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}