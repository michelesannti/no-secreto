import { getSupabaseClient } from "@/lib/supabase";

export default async function SecretoPage() {
  const supabase = getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: estudos } = await supabase
    .from("estudos")
    .select("*")
    .order("ordem", { ascending: true });

  const { data: progresso } = await supabase
    .from("progresso_usuario")
    .select("estudo_id")
    .eq("user_id", user?.id);

  const concluidos = progresso?.length || 0;
  const total = estudos?.length || 0;

  const porcentagem = total ? concluidos / total : 0;

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="px-8 mb-12">

        <h1 className="text-xl font-serif tracking-wide">
          Secreto
        </h1>

        <div className="w-10 h-[2px] bg-[#C6A46A]/70 mt-2"></div>

      </div>

      <div className="max-w-2xl mx-auto px-8">

        {/* PROGRESSO */}
        <div className="mb-16">

          <p className="text-sm text-[#70412d]/70 mb-4">
            Sua jornada
          </p>

          <div className="relative w-full h-[4px] bg-[#e9d5bb] rounded-full">

            <div
              className="absolute top-0 left-0 h-[4px] bg-[#C6A46A] rounded-full transition-all duration-700"
              style={{ width: `${porcentagem * 100}%` }}
            />

            <div
              className="absolute -top-[6px] w-4 h-4 rounded-full bg-[#C6A46A]"
              style={{ left: `calc(${porcentagem * 100}% - 8px)` }}
            />

          </div>

          <p className="mt-4 text-sm text-[#70412d]/70">
            {concluidos} de {total} estudos concluídos
          </p>

        </div>

        {/* LISTA DE ESTUDOS */}
        <div className="space-y-6">

          {estudos?.map((estudo) => (
            <a
              key={estudo.id}
              href={`/secreto/${estudo.id}`}
              className="block p-5 rounded-xl bg-[#f3ecdd] transition hover:opacity-90"
            >

              <p className="font-semibold">
                {estudo.titulo}
              </p>

              <p className="text-sm text-[#70412d]/60 mt-1">
                {estudo.livro} {estudo.capitulo}:{estudo.versiculo_inicio}
                {estudo.versiculo_fim !== estudo.versiculo_inicio &&
                  `-${estudo.versiculo_fim}`}
              </p>

            </a>
          ))}

        </div>

      </div>

    </div>
  );
}