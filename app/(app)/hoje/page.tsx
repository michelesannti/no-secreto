import { getSupabaseClient } from "@/lib/supabase";

export default async function HojePage() {
  const supabase = getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nome = "Amiga";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nome, apelido")
      .eq("id", user.id)
      .single();

    if (profile) {
      nome = profile.apelido || profile.nome || "Amiga";
    }
  }

  const hora = new Date().getHours();

  let saudacao = "Bom dia";

  if (hora >= 12 && hora < 18) saudacao = "Boa tarde";
  if (hora >= 18) saudacao = "Boa noite";

  return (
    <div className="min-h-screen bg-[#f9f5e9] pt-6 pb-40 text-[#70412d]">

      {/* TOPO */}
      <div className="px-8 mb-12">
        <h1 className="text-xl font-serif tracking-wide">
          Hoje
        </h1>

        <div className="w-10 h-[2px] bg-[#C6A46A]/60 mt-2"></div>
      </div>

      <div className="max-w-2xl mx-auto px-8">

        {/* SAUDAÇÃO */}
        <h2 className="text-2xl font-serif mb-6">
          {saudacao} {nome} 🤎
        </h2>

        {/* VERSÍCULO */}
        <div className="bg-[#f3ecdd] p-6 rounded-2xl mb-10">
          <p className="text-sm text-[#70412d]/60 mb-2">
            Versículo do dia
          </p>

          <p className="text-lg italic text-[#70412d]">
            “Buscai primeiro o Reino de Deus e a sua justiça...”
          </p>

          <p className="text-sm text-[#C6A46A] mt-2">
            Mateus 6:33
          </p>
        </div>

        {/* BOTÃO */}
        <a
          href="/secreto"
          className="block text-center py-3 rounded-full bg-[#70412d] text-[#f9f5e9] tracking-wide"
        >
          Entrar no Secreto
        </a>

      </div>
    </div>
  );
}