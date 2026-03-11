import { getSupabaseClient } from "@/lib/supabase";

export default async function HojePage() {
  const supabase = getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, apelido")
    .eq("id", user?.id)
    .single();

  const nome = profile?.apelido || profile?.nome;

  // hora Brasil
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

  // estudos
  const { data: estudos } = await supabase
    .from("estudos")
    .select("*")
    .order("ordem", { ascending: true });

  // progresso
  const { data: progresso } = await supabase
    .from("progresso_usuario")
    .select("estudo_id")
    .eq("user_id", user?.id);

  const concluidos = progresso?.length || 0;
  const total = estudos?.length || 0;

  const estudosConcluidos = progresso?.map((p) => p.estudo_id) || [];

  const proximoEstudo = estudos?.find(
    (e) => !estudosConcluidos.includes(e.id)
  );

  // barra de progresso
  const porcentagem = total ? concluidos / total : 0;
  const blocos = 8;
  const preenchidos = Math.round(porcentagem * blocos);

  const barra =
    "█".repeat(preenchidos) + "░".repeat(blocos - preenchidos);

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

        {/* FRASE DO APP */}
        <div className="bg-[#f3ecdd] p-8 rounded-2xl mb-10 text-center">

          <p className="font-serif text-xl leading-relaxed">
            Não é sobre fazer perfeito.<br/>
            É sobre não desistir.
          </p>

        </div>

        {/* PROGRESSO */}
        <div className="text-center mb-10">

          <p className="text-sm mb-2 text-[#70412d]/70">
            {concluidos} de {total} estudos concluídos
          </p>

          <p className="font-mono text-lg text-[#C6A46A]">
            {barra}
          </p>

        </div>

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