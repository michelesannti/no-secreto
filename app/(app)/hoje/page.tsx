import { getSupabaseClient } from "@/lib/supabase";

export default async function HojePage() {
  const supabase = getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // buscar perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, apelido")
    .eq("id", user?.id)
    .single();

  const nome = profile?.apelido || profile?.nome;

  // hora no Brasil
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "numeric",
      hour12: false,
    }).format(new Date())
  );

  let saudacao = "Bom dia";

  if (hora >= 12 && hora < 18) saudacao = "Boa tarde";
  if (hora >= 18) saudacao = "Boa noite";

  // buscar estudos
  const { data: estudos } = await supabase
    .from("estudos")
    .select("*")
    .order("ordem", { ascending: true });

  // progresso da usuária
  const { data: progresso } = await supabase
    .from("progresso_usuario")
    .select("estudo_id")
    .eq("user_id", user?.id);

  const estudosConcluidos = progresso?.map((p) => p.estudo_id) || [];

  const proximoEstudo = estudos?.find(
    (e) => !estudosConcluidos.includes(e.id)
  );

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">

      {/* SAUDAÇÃO */}
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          {saudacao} {nome} 🤎
        </h1>

        <div className="w-10 h-[2px] bg-[#C6A46A]/60 mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">

        {/* FRASE DO ESTUDO */}
        {proximoEstudo && (
          <div className="bg-[#f3ecdd] p-8 rounded-2xl mb-12 text-center">

            <p className="font-serif text-2xl leading-relaxed text-[#70412d]">
              “{proximoEstudo.frase}”
            </p>

            <p className="text-sm text-[#C6A46A] mt-4">
              {proximoEstudo.livro} {proximoEstudo.capitulo}:
              {proximoEstudo.versiculo_inicio}
              {proximoEstudo.versiculo_fim !==
                proximoEstudo.versiculo_inicio &&
                `-${proximoEstudo.versiculo_fim}`}
            </p>

          </div>
        )}

        {/* BOTÃO */}
        {proximoEstudo && (
          <a
            href={`/secreto/${proximoEstudo.id}`}
            className="block text-center py-3 rounded-full bg-[#70412d] text-[#f9f5e9] tracking-wide"
          >
            Iniciar meu tempo com Deus
          </a>
        )}

      </div>
    </div>
  );
}