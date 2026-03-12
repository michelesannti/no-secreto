import { getSupabaseClient } from "@/lib/supabase";
import PortalIntro from "./PortalIntro";

export default async function HojePage() {
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

  const estudosConcluidos = progresso?.map((p) => p.estudo_id) || [];

  const proximoEstudo = estudos?.find(
    (e) => !estudosConcluidos.includes(e.id)
  );

  const porcentagem = total ? concluidos / total : 0;

  const blocos = 10;
  const preenchidos = Math.round(porcentagem * blocos);

  const barra =
    "█".repeat(preenchidos) + "░".repeat(blocos - preenchidos);

  return (
    <PortalIntro>

      <div className="min-h-screen bg-[#f9f5e9] pt-28 pb-40 text-[#70412d]">

        <div className="max-w-2xl mx-auto px-8 text-center">

          {/* LOGO */}
          <div className="mb-20 flex justify-center">

            <img
              src="/logo.png"
              alt="No Secreto"
              className="h-36"
            />

          </div>

          {/* FRASE */}
          <div className="mb-16">

            <p className="font-serif text-xl leading-relaxed">

              “Não é sobre fazer perfeito.
              <br />
              É sobre não desistir.”

            </p>

          </div>

          {/* PROGRESSO GRANDE */}
          <div className="mb-20">

            <p className="font-mono text-3xl text-[#C6A46A] mb-4">
              {barra}
            </p>

            <p className="text-sm text-[#70412d]/70">
              {concluidos} de {total} estudos concluídos
            </p>

          </div>

          {/* BOTÃO */}
          {proximoEstudo && (
            <a
              href={`/secreto/${proximoEstudo.id}`}
              className="block text-center py-4 rounded-full bg-[#70412d] text-[#f9f5e9] tracking-wide text-sm transition hover:opacity-90"
            >
              Iniciar meu tempo com Deus
            </a>
          )}

        </div>

      </div>

    </PortalIntro>
  );
}