import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, nome, instagram")
      .eq("creator", true)
      .order("nome", { ascending: true });

    if (error) {
      console.error("Erro no Supabase Admin ao buscar creators:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ creators: data || [] });
  } catch (error: any) {
    console.error("Erro interno ao buscar creators:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}