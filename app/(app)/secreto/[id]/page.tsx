import { getSupabaseClient } from "@/lib/supabase";
import ConcluirButton from "./ConcluirButton";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EstudoPage({ params }: PageProps) {
  const supabase = getSupabaseClient();

  // 🔐 pega usuário logado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 📖 busca estudo
  const { data: estudo, error } = await supabase
    .from("estudos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !estudo) {
    return <div className="p-6">estudo não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          No Secreto
        </h1>
        <div className="w-10 h-[2px] bg-[#e9d5bb] mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">

        {/* PALAVRA */}
        <div className="mb-16">
          <p className="text-sm tracking-widest text-[#70412d]/50 mb-4">
            PALAVRA
          </p>

          <p className="italic text-lg leading-relaxed text-[#70412d]/85">
            {estudo.texto}
          </p>

          <p className="mt-3 text-sm text-[#70412d]/60">
            {estudo.livro} {estudo.capitulo}:{estudo.versiculo}
          </p>
        </div>

        {/* CONTEXTO */}
        <div className="mb-10">
          <p className="text-sm tracking-widest text-[#70412d]/50 mb-8">
            CONTEXTO
          </p>

          <div className="space-y-16">

            <div>
              <h2 className="font-semibold text-[17px] text-[#70412d] mb-4">
                O que estava acontecendo
              </h2>

              <p className="leading-8 text-[#70412d]/85">
                {estudo.contexto}
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-[17px] text-[#70412d] mb-4">
                Trazendo pra vida
              </h2>

              <p className="leading-8 text-[#70412d]/85">
                {estudo.aplicacao}
              </p>
            </div>

          </div>
        </div>

        {/* FRASE DESTACADA */}
        <div className="flex items-center justify-center mt-16 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-[1.5px] h-8 bg-[#e9d5bb]"></div>

            <p className="font-serif text-xl font-semibold text-center leading-snug">
              {estudo.frase}
            </p>

            <div className="w-[1.5px] h-8 bg-[#e9d5bb]"></div>
          </div>
        </div>

        {/* BOTÃO CONCLUIR */}
        {user && (
          <ConcluirButton
            estudoId={estudo.id}
            userId={user.id}
          />
        )}

      </div>
    </div>
  );
}