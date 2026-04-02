import { redirect } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default async function SecretoPage() {
  const supabase = getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const jornadaAtual = "genesis-1";

  // Busca todos os estudos da jornada atual, na ordem certa
  const { data: estudos, error: estudosError } = await supabase
    .from("estudos")
    .select("id, ordem, jornada")
    .eq("jornada", jornadaAtual)
    .order("ordem", { ascending: true });

  if (estudosError || !estudos || estudos.length === 0) {
    return <div className="p-6 text-[#70412d]">nenhum estudo encontrado para essa jornada</div>;
  }

  // Busca os estudos concluídos da usuária
  const { data: progresso, error: progressoError } = await supabase
    .from("progresso_usuario")
    .select("estudo_id")
    .eq("user_id", user.id)
    .eq("concluido", true);

  if (progressoError) {
    return <div className="p-6 text-[#70412d]">erro ao carregar progresso</div>;
  }

  const concluidosIds = progresso?.map((item) => item.estudo_id) || [];

  // Pega o primeiro estudo da jornada que ainda não foi concluído
  const proximoEstudo = estudos.find(
    (estudo) => !concluidosIds.includes(estudo.id)
  );

  // Se ainda existe estudo a fazer, manda pra ele
  if (proximoEstudo) {
    return redirect(`/secreto/${proximoEstudo.id}`);
  }

  // Se concluiu tudo dessa jornada, volta pro Hoje por enquanto
  return redirect("/hoje");
}